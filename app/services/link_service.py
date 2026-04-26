"""Link service for managing links.json - Optimized with LRU caching and error handling"""

import json
import logging
from pathlib import Path
from typing import Optional

from app.config import config
from app.models.link import Link
from app.utils.cache import LRUCacheManager, JsonCache

logger = logging.getLogger(__name__)


class LinkService:
    """Service for managing links with caching"""
    
    def __init__(self):
        self.links_file = config.links_file
        
        self.cache = LRUCacheManager(default_ttl=30.0, max_size=50)
        self.json_cache = JsonCache(self.cache)
    
    def get_all_links(self) -> list[Link]:
        """Get all links from cache"""
        data = self.json_cache.load(self.links_file, key='links')
        if not data:
            return []
        
        return [Link.from_dict(item) for item in data]
    
    def add_link(self, link: Link) -> bool:
        """Add a new link"""
        try:
            if not link.id:
                link.id = self._get_next_id()
            
            data = self.json_cache.load(self.links_file, key='links') or []
            data.append(link.to_dict())
            
            self.json_cache.save(self.links_file, data, key='links')
            
            return True
        except Exception as e:
            logger.error(f'Error adding link: {e}')
            return False
    
    def update_link(self, link: Link) -> bool:
        """Update an existing link"""
        try:
            data = self.json_cache.load(self.links_file, key='links')
            if not data:
                return False
            
            for i, item in enumerate(data):
                if item.get('id') == link.id:
                    data[i] = link.to_dict()
                    break
            
            self.json_cache.save(self.links_file, data, key='links')
            
            return True
        except Exception as e:
            logger.error(f'Error updating link: {e}')
            return False
    
    def delete_link(self, link_id: str) -> bool:
        """Delete a link"""
        try:
            data = self.json_cache.load(self.links_file, key='links')
            if not data:
                return False
            
            data = [item for item in data if item.get('id') != link_id]
            
            self.json_cache.save(self.links_file, data, key='links')
            
            return True
        except Exception as e:
            logger.error(f'Error deleting link: {e}')
            return False
    
    def get_categories(self) -> list[str]:
        """Get all unique link categories"""
        links = self.get_all_links()
        categories = set(link.category for link in links)
        return sorted(categories)
    
    def rebuild_links_json(self) -> bool:
        """Reorganize and clean up links.json with ID reassignment"""
        try:
            # Read directly from file to bypass cache
            if not self.links_file.exists():
                logger.error(f'Links file not found: {self.links_file}')
                return False
            
            with open(self.links_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not data:
                logger.warning('Links file is empty')
                return False
            
            logger.info(f'Loaded {len(data)} links from file')
            
            # Clean up and normalize
            cleaned_data = []
            seen_ids = set()
            
            for item in data:
                # Skip entries without required fields
                if not item.get('name', '').strip():
                    logger.warning(f'Skipping entry with empty name: {item}')
                    continue
                
                # Skip duplicates
                link_id = str(item.get('id', '')).strip()
                if not link_id:
                    logger.warning(f'Skipping entry with empty id: {item}')
                    continue
                
                if link_id in seen_ids:
                    logger.warning(f'Skipping duplicate id: {link_id}')
                    continue
                seen_ids.add(link_id)
                
                # Normalize
                cleaned_item = {
                    'id': link_id,
                    'name': item.get('name', '').strip(),
                    'category': item.get('category', '其他').strip() or '其他',
                    'description': item.get('description', '').strip(),
                    'url': item.get('url', '').strip()
                }
                cleaned_data.append(cleaned_item)
            
            # Sort by original ID
            cleaned_data.sort(key=lambda x: int(x['id']) if x['id'].isdigit() else 0)
            
            logger.info(f'Cleaned data: {len(cleaned_data)} links')
            
            # Reassign sequential IDs starting from 1
            for i, item in enumerate(cleaned_data, 1):
                item['id'] = str(i)
            
            logger.info(f'Reassigned IDs to be sequential: 1-{len(cleaned_data)}')
            
            # Write directly to file
            with open(self.links_file, 'w', encoding='utf-8') as f:
                json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
            
            # Invalidate cache to force reload on next access
            cache_key = 'links'
            self.cache.invalidate(cache_key)
            
            logger.info(f'Links.json reorganized: {len(cleaned_data)} entries')
            return True
        except json.JSONDecodeError as e:
            logger.error(f'Invalid JSON in links file: {e}')
            return False
        except Exception as e:
            logger.error(f'Error reorganizing links.json: {e}', exc_info=True)
            return False
    
    def _get_next_id(self) -> str:
        """Get next available link ID from cache"""
        links = self.get_all_links()
        if not links:
            return '1'
        
        try:
            max_id = max(int(l.id) for l in links if l.id.isdigit())
            return str(max_id + 1)
        except ValueError:
            return '1'
