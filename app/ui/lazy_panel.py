"""Lazy panel proxy for on-demand loading"""

import customtkinter as ctk
from typing import Callable, Any, Optional


class LazyPanelProxy(ctk.CTkFrame):
    """Proxy frame that creates actual panel only when first shown"""
    
    def __init__(self, parent, panel_factory: Callable):
        super().__init__(parent)
        self._panel_factory = panel_factory
        self._panel = None
        self._loaded = False
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        
        self._is_visible = False
    
    def _ensure_loaded(self):
        """Create actual panel if not loaded"""
        if not self._loaded:
            self._panel = self._panel_factory(self)
            self._panel.grid(row=0, column=0, sticky='nsew')
            self._loaded = True
    
    def grid(self, **kwargs):
        """Override grid to lazy load"""
        self._ensure_loaded()
        if self._panel:
            self._panel.grid(**kwargs)
        super().grid(**kwargs)
        self._is_visible = True
    
    def grid_forget(self):
        """Hide panel"""
        if self._panel:
            self._panel.grid_forget()
        super().grid_forget()
        self._is_visible = False
    
    def refresh(self):
        """Refresh actual panel"""
        if self._panel and hasattr(self._panel, 'refresh'):
            self._panel.refresh()
    
    def __getattr__(self, name: str) -> Any:
        """Forward attribute access to actual panel"""
        if self._panel is not None:
            return getattr(self._panel, name)
        raise AttributeError(f"'{type(self).__name__}' has no attribute '{name}'")
