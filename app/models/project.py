"""Project model for projects.json"""

from dataclasses import dataclass, field


@dataclass
class Project:
    """Represents a project entry"""
    
    id: str
    name: str
    title: str
    category: str = '前端'
    tags: list[str] = field(default_factory=list)
    description: str = ''
    keywords: str = ''
    author: str = 'Cnkrru'
    seo_title: str = ''
    path: str = ''
    date: str = ''
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'category': self.category,
            'tags': self.tags,
            'description': self.description,
            'keywords': self.keywords,
            'author': self.author,
            'seoTitle': self.seo_title,
            'path': self.path or f'./html/projects/project-{self.id}.html',
            'date': self.date
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Project':
        """Create Project from dictionary"""
        return cls(
            id=data.get('id', ''),
            name=data.get('name', ''),
            title=data.get('title', ''),
            category=data.get('category', '前端'),
            tags=data.get('tags', []),
            description=data.get('description', ''),
            keywords=data.get('keywords', ''),
            author=data.get('author', 'Cnkrru'),
            seo_title=data.get('seoTitle', ''),
            path=data.get('path', ''),
            date=data.get('date', '')
        )
