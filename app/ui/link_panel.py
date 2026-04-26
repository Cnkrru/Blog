"""Link management panel"""

import customtkinter as ctk
from tkinter import messagebox
import logging

from app.services.link_service import LinkService
from app.models.link import Link
from app.ui.base_panel import BasePanel

logger = logging.getLogger(__name__)


class LinkPanel(BasePanel):
    """Panel for managing links"""
    
    def __init__(self, parent):
        self.service = LinkService()
        super().__init__(parent, title='友链管理', search_placeholder='按名称、分类、描述搜索...')
        self._start_loading()
    
    def _create_header_buttons(self):
        self.new_btn = ctk.CTkButton(
            self.header_frame,
            text='新建友链',
            command=self._new_link,
            width=120
        )
        self.new_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
        
        self.rebuild_btn = ctk.CTkButton(
            self.header_frame,
            text='刷新整理JSON',
            command=self._rebuild_json,
            width=140,
            fg_color='#e67e22',
            hover_color='#d35400'
        )
        self.rebuild_btn.grid(row=0, column=2, padx=10, pady=10, sticky='e')
    
    def _load_items(self):
        self.worker.run(
            self.service.get_all_links,
            on_complete=self._on_items_loaded,
            on_error=self._on_load_error,
            parent_widget=self
        )
    
    def _get_item_id(self, item):
        return item.id
    
    def _matches_search(self, item, search_text):
        return (
            search_text in item.name.lower()
            or search_text in item.category.lower()
            or search_text in item.description.lower()
            or search_text in item.url.lower()
        )
    
    def _create_item_card(self, link: Link, index: int) -> ctk.CTkFrame:
        card = ctk.CTkFrame(self.list_frame)
        card.grid_columnconfigure(0, weight=1)
        
        title_frame = ctk.CTkFrame(card, fg_color='transparent')
        title_frame.grid(row=0, column=0, sticky='ew', padx=15, pady=(10, 5))
        title_frame.grid_columnconfigure(0, weight=1)
        
        title_label = ctk.CTkLabel(
            title_frame,
            text=link.name,
            font=ctk.CTkFont(size=16, weight='bold'),
            anchor='w'
        )
        title_label.grid(row=0, column=0, sticky='w')
        card._title_label = title_label
        
        cat_label = ctk.CTkLabel(
            title_frame,
            text=link.category,
            text_color='gray',
            font=ctk.CTkFont(size=12)
        )
        cat_label.grid(row=0, column=1, sticky='e')
        card._cat_label = cat_label
        
        url_label = ctk.CTkLabel(
            card,
            text=link.url.strip(),
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w'
        )
        url_label.grid(row=1, column=0, sticky='w', padx=15, pady=(0, 5))
        card._url_label = url_label
        
        desc_label = ctk.CTkLabel(
            card,
            text=link.description,
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w'
        )
        desc_label.grid(row=2, column=0, sticky='w', padx=15, pady=(0, 10))
        card._desc_label = desc_label
        
        btn_frame = ctk.CTkFrame(card, fg_color='transparent')
        btn_frame.grid(row=3, column=0, sticky='e', padx=15, pady=(0, 10))
        
        edit_btn = ctk.CTkButton(
            btn_frame,
            text='编辑',
            width=80,
            command=lambda l=link: self._edit_link(l)
        )
        edit_btn.pack(side='left', padx=5)
        
        delete_btn = ctk.CTkButton(
            btn_frame,
            text='删除',
            width=80,
            fg_color='red',
            hover_color='darkred',
            command=lambda l=link: self._delete_link(l)
        )
        delete_btn.pack(side='left', padx=5)
        
        card.grid(row=index, column=0, sticky='ew', pady=5)
        return card
    
    def _update_card(self, card, link, index):
        card._title_label.configure(text=link.name)
        card._cat_label.configure(text=link.category)
        card._url_label.configure(text=link.url.strip())
        card._desc_label.configure(text=link.description)
    
    def _new_link(self):
        dialog = LinkEditorDialog(self, title='新建友链')
        self.wait_window(dialog)
        
        if dialog.result:
            if self.service.add_link(dialog.result):
                messagebox.showinfo('成功', '友链创建成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '友链创建失败')
    
    def _rebuild_json(self):
        if messagebox.askyesno('确认', '将重新整理 links.json（清理重复、规范化数据），是否继续？'):
            try:
                self.header_frame.configure(cursor='watch')
                result = self.service.rebuild_links_json()
                self.header_frame.configure(cursor='')
                
                if result:
                    self.refresh()
                    messagebox.showinfo('成功', 'links.json 已重新整理')
                else:
                    messagebox.showerror('错误', '整理失败，请检查日志')
            except Exception as e:
                self.header_frame.configure(cursor='')
                messagebox.showerror('错误', f'整理失败: {e}')
    
    def _edit_link(self, link: Link):
        dialog = LinkEditorDialog(self, link=link, title='编辑友链')
        self.wait_window(dialog)
        
        if dialog.result:
            if self.service.update_link(dialog.result):
                messagebox.showinfo('成功', '友链更新成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '友链更新失败')
    
    def _delete_link(self, link: Link):
        if messagebox.askyesno('确认', f'确定要删除友链 "{link.name}" 吗？'):
            if self.service.delete_link(link.id):
                messagebox.showinfo('成功', '友链删除成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '友链删除失败')


class LinkEditorDialog(ctk.CTkToplevel):
    """Dialog for editing link"""
    
    def __init__(self, parent, link: Link = None, title: str = '编辑友链'):
        super().__init__(parent)
        
        self.result = None
        self.link = link or Link(id='', name='', url='')
        
        self.title(title)
        self.geometry('500x400')
        self.transient(parent)
        self.grab_set()
        
        self.grid_columnconfigure(0, weight=1)
        
        self._create_widgets()
        self._load_data()
    
    def _create_widgets(self):
        """Create dialog widgets"""
        ctk.CTkLabel(self, text='名称').grid(row=0, column=0, sticky='w', padx=20, pady=(15, 5))
        self.name_entry = ctk.CTkEntry(self, width=450)
        self.name_entry.grid(row=1, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        ctk.CTkLabel(self, text='URL').grid(row=2, column=0, sticky='w', padx=20, pady=(10, 5))
        self.url_entry = ctk.CTkEntry(self, width=450)
        self.url_entry.grid(row=3, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        ctk.CTkLabel(self, text='分类').grid(row=4, column=0, sticky='w', padx=20, pady=(10, 5))
        self.category_entry = ctk.CTkEntry(self, width=450)
        self.category_entry.grid(row=5, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        ctk.CTkLabel(self, text='描述').grid(row=6, column=0, sticky='w', padx=20, pady=(10, 5))
        self.desc_entry = ctk.CTkEntry(self, width=450)
        self.desc_entry.grid(row=7, column=0, padx=20, pady=(0, 15), sticky='ew')
        
        btn_frame = ctk.CTkFrame(self, fg_color='transparent')
        btn_frame.grid(row=8, column=0, sticky='e', padx=20, pady=(0, 15))
        
        ctk.CTkButton(btn_frame, text='取消', command=self.destroy, width=100).pack(side='left', padx=5)
        ctk.CTkButton(btn_frame, text='保存', command=self._save, width=100).pack(side='left', padx=5)
    
    def _load_data(self):
        """Load link data"""
        self.name_entry.insert(0, self.link.name)
        self.url_entry.insert(0, self.link.url)
        self.category_entry.insert(0, self.link.category)
        self.desc_entry.insert(0, self.link.description)
    
    def _save(self):
        """Save link data"""
        name = self.name_entry.get().strip()
        url = self.url_entry.get().strip()
        
        if not name or not url:
            from tkinter import messagebox
            messagebox.showwarning('警告', '名称和URL不能为空')
            return
        
        self.result = Link(
            id=self.link.id,
            name=name,
            url=url,
            category=self.category_entry.get().strip(),
            description=self.desc_entry.get().strip()
        )
        
        self.destroy()
