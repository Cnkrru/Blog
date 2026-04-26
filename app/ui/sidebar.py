"""Sidebar navigation frame with hover effects and active state"""

import customtkinter as ctk


class SidebarFrame(ctk.CTkFrame):
    """Sidebar with navigation buttons and active state indicator"""
    
    def __init__(self, parent):
        super().__init__(parent, width=200)
        
        self.buttons = {}
        self.active_button = None
        self.active_indicator = None
        
        self.grid_columnconfigure(0, weight=1)
        
        self._create_widgets()
    
    def _create_widgets(self):
        """Create sidebar widgets"""
        # Title
        self.title_label = ctk.CTkLabel(
            self,
            text='Blog Manager',
            font=ctk.CTkFont(size=20, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=20, pady=(20, 15))
        
        # Section separators and buttons
        sections = [
            ('内容管理', 1),
            ('文章管理', 2, 'on_post_click'),
            ('友链管理', 3, 'on_link_click'),
            ('项目管理', 4, 'on_project_click'),
            ('页面管理', 5),
            ('关于页面', 6, 'on_about_click'),
            ('日志管理', 7, 'on_changelog_click'),
            ('公告管理', 8, 'on_announcement_click'),
            ('工具', 9),
            ('文章统计', 10, 'on_stats_click')
        ]
        
        for item in sections:
            if len(item) == 2:
                text, row = item
                ctk.CTkLabel(
                    self, text=text, text_color='gray', font=ctk.CTkFont(size=11)
                ).grid(row=row, column=0, padx=20, pady=(10, 3), sticky='w')
            else:
                text, row, callback_attr = item
                btn = self._create_nav_button(text, row, callback_attr)
                self.buttons[callback_attr] = btn
    
    def _create_nav_button(self, text, row, callback_attr):
        """Create navigation button with hover effects"""
        btn = ctk.CTkButton(
            self,
            text=text,
            command=lambda: self._on_click(callback_attr),
            anchor='w',
            fg_color='transparent',
            hover_color=('#3B8ED0' if ctk.get_appearance_mode() == 'Dark' else '#D5D5D5')
        )
        btn.grid(row=row, column=0, padx=20, pady=2, sticky='ew')
        return btn
    
    def _on_click(self, callback_attr):
        """Handle button click with active state"""
        self._set_active_button(callback_attr)
        
        callback = getattr(self, callback_attr, None)
        if callback:
            callback()
    
    def _set_active_button(self, callback_attr):
        """Set active button state with indicator"""
        btn = self.buttons.get(callback_attr)
        if not btn:
            return
        
        # Reset previous active button
        if self.active_button and self.active_button != btn:
            self.active_button.configure(fg_color='transparent')
        
        # Set new active button
        active_color = '#1F6AA5' if ctk.get_appearance_mode() == 'Dark' else '#3B8ED0'
        btn.configure(fg_color=active_color)
        self.active_button = btn
    
    def select_first(self):
        """Select the first button (default: post)"""
        self._set_active_button('on_post_click')
