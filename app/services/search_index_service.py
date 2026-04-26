"""Search index service for auto-generating search.json - Optimized with better error handling"""

import json
import re
import logging
from pathlib import Path
from datetime import datetime
from app.config import config

logger = logging.getLogger(__name__)


class SearchIndexService:
    """Service for managing search index"""
    
    def __init__(self):
        self.post_dir = config.post_dir
        self.project_dir = config.blog_root / 'src' / 'pages' / 'project'
        self.log_dir = config.blog_root / 'src' / 'pages' / 'log'
        self.command_dir = config.blog_root / 'src' / 'pages' / 'command'
        self.search_file = config.blog_root / 'public' / 'config' / 'search.json'
    
    def generate_index(self) -> bool:
        """Generate complete search.json from all markdown files"""
        try:
            entries = []
            
            # Posts
            entries.extend(self._scan_posts())
            
            # Projects
            entries.extend(self._scan_projects())
            
            # Changelog
            entries.extend(self._scan_changelog())
            
            # Terminal
            entries.extend(self._scan_terminal())
            
            # Sort by date desc
            entries.sort(key=lambda x: x.get('date', ''), reverse=True)
            
            # Write to file
            self.search_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.search_file, 'w', encoding='utf-8') as f:
                json.dump(entries, f, ensure_ascii=False, indent=2)
            
            return True
        except Exception as e:
            logger.error(f'Error generating search index: {e}')
            return False
    
    def _scan_posts(self) -> list:
        """Scan post directory for articles"""
        entries = []
        if not self.post_dir.exists():
            return entries
        
        for md_file in sorted(self.post_dir.glob('post-*.md')):
            content = md_file.read_text(encoding='utf-8')
            meta = self._parse_frontmatter(content)
            
            post_id = md_file.stem.replace('post-', '')
            entries.append({
                'id': post_id,
                'title': meta.get('title', f'文章 {post_id}'),
                'category': meta.get('category', '未分类'),
                'tags': meta.get('tags', []),
                'path': f'./html/posts/post-{post_id}.html',
                'date': meta.get('date', ''),
                'description': meta.get('description', ''),
                'keywords': meta.get('keywords', ''),
                'author': meta.get('author', 'Cnkrru'),
                'seoTitle': f"{meta.get('title', '')} - 技术分享"
            })
        
        return entries
    
    def _scan_projects(self) -> list:
        """Scan project directory"""
        entries = []
        if not self.project_dir.exists():
            return entries
        
        for md_file in sorted(self.project_dir.glob('project-*.md')):
            content = md_file.read_text(encoding='utf-8')
            meta = self._parse_frontmatter(content)
            
            project_id = md_file.stem.replace('project-', '')
            entries.append({
                'id': f'project-{project_id}',
                'title': meta.get('title', f'项目 {project_id}'),
                'category': meta.get('category', '项目'),
                'tags': meta.get('tags', []),
                'path': f'./html/projects/project-{project_id}.html',
                'date': meta.get('date', ''),
                'description': meta.get('description', ''),
                'keywords': meta.get('keywords', ''),
                'author': meta.get('author', 'Cnkrru'),
                'seoTitle': f"{meta.get('title', '')} - 项目"
            })
        
        return entries
    
    def _scan_changelog(self) -> list:
        """Scan changelog"""
        changelog_file = self.log_dir / 'changelog.md'
        if not changelog_file.exists():
            return []
        
        content = changelog_file.read_text(encoding='utf-8')
        meta = self._parse_frontmatter(content)
        
        return [{
            'id': 'changelog',
            'title': meta.get('title', '网站更新日志'),
            'path': './html/changelog.html',
            'date': meta.get('date', ''),
            'description': meta.get('description', ''),
            'keywords': meta.get('keywords', ''),
            'author': meta.get('author', 'Cnkrru'),
            'seoTitle': f"{meta.get('title', '')} - 我的博客"
        }]
    
    def _scan_terminal(self) -> list:
        """Scan terminal page"""
        terminal_file = self.command_dir / 'terminal.md'
        if not terminal_file.exists():
            return []
        
        content = terminal_file.read_text(encoding='utf-8')
        meta = self._parse_frontmatter(content)
        
        return [{
            'id': 'terminal',
            'title': meta.get('title', '终端'),
            'path': './html/terminal.html',
            'date': meta.get('date', ''),
            'description': meta.get('description', ''),
            'keywords': meta.get('keywords', ''),
            'author': meta.get('author', 'Cnkrru'),
            'seoTitle': f"{meta.get('title', '')} - 我的博客"
        }]
    
    def _parse_frontmatter(self, content: str) -> dict:
        """Parse YAML frontmatter from markdown"""
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not match:
            return {}
        
        fm_text = match.group(1)
        result = {}
        
        for line in fm_text.split('\n'):
            if ':' not in line:
                continue
            
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            if key == 'tags':
                # Tags can be on same line as array: tags: [tag1, tag2]
                # Or on next lines as list items
                if value.startswith('[') and value.endswith(']'):
                    # Inline array format: [tag1, tag2]
                    result['tags'] = [
                        t.strip().strip('"').strip("'")
                        for t in value[1:-1].split(',')
                        if t.strip()
                    ]
                else:
                    # Will be parsed as list items below
                    result['tags'] = []
                continue
            
            result[key] = value
        
        # Parse tags if not already parsed from inline format
        if 'tags' not in result:
            tags_match = re.search(r'tags:\s*\n((?:\s+-\s+.+\n?)*)', fm_text)
            if tags_match:
                result['tags'] = [
                    t.strip().lstrip('- ').strip()
                    for t in tags_match.group(1).strip().split('\n')
                    if t.strip()
                ]
            else:
                result['tags'] = []
        
        return result
