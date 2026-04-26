"""Announcement service for managing website announcements - Optimized with LRU caching"""

import logging
from pathlib import Path
from datetime import datetime

from app.config import config
from app.models.announcement import Announcement
from app.utils.cache import LRUCacheManager, ContentCache

logger = logging.getLogger(__name__)


class AnnouncementService:
    """Service for managing announcements"""
    
    def __init__(self):
        self.announcement_file = config.blog_root / 'src' / 'pages' / 'announcement' / 'index.md'
        self.cache = LRUCacheManager(default_ttl=30.0, max_size=10)
        self.content_cache = ContentCache(max_size=10)
    
    def get_announcement(self) -> Announcement:
        """Get announcement with caching"""
        cached = self.cache.get('announcement')
        if cached:
            return cached
        
        if not self.announcement_file.exists():
            return Announcement()
        
        try:
            content = self.announcement_file.read_text(encoding='utf-8')
            announcement = Announcement.from_markdown(content)
            self.cache.set('announcement', announcement)
            self.content_cache.set('announcement', content)
            return announcement
        except Exception as e:
            logger.error(f'Error reading announcement: {e}')
            return Announcement()
    
    def save_announcement(self, announcement: Announcement) -> bool:
        """Save announcement to file"""
        try:
            content = announcement.to_markdown()
            
            self.announcement_file.parent.mkdir(parents=True, exist_ok=True)
            self.announcement_file.write_text(content, encoding='utf-8')
            
            self.cache.invalidate('announcement')
            self.content_cache.set('announcement', content)
            return True
        except Exception as e:
            logger.error(f'Error saving announcement: {e}')
            return False
    
    def update_content(self, content: str) -> bool:
        """Update announcement content"""
        announcement = self.get_announcement()
        announcement.content = content
        announcement.date = datetime.now().strftime('%Y-%m-%d')
        return self.save_announcement(announcement)
