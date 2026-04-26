"""Statistics panel for blog analytics"""

import customtkinter as ctk
from collections import Counter

from app.services.post_service import PostService
from app.services.search_index_service import SearchIndexService


class StatsPanel(ctk.CTkFrame):
    """Panel for blog statistics"""
    
    def __init__(self, parent):
        super().__init__(parent)
        
        self.post_service = PostService()
        self.search_service = SearchIndexService()
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self._create_widgets()
        self._load_stats()
    
    def _create_widgets(self):
        """Create panel widgets"""
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 5))
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.title_label = ctk.CTkLabel(
            self.header_frame,
            text='文章统计',
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, padx=10, pady=10, sticky='w')
        
        self.rebuild_btn = ctk.CTkButton(
            self.header_frame,
            text='重建索引',
            command=self._rebuild_index,
            width=120
        )
        self.rebuild_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.scroll_frame = ctk.CTkScrollableFrame(self)
        self.scroll_frame.grid(row=1, column=0, sticky='nsew', padx=10, pady=5)
        self.scroll_frame.grid_columnconfigure(0, weight=1)
    
    def _load_stats(self):
        """Load stats asynchronously"""
        self.after(10, self._do_load)
    
    def _do_load(self):
        """Actually load stats"""
        posts = self.post_service.get_all_posts()
        
        # Clear existing
        for widget in self.scroll_frame.winfo_children():
            widget.destroy()
        
        row = 0
        
        # Overview cards
        overview_frame = ctk.CTkFrame(self.scroll_frame)
        overview_frame.grid(row=row, column=0, sticky='ew', pady=5)
        overview_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)
        
        total_posts = len(posts)
        total_words = sum(len(p.description) + len(p.title) for p in posts)
        category_set = set()
        tag_set = set()
        for p in posts:
            category_set.add(p.category)
            tag_set.update(p.tags)
        
        categories = len(category_set)
        tags = len(tag_set)
        
        self._create_stat_card(overview_frame, '文章总数', str(total_posts), 0)
        self._create_stat_card(overview_frame, '总字数', f'{total_words:,}', 1)
        self._create_stat_card(overview_frame, '分类数', str(categories), 2)
        self._create_stat_card(overview_frame, '标签数', str(tags), 3)
        
        row += 1
        
        # Category distribution
        cat_frame = ctk.CTkFrame(self.scroll_frame)
        cat_frame.grid(row=row, column=0, sticky='ew', pady=5)
        cat_frame.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(
            cat_frame,
            text='分类分布',
            font=ctk.CTkFont(size=16, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=15, pady=(10, 5))
        
        cat_counts = Counter(p.category for p in posts)
        for i, (cat, count) in enumerate(cat_counts.most_common()):
            ctk.CTkLabel(
                cat_frame,
                text=f'{cat}: {count} 篇',
                anchor='w'
            ).grid(row=i+1, column=0, sticky='w', padx=15, pady=2)
        
        row += 1
        
        # Tag cloud
        tag_frame = ctk.CTkFrame(self.scroll_frame)
        tag_frame.grid(row=row, column=0, sticky='ew', pady=5)
        tag_frame.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(
            tag_frame,
            text='标签云',
            font=ctk.CTkFont(size=16, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=15, pady=(10, 5))
        
        tag_counts = Counter(t for p in posts for t in p.tags)
        tag_wrap_frame = ctk.CTkFrame(tag_frame, fg_color='transparent')
        tag_wrap_frame.grid(row=1, column=0, sticky='w', padx=15, pady=5)
        
        col = 0
        line = 0
        for tag, count in tag_counts.most_common():
            ctk.CTkLabel(
                tag_wrap_frame,
                text=f'{tag}({count})',
                text_color='gray'
            ).grid(row=line, column=col, padx=5, pady=2, sticky='w')
            
            col += 1
            if col > 5:
                col = 0
                line += 1
        
        row += 1
        
        # Recent posts
        recent_frame = ctk.CTkFrame(self.scroll_frame)
        recent_frame.grid(row=row, column=0, sticky='ew', pady=5)
        recent_frame.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(
            recent_frame,
            text='最近文章',
            font=ctk.CTkFont(size=16, weight='bold')
        ).grid(row=0, column=0, sticky='w', padx=15, pady=(10, 5))
        
        sorted_posts = sorted(posts, key=lambda p: p.date, reverse=True)[:10]
        for i, post in enumerate(sorted_posts):
            ctk.CTkLabel(
                recent_frame,
                text=f'{post.date}  {post.title}',
                anchor='w'
            ).grid(row=i+1, column=0, sticky='w', padx=15, pady=2)
    
    def _create_stat_card(self, parent, label: str, value: str, col: int):
        """Create a stat card"""
        card = ctk.CTkFrame(parent, fg_color='transparent')
        card.grid(row=0, column=col, padx=10, pady=15)
        
        ctk.CTkLabel(
            card,
            text=value,
            font=ctk.CTkFont(size=28, weight='bold')
        ).pack()
        
        ctk.CTkLabel(
            card,
            text=label,
            text_color='gray',
            font=ctk.CTkFont(size=12)
        ).pack()
    
    def refresh(self):
        """Refresh stats"""
        self.after(10, self._do_load)
    
    def _rebuild_index(self):
        """Rebuild search index"""
        from tkinter import messagebox
        if self.search_service.generate_index():
            messagebox.showinfo('成功', '搜索索引重建成功')
        else:
            messagebox.showerror('错误', '搜索索引重建失败')
