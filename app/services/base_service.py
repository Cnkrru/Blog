"""Base service class for common CRUD operations"""

import logging
from pathlib import Path
from typing import Any, Optional, List, Generic, TypeVar
from abc import ABC, abstractmethod

from app.utils.cache import LRUCacheManager, JsonCache

logger = logging.getLogger(__name__)

T = TypeVar('T')


class BaseService(Generic[T], ABC):
    """Abstract base class for all services with common CRUD operations"""
    
    def __init__(self, data_file: Path, cache_max_size: int = 50, cache_ttl: float = 30.0):
        self.data_file = data_file
        self.cache = LRUCacheManager(default_ttl=cache_ttl, max_size=cache_max_size)
        self.json_cache = JsonCache(self.cache)
    
    @abstractmethod
    def _from_dict(self, data: dict) -> T:
        """Convert dict to model object"""
        pass
    
    @abstractmethod
    def _to_dict(self, obj: T) -> dict:
        """Convert model object to dict"""
        pass
    
    @abstractmethod
    def _get_id(self, obj: T) -> str:
        """Get object ID"""
        pass
    
    def get_all(self) -> List[T]:
        """Get all items from cache"""
        data = self.json_cache.load(self.data_file, key=str(self.data_file))
        if not data:
            return []
        
        return [self._from_dict(item) for item in data]
    
    def add(self, item: T) -> bool:
        """Add a new item"""
        try:
            if not self._get_id(item):
                item_id = self._generate_id()
                # We need to set the ID on the object
                if hasattr(item, 'id'):
                    item.id = item_id
            
            data = self._load_data()
            data.append(self._to_dict(item))
            
            self._save_data(data)
            return True
        except Exception as e:
            logger.error(f'Error adding item: {e}')
            return False
    
    def update(self, item: T) -> bool:
        """Update an existing item"""
        try:
            data = self._load_data()
            if not data:
                return False
            
            item_id = self._get_id(item)
            for i, existing in enumerate(data):
                if existing.get('id') == item_id:
                    data[i] = self._to_dict(item)
                    break
            
            self._save_data(data)
            return True
        except Exception as e:
            logger.error(f'Error updating item: {e}')
            return False
    
    def delete(self, item_id: str) -> bool:
        """Delete an item by ID"""
        try:
            data = self._load_data()
            if not data:
                return False
            
            data = [item for item in data if item.get('id') != item_id]
            
            self._save_data(data)
            return True
        except Exception as e:
            logger.error(f'Error deleting item: {e}')
            return False
    
    def find_by_id(self, item_id: str) -> Optional[T]:
        """Find item by ID"""
        items = self.get_all()
        for item in items:
            if self._get_id(item) == item_id:
                return item
        return None
    
    def _load_data(self) -> List[dict]:
        """Load data from file"""
        return self.json_cache.load(self.data_file, key=str(self.data_file)) or []
    
    def _save_data(self, data: List[dict]):
        """Save data to file"""
        self.json_cache.save(self.data_file, data, key=str(self.data_file))
    
    def _generate_id(self) -> str:
        """Generate next ID"""
        items = self.get_all()
        if not items:
            return '1'
        
        try:
            max_id = max(int(self._get_id(item)) for item in items if self._get_id(item).isdigit())
            return str(max_id + 1)
        except ValueError:
            return '1'
