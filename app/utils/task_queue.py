"""Async task queue for non-blocking operations"""

import threading
import queue
from typing import Callable, Any, Optional


class TaskResult:
    """Result of an async task"""
    
    def __init__(self, success: bool, data: Any = None, error: str = None):
        self.success = success
        self.data = data
        self.error = error


class AsyncTaskQueue:
    """Thread-safe async task queue with callbacks"""
    
    def __init__(self, max_workers: int = 2):
        self._queue = queue.Queue()
        self._workers = []
        self._callbacks = {}
        self._running = False
        self._lock = threading.Lock()
        
        for _ in range(max_workers):
            worker = threading.Thread(target=self._worker, daemon=True)
            worker.start()
            self._workers.append(worker)
        
        self._running = True
    
    def submit(self, task_id: str, func: Callable, *args, callback: Callable = None, **kwargs):
        """Submit a task to the queue"""
        with self._lock:
            self._callbacks[task_id] = callback
        
        self._queue.put((task_id, func, args, kwargs))
    
    def _worker(self):
        """Worker thread that processes tasks"""
        while self._running:
            try:
                task_id, func, args, kwargs = self._queue.get(timeout=0.5)
                
                try:
                    result = func(*args, **kwargs)
                    task_result = TaskResult(success=True, data=result)
                except Exception as e:
                    task_result = TaskResult(success=False, error=str(e))
                
                self._invoke_callback(task_id, task_result)
                self._queue.task_done()
                
            except queue.Empty:
                continue
    
    def _invoke_callback(self, task_id: str, result: TaskResult):
        """Invoke callback in a thread-safe way"""
        with self._lock:
            callback = self._callbacks.pop(task_id, None)
        
        if callback:
            try:
                callback(result)
            except Exception as e:
                print(f'Callback error for {task_id}: {e}')
    
    def shutdown(self):
        """Shutdown the task queue"""
        self._running = False
        for worker in self._workers:
            worker.join(timeout=2.0)


class UITaskScheduler:
    """Schedule tasks that need to update UI after completion"""
    
    def __init__(self, task_queue: AsyncTaskQueue):
        self.queue = task_queue
        self._pending_ui_updates = []
    
    def run_with_ui_callback(self, task_id: str, func: Callable, ui_callback: Callable, *args, **kwargs):
        """Run task and schedule UI callback on completion"""
        def wrapper(result: TaskResult):
            self._pending_ui_updates.append((ui_callback, result))
        
        self.queue.submit(task_id, func, *args, callback=wrapper, **kwargs)
    
    def process_ui_updates(self, widget):
        """Process pending UI updates (call from main thread)"""
        while self._pending_ui_updates:
            callback, result = self._pending_ui_updates.pop(0)
            try:
                callback(result)
            except Exception as e:
                print(f'UI callback error: {e}')
        
        # Schedule next check
        widget.after(100, lambda: self.process_ui_updates(widget))
