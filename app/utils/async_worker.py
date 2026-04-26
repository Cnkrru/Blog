"""Thread pool for async I/O operations"""

from concurrent.futures import ThreadPoolExecutor, Future
from typing import Callable, Any
from functools import wraps
import customtkinter as ctk


class AsyncWorker:
    """Thread pool manager for async operations with Tkinter callback support"""
    
    _pool = None
    _instance = None
    
    @classmethod
    def get_instance(cls) -> 'AsyncWorker':
        """Get singleton instance"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def __init__(self):
        if AsyncWorker._instance is not None:
            raise RuntimeError("Use AsyncWorker.get_instance() instead")
        self._pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix='blog-worker')
        AsyncWorker._instance = self
    
    def run(self, func: Callable, on_complete: Callable = None, on_error: Callable = None, 
            parent_widget=None, *args, **kwargs) -> Future:
        """
        Run function in background thread, then call callbacks on main thread
        
        Args:
            func: Function to run in background
            on_complete: Callback(result) on success (called on main thread)
            on_error: Callback(error) on failure (called on main thread)
            parent_widget: Tkinter widget for scheduling callbacks
            *args, **kwargs: Arguments for func
        """
        def _wrapper():
            try:
                result = func(*args, **kwargs)
                if on_complete and parent_widget:
                    parent_widget.after(0, lambda: on_complete(result))
                elif on_complete:
                    on_complete(result)
            except Exception as e:
                if on_error and parent_widget:
                    parent_widget.after(0, lambda: on_error(e))
                elif on_error:
                    on_error(e)
        
        return self._pool.submit(_wrapper)
    
    def shutdown(self):
        """Shutdown the thread pool"""
        if self._pool:
            self._pool.shutdown(wait=False)


def async_task(on_complete: Callable = None, on_error: Callable = None):
    """Decorator for async task execution"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            worker = AsyncWorker.get_instance()
            # Find parent widget from args
            parent = None
            for arg in args:
                if isinstance(arg, ctk.CTkWidget):
                    parent = arg
                    break
            
            return worker.run(func, on_complete, on_error, parent, *args, **kwargs)
        return wrapper
    return decorator
