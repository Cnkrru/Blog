"""Backup service for managing blog data backups"""

import shutil
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional

from app.config import config

logger = logging.getLogger(__name__)


class BackupService:
    """Service for creating and managing backups"""
    
    def __init__(self):
        self.backup_dir = config.blog_root / '.blog-manager-backups'
        self.backup_dir.mkdir(exist_ok=True)
    
    def backup_file(self, source_path: Path, reason: str = '') -> Optional[Path]:
        """Create a backup of a file
        
        Args:
            source_path: Path to the file to backup
            reason: Reason for the backup (e.g., 'before_edit', 'manual')
            
        Returns:
            Path to the backup file, or None if failed
        """
        try:
            if not source_path.exists():
                logger.warning(f'Source file does not exist: {source_path}')
                return None
            
            # Create backup filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f'{source_path.stem}_{timestamp}{source_path.suffix}.bak'
            backup_path = self.backup_dir / backup_name
            
            # Copy file to backup directory
            shutil.copy2(source_path, backup_path)
            
            # Create metadata file
            meta_path = backup_path.with_suffix('.meta')
            with open(meta_path, 'w', encoding='utf-8') as f:
                f.write(f'original: {source_path}\n')
                f.write(f'timestamp: {timestamp}\n')
                f.write(f'reason: {reason}\n')
                f.write(f'size: {source_path.stat().st_size}\n')
            
            logger.info(f'Backup created: {backup_path}')
            return backup_path
            
        except Exception as e:
            logger.error(f'Error creating backup: {e}')
            return None
    
    def list_backups(self, pattern: str = '*.bak') -> list[dict]:
        """List all backups in the backup directory
        
        Returns:
            List of backup info dictionaries
        """
        backups = []
        
        for backup_file in sorted(self.backup_dir.glob(pattern), reverse=True):
            if not backup_file.is_file():
                continue
            
            meta_path = backup_file.with_suffix('.meta')
            meta = {}
            
            if meta_path.exists():
                try:
                    with open(meta_path, 'r', encoding='utf-8') as f:
                        for line in f:
                            if ':' in line:
                                key, value = line.split(':', 1)
                                meta[key.strip()] = value.strip()
                except Exception:
                    pass
            
            backups.append({
                'path': backup_file,
                'name': backup_file.name,
                'size': backup_file.stat().st_size,
                'modified': datetime.fromtimestamp(backup_file.stat().st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                'meta': meta
            })
        
        return backups
    
    def restore_backup(self, backup_path: Path, target_path: Optional[Path] = None) -> bool:
        """Restore a backup to its original location or specified path
        
        Args:
            backup_path: Path to the backup file
            target_path: Path to restore to (optional, defaults to original path from metadata)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if not backup_path.exists():
                logger.warning(f'Backup file does not exist: {backup_path}')
                return False
            
            # If no target specified, try to get original path from metadata
            if target_path is None:
                meta_path = backup_path.with_suffix('.meta')
                if meta_path.exists():
                    with open(meta_path, 'r', encoding='utf-8') as f:
                        for line in f:
                            if line.startswith('original:'):
                                target_path = Path(line.split(':', 1)[1].strip())
                                break
                
                if target_path is None:
                    logger.error('Cannot determine original path for backup')
                    return False
            
            # Create backup of current file before restoring
            if target_path.exists():
                self.backup_file(target_path, 'before_restore')
            
            # Restore the backup
            shutil.copy2(backup_path, target_path)
            
            logger.info(f'Restored backup: {backup_path} -> {target_path}')
            return True
            
        except Exception as e:
            logger.error(f'Error restoring backup: {e}')
            return False
    
    def delete_backup(self, backup_path: Path) -> bool:
        """Delete a backup file and its metadata
        
        Returns:
            True if successful, False otherwise
        """
        try:
            if not backup_path.exists():
                return False
            
            backup_path.unlink()
            
            # Delete metadata file if exists
            meta_path = backup_path.with_suffix('.meta')
            if meta_path.exists():
                meta_path.unlink()
            
            logger.info(f'Deleted backup: {backup_path}')
            return True
            
        except Exception as e:
            logger.error(f'Error deleting backup: {e}')
            return False
    
    def cleanup_old_backups(self, max_age_days: int = 30) -> int:
        """Delete backups older than specified days
        
        Returns:
            Number of deleted backups
        """
        deleted_count = 0
        cutoff = datetime.now().timestamp() - (max_age_days * 24 * 60 * 60)
        
        for backup_file in self.backup_dir.glob('*.bak'):
            if backup_file.stat().st_mtime < cutoff:
                if self.delete_backup(backup_file):
                    deleted_count += 1
        
        logger.info(f'Cleaned up {deleted_count} old backups')
        return deleted_count
