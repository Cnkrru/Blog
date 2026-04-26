"""Post management panel with batch operations"""

import customtkinter as ctk
import logging
from tkinter import messagebox, filedialog
from pathlib import Path
from datetime import datetime

from app.services.post_service import PostService
from app.models.post import Post
from app.ui.post_editor import PostEditorDialog
from app.ui.base_panel import BasePanel

logger = logging.getLogger(__name__)


class PostPanel(BasePanel):
    """Panel for managing posts"""
    
    def __init__(self, parent):
        self.service = PostService()
        self.selected_posts = set()
        super().__init__(parent, title='文章管理', search_placeholder='按标题、分类、标签搜索...')
        self._start_loading()
    
    def _create_header_buttons(self):
        self.new_btn = ctk.CTkButton(
            self.header_frame,
            text='新建文章',
            command=self._new_post,
            width=120
        )
        self.new_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.batch_btn = ctk.CTkButton(
            self.header_frame,
            text='批量删除',
            command=self._batch_delete,
            width=120,
            fg_color='red',
            hover_color='darkred'
        )
        self.batch_btn.grid(row=0, column=2, padx=10, pady=10, sticky='e')
        
        self.export_btn = ctk.CTkButton(
            self.header_frame,
            text='导出文章',
            command=self._export_posts,
            width=120,
            fg_color='#27ae60',
            hover_color='#229954'
        )
        self.export_btn.grid(row=0, column=3, padx=10, pady=10, sticky='e')
        
        self.import_btn = ctk.CTkButton(
            self.header_frame,
            text='导入文章',
            command=self._import_posts,
            width=120,
            fg_color='#2980b9',
            hover_color='#2471a3'
        )
        self.import_btn.grid(row=0, column=4, padx=10, pady=10, sticky='e')
        
        self.rebuild_btn = ctk.CTkButton(
            self.header_frame,
            text='刷新整理JSON',
            command=self._rebuild_json,
            width=140,
            fg_color='#e67e22',
            hover_color='#d35400'
        )
        self.rebuild_btn.grid(row=0, column=5, padx=10, pady=10, sticky='e')
    
    def _load_items(self):
        self.worker.run(
            self.service.get_all_posts,
            on_complete=self._on_items_loaded,
            on_error=self._on_load_error,
            parent_widget=self
        )
    
    def _get_item_id(self, item):
        return item.id
    
    def _matches_search(self, item, search_text):
        return (
            search_text in item.title.lower()
            or search_text in item.category.lower()
            or search_text in ' '.join(item.tags).lower()
            or search_text in item.description.lower()
        )
    
    def _create_item_card(self, post: Post, index: int) -> ctk.CTkFrame:
        card = ctk.CTkFrame(self.list_frame)
        card.grid_columnconfigure(1, weight=1)
        
        # Checkbox for batch selection
        checkbox_frame = self._create_selection_checkbox(card, post)
        checkbox_frame.grid(row=0, column=0, rowspan=4, padx=5, pady=5, sticky='n')
        
        content_frame = ctk.CTkFrame(card, fg_color='transparent')
        content_frame.grid(row=0, column=1, sticky='nsew', padx=10, pady=5)
        content_frame.grid_columnconfigure(0, weight=1)
        
        title_frame = ctk.CTkFrame(content_frame, fg_color='transparent')
        title_frame.grid(row=0, column=0, sticky='ew')
        title_frame.grid_columnconfigure(0, weight=1)
        
        title_label = ctk.CTkLabel(
            title_frame,
            text=post.title,
            font=ctk.CTkFont(size=16, weight='bold'),
            anchor='w'
        )
        title_label.grid(row=0, column=0, sticky='w', pady=(5, 2))
        card._title_label = title_label
        
        date_label = ctk.CTkLabel(
            title_frame,
            text=post.date,
            text_color='gray',
            font=ctk.CTkFont(size=12)
        )
        date_label.grid(row=0, column=1, sticky='e', padx=10)
        card._date_label = date_label
        
        info_label = ctk.CTkLabel(
            content_frame,
            text=f'分类: {post.category}  |  标签: {", ".join(post.tags)}',
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w'
        )
        info_label.grid(row=1, column=0, sticky='w', pady=(0, 5))
        card._info_label = info_label
        
        desc_text = post.description[:100] + ('...' if len(post.description) > 100 else '')
        desc_label = ctk.CTkLabel(
            content_frame,
            text=desc_text,
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w',
            wraplength=700
        )
        desc_label.grid(row=2, column=0, sticky='w', pady=(0, 5))
        card._desc_label = desc_label
        
        btn_frame = ctk.CTkFrame(content_frame, fg_color='transparent')
        btn_frame.grid(row=3, column=0, sticky='e', pady=(0, 5))
        
        edit_btn = ctk.CTkButton(
            btn_frame,
            text='编辑',
            width=80,
            command=lambda p=post: self._edit_post(p)
        )
        edit_btn.pack(side='left', padx=5)
        
        delete_btn = ctk.CTkButton(
            btn_frame,
            text='删除',
            width=80,
            fg_color='red',
            hover_color='darkred',
            command=lambda p=post: self._delete_post(p)
        )
        delete_btn.pack(side='left', padx=5)
        
        card.grid(row=index, column=0, sticky='ew', pady=5)
        card._post_id = post.id
        return card
    
    def _create_selection_checkbox(self, card, post):
        """Create checkbox for batch selection"""
        frame = ctk.CTkFrame(card, fg_color='transparent', width=30)
        var = ctk.BooleanVar(value=False)
        checkbox = ctk.CTkCheckBox(
            frame, text='', variable=var, width=20,
            command=lambda: self._toggle_selection(post.id, var.get())
        )
        checkbox.pack(pady=5)
        card._checkbox = checkbox
        card._checkbox_var = var
        return frame
    
    def _toggle_selection(self, post_id: str, selected: bool):
        """Toggle post selection"""
        if selected:
            self.selected_posts.add(post_id)
        else:
            self.selected_posts.discard(post_id)
    
    def _clear_selection(self):
        """Clear all selections"""
        self.selected_posts.clear()
        for card in self.item_cards.values():
            if hasattr(card, '_checkbox_var'):
                card._checkbox_var.set(False)
    
    def _update_card(self, card, post, index):
        card._title_label.configure(text=post.title)
        card._date_label.configure(text=post.date)
        card._info_label.configure(text=f'分类: {post.category}  |  标签: {", ".join(post.tags)}')
        desc_text = post.description[:100] + ('...' if len(post.description) > 100 else '')
        card._desc_label.configure(text=desc_text)
        card._post_id = post.id
        card._checkbox_var.set(post.id in self.selected_posts)
    
    def _new_post(self):
        dialog = PostEditorDialog(self, title='新建文章')
        self.wait_window(dialog)
        
        if dialog.result:
            new_post = dialog.result
            if self.service.create_post(new_post):
                self.refresh()
                messagebox.showinfo('成功', '文章创建成功')
            else:
                messagebox.showerror('错误', '文章创建失败')
    
    def _batch_delete(self):
        """Batch delete selected posts"""
        if not self.selected_posts:
            messagebox.showinfo('提示', '请先选择要删除的文章')
            return
        
        if messagebox.askyesno('确认', f'确定要删除选中的 {len(self.selected_posts)} 篇文章吗？'):
            success, failure = self.service.delete_posts(list(self.selected_posts))
            
            self._clear_selection()
            self.refresh()
            
            if failure == 0:
                messagebox.showinfo('成功', f'成功删除 {success} 篇文章')
            else:
                messagebox.showwarning('部分成功', f'成功 {success} 篇，失败 {failure} 篇')
    
    def _export_posts(self):
        """Export selected or all posts to zip"""
        file_path = filedialog.asksaveasfilename(
            title='导出文章',
            defaultextension='.zip',
            filetypes=[('Zip 文件', '*.zip')],
            initialfile=f'blog-export-{datetime.now().strftime("%Y%m%d")}.zip'
        )
        
        if not file_path:
            return
        
        post_ids = list(self.selected_posts) if self.selected_posts else None
        if self.service.export_posts(Path(file_path), post_ids):
            self._clear_selection()
            messagebox.showinfo('成功', f'文章已导出到 {file_path}')
        else:
            messagebox.showerror('错误', '导出失败')
    
    def _import_posts(self):
        """Import posts from markdown files"""
        file_path = filedialog.askdirectory(title='选择包含 Markdown 文件的文件夹')
        
        if not file_path:
            return
        
        success, failure = self.service.import_posts(Path(file_path))
        
        if success > 0:
            self.refresh()
            messagebox.showinfo('导入完成', f'成功导入 {success} 篇，失败 {failure} 篇')
        else:
            messagebox.showwarning('导入失败', '没有找到可导入的文章或导入失败')
    
    def _rebuild_json(self):
        if messagebox.askyesno('确认', '将从 Markdown 文件重新生成 search.json，是否继续？'):
            try:
                self.header_frame.configure(cursor='watch')
                result = self.service.rebuild_search_index()
                self.header_frame.configure(cursor='')
                
                if result:
                    self.refresh()
                    messagebox.showinfo('成功', 'search.json 已重新生成')
                else:
                    messagebox.showerror('错误', '生成失败，请检查日志')
            except Exception as e:
                self.header_frame.configure(cursor='')
                messagebox.showerror('错误', f'生成失败: {e}')
    
    def _edit_post(self, post: Post):
        post.content = self.service.get_post_content(post.id)
        
        dialog = PostEditorDialog(self, post=post, title='编辑文章')
        self.wait_window(dialog)
        
        if dialog.result:
            if self.service.update_post(dialog.result):
                messagebox.showinfo('成功', '文章更新成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '文章更新失败')
    
    def _delete_post(self, post: Post):
        if messagebox.askyesno('确认', f'确定要删除文章 "{post.title}" 吗？'):
            if self.service.delete_post(post.id):
                messagebox.showinfo('成功', '文章删除成功')
                self.selected_posts.discard(post.id)
                self.refresh()
            else:
                messagebox.showerror('错误', '文章删除失败')
