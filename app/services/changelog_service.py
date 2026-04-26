"""Changelog service for managing website update logs - Optimized with LRU caching"""

import logging
from pathlib import Path

from app.config import config
from app.models.changelog import Changelog, ChangelogEntry
from app.utils.cache import LRUCacheManager, ContentCache

logger = logging.getLogger(__name__)


class ChangelogService:
    """Service for managing changelog"""
    
    def __init__(self):
        self.changelog_file = config.blog_root / 'src' / 'pages' / 'log' / 'changelog.md'
        self.cache = LRUCacheManager(default_ttl=30.0, max_size=10)
        self.content_cache = ContentCache(max_size=10)
    
    def get_changelog(self) -> Changelog:
        """Get changelog with caching"""
        cached = self.cache.get('changelog')
        if cached:
            return cached
        
        if not self.changelog_file.exists():
            return Changelog()
        
        try:
            content = self.changelog_file.read_text(encoding='utf-8')
            changelog = Changelog.from_markdown(content)
            self.cache.set('changelog', changelog)
            self.content_cache.set('changelog', content)
            return changelog
        except Exception as e:
            logger.error(f'Error reading changelog: {e}')
            return Changelog()
    
    def save_changelog(self, changelog: Changelog) -> bool:
        """Save changelog to file"""
        try:
            content = changelog.to_markdown()
            
            self.changelog_file.parent.mkdir(parents=True, exist_ok=True)
            self.changelog_file.write_text(content, encoding='utf-8')
            
            self.cache.invalidate('changelog')
            self.content_cache.set('changelog', content)
            return True
        except Exception as e:
            logger.error(f'Error saving changelog: {e}')
            return False
    
    def add_entry(self, date: str, content: str, version: str = '') -> bool:
        """Add a new changelog entry"""
        changelog = self.get_changelog()
        
        for entry in changelog.entries:
            if entry.date == date:
                entry.content = content + '\n' + entry.content
                entry.version = version or entry.version
                return self.save_changelog(changelog)
        
        changelog.entries.append(ChangelogEntry(date=date, content=content, version=version))
        return self.save_changelog(changelog)
    
    def delete_entry(self, date: str) -> bool:
        """Delete a changelog entry by date"""
        changelog = self.get_changelog()
        changelog.entries = [e for e in changelog.entries if e.date != date]
        return self.save_changelog(changelog)
    
    def update_entry(self, old_date: str, date: str, content: str, version: str = '') -> bool:
        """Update a changelog entry"""
        changelog = self.get_changelog()
        for entry in changelog.entries:
            if entry.date == old_date:
                entry.date = date
                entry.content = content
                entry.version = version
                return self.save_changelog(changelog)
        return False
