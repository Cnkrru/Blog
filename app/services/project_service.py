"""Project service for managing projects.json - Optimized with LRU caching and error handling"""

import json
import logging
from pathlib import Path
from typing import Optional

from app.config import config
from app.models.project import Project
from app.utils.cache import LRUCacheManager, JsonCache

logger = logging.getLogger(__name__)


class ProjectService:
    """Service for managing projects with caching"""
    
    def __init__(self):
        self.projects_file = config.projects_file
        
        self.cache = LRUCacheManager(default_ttl=30.0, max_size=50)
        self.json_cache = JsonCache(self.cache)
    
    def get_all_projects(self) -> list[Project]:
        """Get all projects from cache"""
        data = self.json_cache.load(self.projects_file, key='projects')
        if not data:
            return []
        
        return [Project.from_dict(item) for item in data]
    
    def add_project(self, project: Project) -> bool:
        """Add a new project"""
        try:
            if not project.id:
                project.id = self._get_next_id()
            
            data = self.json_cache.load(self.projects_file, key='projects') or []
            data.append(project.to_dict())
            
            self.json_cache.save(self.projects_file, data, key='projects')
            
            return True
        except Exception as e:
            logger.error(f'Error adding project: {e}')
            return False
    
    def update_project(self, project: Project) -> bool:
        """Update an existing project"""
        try:
            data = self.json_cache.load(self.projects_file, key='projects')
            if not data:
                return False
            
            for i, item in enumerate(data):
                if item.get('id') == project.id:
                    data[i] = project.to_dict()
                    break
            
            self.json_cache.save(self.projects_file, data, key='projects')
            
            return True
        except Exception as e:
            logger.error(f'Error updating project: {e}')
            return False
    
    def delete_project(self, project_id: str) -> bool:
        """Delete a project"""
        try:
            data = self.json_cache.load(self.projects_file, key='projects')
            if not data:
                return False
            
            data = [item for item in data if item.get('id') != project_id]
            
            self.json_cache.save(self.projects_file, data, key='projects')
            
            return True
        except Exception as e:
            logger.error(f'Error deleting project: {e}')
            return False
    
    def _get_next_id(self) -> str:
        """Get next available project ID from cache"""
        projects = self.get_all_projects()
        if not projects:
            return '1'
        
        try:
            max_id = max(int(p.id) for p in projects if p.id.isdigit())
            return str(max_id + 1)
        except ValueError:
            return '1'
