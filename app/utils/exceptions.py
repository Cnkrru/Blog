"""Custom exceptions for Blog Manager"""


class BlogManagerError(Exception):
    """Base exception for Blog Manager"""
    
    def __init__(self, message: str, error_code: str = 'UNKNOWN', details: str = ''):
        self.message = message
        self.error_code = error_code
        self.details = details
        super().__init__(self.message)
    
    def user_message(self) -> str:
        """Get user-friendly error message"""
        msg = self.message
        if self.details:
            msg += f'\n\n详细信息: {self.details}'
        return msg


class FileNotFoundError(BlogManagerError):
    """Raised when a required file is not found"""
    
    def __init__(self, file_path: str):
        super().__init__(
            message=f'文件不存在: {file_path}',
            error_code='FILE_NOT_FOUND',
            details=file_path
        )


class DirectoryNotFoundError(BlogManagerError):
    """Raised when a required directory is not found"""
    
    def __init__(self, dir_path: str):
        super().__init__(
            message=f'目录不存在: {dir_path}',
            error_code='DIRECTORY_NOT_FOUND',
            details=dir_path
        )


class InvalidBlogStructureError(BlogManagerError):
    """Raised when blog directory structure is invalid"""
    
    def __init__(self, missing_dirs: list[str]):
        super().__init__(
            message='博客目录结构不正确',
            error_code='INVALID_BLOG_STRUCTURE',
            details=f'缺少的目录: {", ".join(missing_dirs)}'
        )


class FileOperationError(BlogManagerError):
    """Raised when a file operation fails"""
    
    def __init__(self, operation: str, file_path: str, error: str = ''):
        super().__init__(
            message=f'文件操作失败: {operation}',
            error_code='FILE_OPERATION_ERROR',
            details=f'操作: {operation}\n文件: {file_path}\n错误: {error}'
        )


class DataValidationError(BlogManagerError):
    """Raised when data validation fails"""
    
    def __init__(self, field: str, message: str):
        super().__init__(
            message=f'数据验证失败: {field}',
            error_code='DATA_VALIDATION_ERROR',
            details=f'字段: {field}\n原因: {message}'
        )


class ServiceError(BlogManagerError):
    """Raised when a service operation fails"""
    
    def __init__(self, service_name: str, operation: str, error: str = ''):
        super().__init__(
            message=f'{service_name} 服务操作失败: {operation}',
            error_code='SERVICE_ERROR',
            details=f'服务: {service_name}\n操作: {operation}\n错误: {error}'
        )


class BackupError(BlogManagerError):
    """Raised when a backup operation fails"""
    
    def __init__(self, operation: str, error: str = ''):
        super().__init__(
            message=f'备份操作失败: {operation}',
            error_code='BACKUP_ERROR',
            details=f'操作: {operation}\n错误: {error}'
        )
