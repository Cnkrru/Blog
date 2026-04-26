"""Link model for links.json"""

from dataclasses import dataclass


@dataclass
class Link:
    """Represents a link entry"""
    
    id: str
    name: str
    url: str
    category: str = '前端'
    description: str = ''
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url.strip(),
            'category': self.category,
            'description': self.description
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Link':
        """Create Link from dictionary"""
        return cls(
            id=data.get('id', ''),
            name=data.get('name', ''),
            url=data.get('url', ''),
            category=data.get('category', '前端'),
            description=data.get('description', '')
        )
