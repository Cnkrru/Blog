"""Post service for managing blog articles - Optimized with LRU caching and error handling"""

import json
import shutil
import zipfile
import logging
from pathlib import Path
from typing import Optional

from app.config import config
from app.models.post import Post
from app.utils.cache import LRUCacheManager, JsonCache, ContentCache
from app.utils.exceptions import FileOperationError, ServiceError, DataValidationError
from app.services.search_index_service import SearchIndexService
from app.services.backup_service import BackupService

logger = logging.getLogger(__name__)


class PostService:
    """Service for managing blog posts with caching"""
    
    def __init__(self):
        self.post_dir = config.post_dir
        self.search_file = config.search_file
        self.routes_file = config.routes_file
        
        self.cache = LRUCacheManager(default_ttl=60.0, max_size=200)
        self.json_cache = JsonCache(self.cache)
        self.content_cache = ContentCache(max_size=100)
        self.search_index_service = SearchIndexService()
        self.backup_service = BackupService()
    
    def rebuild_search_index(self) -> bool:
        """Rebuild search.json from actual markdown files"""
        try:
            result = self.search_index_service.generate_index()
            if result:
                self.cache.invalidate('search')
                logger.info('Search index rebuilt successfully')
            return result
        except Exception as e:
            logger.error(f'Error rebuilding search index: {e}')
            return False
    
    def get_all_posts(self) -> list[Post]:
        """Get all posts from cached search.json"""
        data = self.json_cache.load(self.search_file, key='search')
        if not data:
            return []
        
        posts = []
        for item in data:
            post = Post(
                id=item.get('id', ''),
                title=item.get('title', ''),
                date=item.get('date', ''),
                category=item.get('category', ''),
                tags=item.get('tags', []),
                description=item.get('description', ''),
                keywords=item.get('keywords', ''),
                author=item.get('author', 'Cnkrru'),
                seo_title=item.get('seoTitle', '')
            )
            posts.append(post)
        
        return posts
    
    def get_post_content(self, post_id: str) -> str:
        """Get post markdown content with caching"""
        cached = self.content_cache.get(post_id)
        if cached is not None:
            return cached
        
        file_path = self.post_dir / f'post-{post_id}.md'
        if not file_path.exists():
            return ''
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        self.content_cache.set(post_id, content)
        return content
    
    def create_post(self, post: Post) -> bool:
        """Create a new post"""
        try:
            if not post.id:
                post.id = self._get_next_id()
            
            file_path = self.post_dir / f'post-{post.id}.md'
            content = post.to_frontmatter() + post.content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self._update_search_index(post, action='add')
            self._update_routes(post.id, action='add')
            
            self.cache.invalidate('search')
            self.cache.invalidate('routes')
            
            return True
        except Exception as e:
            logger.error(f'Error creating post: {e}')
            return False
    
    def update_post(self, post: Post) -> bool:
        """Update an existing post"""
        try:
            file_path = self.post_dir / f'post-{post.id}.md'
            
            # Create backup before updating
            if file_path.exists():
                self.backup_service.backup_file(file_path, reason='before_edit')
            
            content = post.to_frontmatter() + post.content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.content_cache.invalidate(post.id)
            self._update_search_index(post, action='update')
            
            self.cache.invalidate('search')
            
            return True
        except Exception as e:
            logger.error(f'Error updating post: {e}')
            return False
    
    def delete_post(self, post_id: str) -> bool:
        """Delete a post"""
        try:
            file_path = self.post_dir / f'post-{post_id}.md'
            if file_path.exists():
                # Backup before delete
                self.backup_service.backup_file(file_path, reason='before_delete')
                file_path.unlink()
            
            self.content_cache.invalidate(post_id)
            self._remove_from_search_index(post_id)
            self._update_routes(post_id, action='remove')
            
            self.cache.invalidate('search')
            self.cache.invalidate('routes')
            
            return True
        except Exception as e:
            logger.error(f'Error deleting post: {e}')
            return False
    
    def delete_posts(self, post_ids: list[str]) -> tuple[int, int]:
        """Delete multiple posts
        
        Returns:
            (success_count, failure_count)
        """
        success = 0
        failure = 0
        
        for post_id in post_ids:
            if self.delete_post(post_id):
                success += 1
            else:
                failure += 1
        
        return success, failure
    
    def save_post(self, post: Post) -> bool:
        """Save post with updated metadata"""
        try:
            file_path = self.post_dir / f'post-{post.id}.md'
            content = post.to_frontmatter() + post.content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.content_cache.invalidate(post.id)
            self._update_search_index(post, action='update')
            
            self.cache.invalidate('search')
            
            return True
        except Exception as e:
            logger.error(f'Error saving post: {e}')
            return False
    
    def _get_next_id(self) -> str:
        """Get next available post ID from cache"""
        posts = self.get_all_posts()
        if not posts:
            return '0'
        
        try:
            max_id = max(int(p.id) for p in posts if p.id.isdigit())
            return str(max_id + 1)
        except ValueError:
            return '0'
    
    def _update_search_index(self, post: Post, action: str = 'add'):
        """Update search.json index"""
        data = self.json_cache.load(self.search_file, key='search') or []
        
        if action == 'add':
            data.append(post.to_search_json())
        elif action == 'update':
            for i, item in enumerate(data):
                if item.get('id') == post.id:
                    data[i] = post.to_search_json()
                    break
        
        data.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        self.json_cache.save(self.search_file, data, key='search')
    
    def _remove_from_search_index(self, post_id: str):
        """Remove post from search.json"""
        data = self.json_cache.load(self.search_file, key='search')
        if not data:
            return
        
        data = [item for item in data if item.get('id') != post_id]
        
        self.json_cache.save(self.search_file, data, key='search')
    
    def _update_routes(self, post_id: str, action: str = 'add'):
        """Update routes.json"""
        data = self.json_cache.load(self.routes_file, key='routes')
        if not data:
            return
        
        route = f'/post/{post_id}'
        
        if action == 'add' and route not in data['routes']:
            data['routes'].append(route)
        elif action == 'remove' and route in data['routes']:
            data['routes'].remove(route)
        
        self.json_cache.save(self.routes_file, data, key='routes')
    
    def export_posts(self, output_path: Path, post_ids: Optional[list[str]] = None) -> bool:
        """Export posts to a zip file
        
        Args:
            output_path: Path to save the zip file
            post_ids: List of post IDs to export (None for all)
            
        Returns:
            True if successful
        """
        try:
            posts = self.get_all_posts()
            
            if post_ids:
                posts = [p for p in posts if p.id in post_ids]
            
            if not posts:
                logger.warning('No posts to export')
                return False
            
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                for post in posts:
                    file_path = self.post_dir / f'post-{post.id}.md'
                    if file_path.exists():
                        # Store with readable name
                        arcname = f'{post.id}_{post.title}.md'
                        # Clean filename for filesystem compatibility
                        arcname = ''.join(c for c in arcname if c.isalnum() or c in (' ', '-', '_', '.'))
                        arcname = arcname.replace(' ', '_')
                        zf.write(file_path, arcname)
            
            logger.info(f'Exported {len(posts)} posts to {output_path}')
            return True
            
        except Exception as e:
            logger.error(f'Error exporting posts: {e}')
            return False
    
    def import_posts(self, source_path: Path) -> tuple[int, int]:
        """Import posts from markdown files
        
        Args:
            source_path: Path to a single .md file or a directory
            
        Returns:
            (success_count, failure_count)
        """
        success = 0
        failure = 0
        
        try:
            files = []
            if source_path.is_file() and source_path.suffix == '.md':
                files.append(source_path)
            elif source_path.is_dir():
                files = list(source_path.glob('**/*.md'))
            
            if not files:
                logger.warning('No markdown files found to import')
                return 0, 0
            
            for md_file in files:
                try:
                    content = md_file.read_text(encoding='utf-8')
                    post = Post.from_markdown(content)
                    
                    if not post.id:
                        post.id = self._get_next_id()
                    
                    if self.create_post(post):
                        success += 1
                        logger.info(f'Imported post: {post.title}')
                    else:
                        failure += 1
                        logger.error(f'Failed to import post from: {md_file}')
                        
                except Exception as e:
                    failure += 1
                    logger.error(f'Error importing {md_file}: {e}')
            
            return success, failure
            
        except Exception as e:
            logger.error(f'Error importing posts: {e}')
            return success, failure
