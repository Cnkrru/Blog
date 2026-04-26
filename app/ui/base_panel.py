"""Base panel class for common panel operations"""

import customtkinter as ctk
import logging
from typing import Any, Callable, List, Optional
from abc import ABC, abstractmethod

from app.utils.async_worker import AsyncWorker

logger = logging.getLogger(__name__)


class BasePanel(ctk.CTkFrame, ABC):
    """Abstract base class for all management panels"""
    
    def __init__(self, parent, title: str, search_placeholder: str = '搜索...'):
        super().__init__(parent)
        
        self.items: list = []
        self.filtered_items: list = []
        self.item_cards: dict = {}
        self.worker = AsyncWorker.get_instance()
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1)
        
        self._title = title
        self._search_placeholder = search_placeholder
        
        self._create_widgets()
    
    @abstractmethod
    def _load_items(self):
        """Load items from service"""
        pass
    
    @abstractmethod
    def _get_item_id(self, item: Any) -> str:
        """Get item ID"""
        pass
    
    @abstractmethod
    def _matches_search(self, item: Any, search_text: str) -> bool:
        """Check if item matches search text"""
        pass
    
    @abstractmethod
    def _create_item_card(self, item: Any, index: int) -> ctk.CTkFrame:
        """Create a card widget for item"""
        pass
    
    @abstractmethod
    def _update_card(self, card: ctk.CTkFrame, item: Any, index: int):
        """Update existing card with item data"""
        pass
    
    def _create_widgets(self):
        """Create panel widgets"""
        # Header
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text=self._title,
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self._create_header_buttons()
        
        # Search bar
        self.search_frame = ctk.CTkFrame(self)
        self.search_frame.grid(row=1, column=0, sticky='ew', padx=10, pady=5)
        self.search_frame.grid_columnconfigure(1, weight=1)
        
        ctk.CTkLabel(self.search_frame, text='搜索:').grid(
            row=0, column=0, padx=(10, 5), pady=5, sticky='w'
        )
        
        self.search_entry = ctk.CTkEntry(
            self.search_frame, placeholder_text=self._search_placeholder
        )
        self.search_entry.grid(row=0, column=1, padx=5, pady=5, sticky='ew')
        self.search_entry.bind('<Return>', lambda e: self._filter_items())
        self.search_entry.bind('<KeyRelease>', lambda e: self._on_search_key_release())
        
        self.clear_search_btn = ctk.CTkButton(
            self.search_frame, text='清除', command=self._clear_search, width=80
        )
        self.clear_search_btn.grid(row=0, column=2, padx=(5, 10), pady=5, sticky='e')
        
        # List frame
        self.list_frame = ctk.CTkScrollableFrame(self)
        self.list_frame.grid(row=2, column=0, sticky='nsew', padx=10, pady=5)
        self.list_frame.grid_columnconfigure(0, weight=1)
    
    def _create_header_buttons(self):
        """Override to add custom header buttons"""
        pass
    
    def _on_search_key_release(self):
        """Handle search input changes with debounce"""
        if not hasattr(self, '_search_timer'):
            self._search_timer = None
        
        if self._search_timer:
            self.after_cancel(self._search_timer)
        
        self._search_timer = self.after(300, self._filter_items)
    
    def _start_loading(self):
        """Start loading items asynchronously"""
        self._load_items()
    
    def _on_items_loaded(self, items):
        """Callback after items are loaded"""
        self.items = items
        self.filtered_items = items
        self._render_items()
    
    def _on_load_error(self, error):
        """Callback on load error"""
        logger.error(f'Error loading items: {error}')
    
    def _filter_items(self):
        """Filter items based on search input"""
        search_text = self.search_entry.get().strip().lower()
        
        if not search_text:
            self.filtered_items = self.items
        else:
            self.filtered_items = [
                item for item in self.items
                if self._matches_search(item, search_text)
            ]
        
        self._render_items()
    
    def _clear_search(self):
        """Clear search and show all items"""
        self.search_entry.delete(0, 'end')
        self.filtered_items = self.items
        self._render_items()
    
    def _render_items(self):
        """Render item cards incrementally"""
        current_ids = set(self.item_cards.keys())
        new_ids = set(self._get_item_id(item) for item in self.filtered_items)
        
        # Remove deleted items
        for item_id in current_ids - new_ids:
            card = self.item_cards.pop(item_id)
            card.destroy()
        
        # Update or create cards
        for i, item in enumerate(self.filtered_items):
            item_id = self._get_item_id(item)
            if item_id in self.item_cards:
                card = self.item_cards[item_id]
                self._update_card(card, item, i)
            else:
                card = self._create_item_card(item, i)
                self.item_cards[item_id] = card
    
    def refresh(self):
        """Refresh item list"""
        self._start_loading()
    
    @staticmethod
    def create_static_card_elements(card, parent, item_title, date_text, info_text, desc_text):
        """Helper to create common card elements
        
        Returns dict of created widgets for easy access
        """
        card.grid_columnconfigure(0, weight=1)
        
        # Title row
        title_frame = ctk.CTkFrame(parent, fg_color='transparent')
        title_frame.grid(row=0, column=0, sticky='ew', padx=15, pady=(10, 5))
        title_frame.grid_columnconfigure(0, weight=1)
        
        title_label = ctk.CTkLabel(
            title_frame,
            text=item_title,
            font=ctk.CTkFont(size=16, weight='bold'),
            anchor='w'
        )
        title_label.grid(row=0, column=0, sticky='w')
        
        date_label = ctk.CTkLabel(
            title_frame,
            text=date_text,
            text_color='gray',
            font=ctk.CTkFont(size=12)
        )
        date_label.grid(row=0, column=1, sticky='e')
        
        # Info row
        info_label = ctk.CTkLabel(
            parent,
            text=info_text,
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w'
        )
        info_label.grid(row=1, column=0, sticky='w', padx=15, pady=(0, 5))
        
        # Description
        desc_label = ctk.CTkLabel(
            parent,
            text=desc_text,
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w',
            wraplength=800
        )
        desc_label.grid(row=2, column=0, sticky='w', padx=15, pady=(0, 10))
        
        # Button row
        btn_frame = ctk.CTkFrame(parent, fg_color='transparent')
        btn_frame.grid(row=3, column=0, sticky='e', padx=15, pady=(0, 10))
        
        return {
            'title_label': title_label,
            'date_label': date_label,
            'info_label': info_label,
            'desc_label': desc_label,
            'btn_frame': btn_frame
        }
