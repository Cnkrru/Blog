"""Post model for blog articles"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Post:
    """Represents a blog post"""
    
    id: str
    title: str
    date: str
    category: str = '随笔'
    tags: list[str] = field(default_factory=list)
    description: str = ''
    keywords: str = ''
    author: str = 'Cnkrru'
    seo_title: str = ''
    content: str = ''
    
    def __post_init__(self):
        if not self.seo_title:
            self.seo_title = f'{self.title} - 个人技术博客'
    
    def to_frontmatter(self) -> str:
        """Generate YAML front matter"""
        tags_str = ', '.join(self.tags) if self.tags else ''
        return f"""---
title: {self.title}
date: {self.date}
category: {self.category}
tags: [{tags_str}]
description: {self.description}
keywords: {self.keywords}
---
"""
    
    def to_search_json(self) -> dict:
        """Convert to search.json format"""
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'tags': self.tags,
            'path': f'./html/posts/post-{self.id}.html',
            'date': self.date,
            'description': self.description,
            'keywords': self.keywords,
            'author': self.author,
            'seoTitle': self.seo_title
        }
    
    @classmethod
    def from_frontmatter(cls, content: str) -> 'Post':
        """Parse post from markdown with frontmatter"""
        import re
        
        # Extract frontmatter
        match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
        if not match:
            return cls(id='', title='', date='')
        
        fm_text = match.group(1)
        body = match.group(2).strip()
        
        # Parse fields
        def get_field(name: str) -> str:
            m = re.search(rf'{name}:\s*(.+)', fm_text)
            return m.group(1).strip() if m else ''
        
        def get_list(name: str) -> list:
            m = re.search(rf'{name}:\s*\[(.*?)\]', fm_text)
            if m:
                items = [x.strip() for x in m.group(1).split(',') if x.strip()]
                return items
            return []
        
        return cls(
            id='',
            title=get_field('title'),
            date=get_field('date'),
            category=get_field('category'),
            tags=get_list('tags'),
            description=get_field('description'),
            keywords=get_field('keywords'),
            author=get_field('author') or 'Cnkrru',
            seo_title=get_field('seoTitle'),
            content=body
        )
