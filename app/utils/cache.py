"""Cache manager for reducing file I/O - Optimized with LRU and thread safety"""

import json
import time
import logging
import threading
from collections import OrderedDict
from pathlib import Path
from typing import Any, Optional, Callable
from functools import wraps

logger = logging.getLogger(__name__)


class CacheEntry:
    """Single cache entry with TTL and access tracking"""
    
    __slots__ = ['data', 'created', 'last_accessed', 'ttl', 'access_count']
    
    def __init__(self, data: Any, ttl: float = 5.0):
        self.data = data
        self.created = time.time()
        self.last_accessed = self.created
        self.ttl = ttl
        self.access_count = 0
    
    @property
    def is_valid(self) -> bool:
        return (time.time() - self.created) < self.ttl
    
    def access(self) -> Any:
        """Mark as accessed and return data"""
        self.last_accessed = time.time()
        self.access_count += 1
        return self.data


class LRUCacheManager:
    """In-memory cache with LRU eviction and thread safety"""
    
    def __init__(self, default_ttl: float = 5.0, max_size: int = 100):
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self.default_ttl = default_ttl
        self.max_size = max_size
        self._lock = threading.RLock()
        self._hits = 0
        self._misses = 0
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached data if valid (thread-safe)"""
        with self._lock:
            entry = self._cache.get(key)
            if entry and entry.is_valid:
                self._hits += 1
                # Move to end (most recently used)
                self._cache.move_to_end(key)
                return entry.access()
            elif entry:
                # Expired, remove
                del self._cache[key]
            self._misses += 1
            return None
    
    def set(self, key: str, data: Any, ttl: float = None):
        """Set cache data with LRU eviction (thread-safe)"""
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
                self._cache[key] = CacheEntry(data, ttl or self.default_ttl)
            else:
                if len(self._cache) >= self.max_size:
                    # Evict least recently used
                    self._cache.popitem(last=False)
                self._cache[key] = CacheEntry(data, ttl or self.default_ttl)
    
    def invalidate(self, key: str):
        """Remove specific cache entry"""
        with self._lock:
            self._cache.pop(key, None)
    
    def invalidate_all(self):
        """Clear all cache"""
        with self._lock:
            self._cache.clear()
    
    def invalidate_pattern(self, pattern: str):
        """Remove cache entries matching pattern"""
        with self._lock:
            keys_to_remove = [k for k in self._cache if pattern in k]
            for key in keys_to_remove:
                del self._cache[key]
    
    def get_or_load(self, key: str, loader: Callable, ttl: float = None) -> Any:
        """Get from cache or load using provided function"""
        data = self.get(key)
        if data is not None:
            return data
        
        try:
            data = loader()
            self.set(key, data, ttl)
            return data
        except Exception as e:
            logger.warning(f"Failed to load cache key '{key}': {e}")
            return None
    
    @property
    def stats(self) -> dict:
        """Get cache statistics"""
        total = self._hits + self._misses
        hit_rate = (self._hits / total * 100) if total > 0 else 0
        return {
            'size': len(self._cache),
            'max_size': self.max_size,
            'hits': self._hits,
            'misses': self._misses,
            'hit_rate': f"{hit_rate:.1f}%"
        }
    
    def cleanup_expired(self):
        """Remove all expired entries"""
        with self._lock:
            expired_keys = [
                key for key, entry in self._cache.items()
                if not entry.is_valid
            ]
            for key in expired_keys:
                del self._cache[key]


class JsonCache:
    """Specialized cache for JSON files with auto-save and write-behind"""
    
    def __init__(self, cache_manager: LRUCacheManager):
        self.cache = cache_manager
        self._dirty: dict[str, Any] = {}
        self._write_lock = threading.Lock()
    
    def load(self, file_path: Path, key: str = None) -> Any:
        """Load JSON file with caching"""
        key = key or str(file_path)
        
        def loader():
            if not file_path.exists():
                return None
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in {file_path}: {e}")
                return None
            except Exception as e:
                logger.error(f"Failed to read {file_path}: {e}")
                return None
        
        return self.cache.get_or_load(key, loader, ttl=30.0)
    
    def save(self, file_path: Path, data: Any, key: str = None, immediate: bool = True):
        """Save JSON file and update cache"""
        key = key or str(file_path)
        
        try:
            if immediate:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                self.cache.set(key, data, ttl=30.0)
            else:
                # Write-behind: mark as dirty, save later
                with self._write_lock:
                    self._dirty[key] = (file_path, data)
                self.cache.set(key, data, ttl=30.0)
        except Exception as e:
            logger.error(f"Failed to write {file_path}: {e}")
    
    def flush_dirty(self):
        """Flush all dirty entries to disk"""
        with self._write_lock:
            for key, (file_path, data) in self._dirty.items():
                try:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                except Exception as e:
                    logger.error(f"Failed to flush {file_path}: {e}")
            self._dirty.clear()
    
    def mark_dirty(self, key: str):
        """Mark cache entry as dirty"""
        self.cache.invalidate(key)


class ContentCache:
    """Cache for markdown file contents with LRU"""
    
    def __init__(self, max_size: int = 50):
        self._cache: OrderedDict[str, str] = OrderedDict()
        self.max_size = max_size
        self._lock = threading.RLock()
    
    def get(self, post_id: str) -> Optional[str]:
        with self._lock:
            if post_id in self._cache:
                self._cache.move_to_end(post_id)
                return self._cache[post_id]
            return None
    
    def set(self, post_id: str, content: str):
        with self._lock:
            if post_id in self._cache:
                self._cache.move_to_end(post_id)
                self._cache[post_id] = content
            else:
                if len(self._cache) >= self.max_size:
                    self._cache.popitem(last=False)
                self._cache[post_id] = content
    
    def invalidate(self, post_id: str):
        with self._lock:
            self._cache.pop(post_id, None)
    
    def invalidate_all(self):
        with self._lock:
            self._cache.clear()


# Decorator for caching function results
def cached(cache_manager: LRUCacheManager, ttl: float = 10.0):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            key = f"{func.__name__}:{args}:{sorted(kwargs.items())}"
            
            def loader():
                return func(*args, **kwargs)
            
            return cache_manager.get_or_load(key, loader, ttl)
        return wrapper
    return decorator
