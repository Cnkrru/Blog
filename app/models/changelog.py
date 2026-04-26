"""Changelog model for website update logs"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ChangelogEntry:
    """Represents a changelog entry"""
    
    date: str
    content: str
    version: str = ''
    
    def to_dict(self) -> dict:
        return {
            'date': self.date,
            'content': self.content,
            'version': self.version
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'ChangelogEntry':
        return cls(
            date=data.get('date', ''),
            content=data.get('content', ''),
            version=data.get('version', '')
        )


@dataclass
class Changelog:
    """Represents the full changelog"""
    
    title: str = '网站更新日志'
    author: str = 'Cnkrru'
    description: str = '记录网站的更新历史和功能变更'
    keywords: str = '更新日志,网站更新,功能变更'
    category: str = '网站公告'
    tags: list[str] = field(default_factory=lambda: ['网站公告', '更新日志'])
    entries: list[ChangelogEntry] = field(default_factory=list)
    
    def to_frontmatter(self) -> str:
        tags_str = '\n  - '.join(self.tags) if self.tags else ''
        return f"""---
title: {self.title}
date: {self.entries[0].date if self.entries else ''}
author: {self.author}
description: {self.description}
keywords: {self.keywords}
category: {self.category}
tags:
  - {tags_str}
---

"""
    
    def to_markdown(self) -> str:
        fm = self.to_frontmatter()
        body = '# 网站更新日志\n\n'
        
        sorted_entries = sorted(self.entries, key=lambda x: x.date, reverse=True)
        for entry in sorted_entries:
            version_str = f' {entry.version}' if entry.version else ''
            body += f'## {entry.date}{version_str}\n{entry.content}\n\n'
        
        body += '----------------------------------------------------------------\n- 如有建议，请联系我，邮箱：3253884026@qq.com\n'
        return fm + body
    
    @classmethod
    def from_markdown(cls, content: str) -> 'Changelog':
        import re
        
        match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
        if not match:
            return cls()
        
        fm_text = match.group(1)
        body = match.group(2)
        
        def get_field(name: str) -> str:
            m = re.search(rf'{name}:\s*(.+)', fm_text)
            return m.group(1).strip() if m else ''
        
        def get_tags() -> list:
            m = re.search(r'tags:\s*\n((?:\s+-\s+.+\n?)*)', fm_text)
            if m:
                return [t.strip().lstrip('- ').strip() for t in m.group(1).strip().split('\n') if t.strip()]
            return []
        
        changelog = cls(
            title=get_field('title'),
            author=get_field('author'),
            description=get_field('description'),
            keywords=get_field('keywords'),
            category=get_field('category'),
            tags=get_tags()
        )
        
        # Parse entries from body
        entry_pattern = re.compile(r'##\s+(\d{4}-\d{2}-\d{2})(.*?)\n(.*?)(?=##\s+\d{4}-\d{2}-\d{2}|\-{3,}|$)', re.DOTALL)
        for m in entry_pattern.finditer(body):
            date = m.group(1)
            version = m.group(2).strip()
            entry_content = m.group(3).strip()
            changelog.entries.append(ChangelogEntry(date=date, version=version, content=entry_content))
        
        return changelog
