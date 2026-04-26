"""Announcement model for website announcements"""

from dataclasses import dataclass


@dataclass
class Announcement:
    """Represents a website announcement"""
    
    title: str = '网站公告'
    content: str = ''
    date: str = ''
    author: str = 'Cnkrru'
    
    def to_markdown(self) -> str:
        return f"""---
title: {self.title}
date: {self.date}
author: {self.author}
---

{self.content}
"""
    
    @classmethod
    def from_markdown(cls, content: str) -> 'Announcement':
        import re
        
        match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
        if not match:
            return cls(content=content.strip())
        
        fm_text = match.group(1)
        body = match.group(2).strip()
        
        def get_field(name: str) -> str:
            m = re.search(rf'{name}:\s*(.+)', fm_text)
            return m.group(1).strip() if m else ''
        
        return cls(
            title=get_field('title'),
            content=body,
            date=get_field('date'),
            author=get_field('author')
        )
