"""Route service for managing routes.json"""

import json
import logging
from app.config import config

logger = logging.getLogger(__name__)


class RouteService:
    """Service for managing routes"""
    
    def __init__(self):
        self.routes_file = config.routes_file
    
    def get_routes(self) -> list[str]:
        """Get all routes"""
        if not self.routes_file.exists():
            return []
        
        with open(self.routes_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get('routes', [])
    
    def add_route(self, route: str) -> bool:
        """Add a new route"""
        try:
            routes = self.get_routes()
            
            if route not in routes:
                routes.append(route)
                self._save_routes(routes)
            
            return True
        except Exception as e:
            logger.error(f'Error adding route: {e}')
            return False
    
    def remove_route(self, route: str) -> bool:
        """Remove a route"""
        try:
            routes = self.get_routes()
            
            if route in routes:
                routes.remove(route)
                self._save_routes(routes)
            
            return True
        except Exception as e:
            logger.error(f'Error removing route: {e}')
            return False
    
    def sync_routes(self, post_ids: list[str], project_ids: list[str]) -> bool:
        """Sync routes with posts and projects"""
        try:
            routes = [
                '/',
                '/home',
                '/about',
                '/archives',
                '/links',
                '/projects'
            ]
            
            # Add post routes
            for pid in post_ids:
                routes.append(f'/post/{pid}')
            
            # Add project routes
            for pid in project_ids:
                routes.append(f'/project/{pid}')
            
            self._save_routes(routes)
            return True
        except Exception as e:
            logger.error(f'Error syncing routes: {e}')
            return False
    
    def _save_routes(self, routes: list[str]):
        """Save routes to file"""
        with open(self.routes_file, 'w', encoding='utf-8') as f:
            json.dump({'routes': routes}, f, ensure_ascii=False, indent=2)
