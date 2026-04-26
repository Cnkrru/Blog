"""Project management panel"""

import customtkinter as ctk
from tkinter import messagebox
from datetime import datetime
import logging

from app.services.project_service import ProjectService
from app.models.project import Project
from app.ui.base_panel import BasePanel

logger = logging.getLogger(__name__)


class ProjectPanel(BasePanel):
    """Panel for managing projects"""
    
    def __init__(self, parent):
        self.service = ProjectService()
        super().__init__(parent, title='项目管理', search_placeholder='按名称、分类、描述搜索...')
        self._start_loading()
    
    def _create_header_buttons(self):
        self.new_btn = ctk.CTkButton(
            self.header_frame,
            text='新建项目',
            command=self._new_project,
            width=120
        )
        self.new_btn.grid(row=0, column=1, padx=10, pady=10, sticky='e')
    
    def _load_items(self):
        self.worker.run(
            self.service.get_all_projects,
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
            or search_text in ' '.join(item.tags).lower()
        )
    
    def _create_item_card(self, project: Project, index: int) -> ctk.CTkFrame:
        card = ctk.CTkFrame(self.list_frame)
        card.grid_columnconfigure(0, weight=1)
        
        title_frame = ctk.CTkFrame(card, fg_color='transparent')
        title_frame.grid(row=0, column=0, sticky='ew', padx=15, pady=(10, 5))
        title_frame.grid_columnconfigure(0, weight=1)
        
        title_label = ctk.CTkLabel(
            title_frame,
            text=project.name,
            font=ctk.CTkFont(size=16, weight='bold'),
            anchor='w'
        )
        title_label.grid(row=0, column=0, sticky='w')
        card._title_label = title_label
        
        date_label = ctk.CTkLabel(
            title_frame,
            text=project.date,
            text_color='gray',
            font=ctk.CTkFont(size=12)
        )
        date_label.grid(row=0, column=1, sticky='e')
        card._date_label = date_label
        
        info_label = ctk.CTkLabel(
            card,
            text=f'分类: {project.category}  |  标签: {", ".join(project.tags)}',
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w'
        )
        info_label.grid(row=1, column=0, sticky='w', padx=15, pady=(0, 5))
        card._info_label = info_label
        
        desc_text = project.description[:100] + ('...' if len(project.description) > 100 else '')
        desc_label = ctk.CTkLabel(
            card,
            text=desc_text,
            text_color='gray',
            font=ctk.CTkFont(size=12),
            anchor='w',
            wraplength=800
        )
        desc_label.grid(row=2, column=0, sticky='w', padx=15, pady=(0, 10))
        card._desc_label = desc_label
        
        btn_frame = ctk.CTkFrame(card, fg_color='transparent')
        btn_frame.grid(row=3, column=0, sticky='e', padx=15, pady=(0, 10))
        
        edit_btn = ctk.CTkButton(
            btn_frame,
            text='编辑',
            width=80,
            command=lambda p=project: self._edit_project(p)
        )
        edit_btn.pack(side='left', padx=5)
        
        delete_btn = ctk.CTkButton(
            btn_frame,
            text='删除',
            width=80,
            fg_color='red',
            hover_color='darkred',
            command=lambda p=project: self._delete_project(p)
        )
        delete_btn.pack(side='left', padx=5)
        
        card.grid(row=index, column=0, sticky='ew', pady=5)
        return card
    
    def _update_card(self, card, project, index):
        card._title_label.configure(text=project.name)
        card._date_label.configure(text=project.date)
        card._info_label.configure(text=f'分类: {project.category}  |  标签: {", ".join(project.tags)}')
        desc_text = project.description[:100] + ('...' if len(project.description) > 100 else '')
        card._desc_label.configure(text=desc_text)
    
    def _new_project(self):
        dialog = ProjectEditorDialog(self, title='新建项目')
        self.wait_window(dialog)
        
        if dialog.result:
            dialog.result.date = datetime.now().strftime('%Y-%m-%d')
            
            if self.service.add_project(dialog.result):
                messagebox.showinfo('成功', '项目创建成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '项目创建失败')
    
    def _edit_project(self, project: Project):
        dialog = ProjectEditorDialog(self, project=project, title='编辑项目')
        self.wait_window(dialog)
        
        if dialog.result:
            if self.service.update_project(dialog.result):
                messagebox.showinfo('成功', '项目更新成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '项目更新失败')
    
    def _delete_project(self, project: Project):
        if messagebox.askyesno('确认', f'确定要删除项目 "{project.name}" 吗？'):
            if self.service.delete_project(project.id):
                messagebox.showinfo('成功', '项目删除成功')
                self.refresh()
            else:
                messagebox.showerror('错误', '项目删除失败')


class ProjectEditorDialog(ctk.CTkToplevel):
    """Dialog for editing project"""
    
    def __init__(self, parent, project: Project = None, title: str = '编辑项目'):
        super().__init__(parent)
        
        self.result = None
        self.project = project or Project(id='', name='', title='')
        
        self.title(title)
        self.geometry('600x500')
        self.transient(parent)
        self.grab_set()
        
        self.grid_columnconfigure(0, weight=1)
        
        self._create_widgets()
        self._load_data()
    
    def _create_widgets(self):
        """Create dialog widgets"""
        ctk.CTkLabel(self, text='名称').grid(row=0, column=0, sticky='w', padx=20, pady=(15, 5))
        self.name_entry = ctk.CTkEntry(self, width=550)
        self.name_entry.grid(row=1, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        ctk.CTkLabel(self, text='标题').grid(row=2, column=0, sticky='w', padx=20, pady=(10, 5))
        self.title_entry = ctk.CTkEntry(self, width=550)
        self.title_entry.grid(row=3, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        meta_frame = ctk.CTkFrame(self, fg_color='transparent')
        meta_frame.grid(row=4, column=0, sticky='ew', padx=20, pady=5)
        
        ctk.CTkLabel(meta_frame, text='分类').pack(side='left', padx=(0, 5))
        self.category_entry = ctk.CTkEntry(meta_frame, width=150)
        self.category_entry.pack(side='left', padx=(0, 20))
        
        ctk.CTkLabel(meta_frame, text='标签 (逗号分隔)').pack(side='left', padx=(0, 5))
        self.tags_entry = ctk.CTkEntry(meta_frame, width=250)
        self.tags_entry.pack(side='left')
        
        ctk.CTkLabel(self, text='描述').grid(row=5, column=0, sticky='w', padx=20, pady=(10, 5))
        self.desc_entry = ctk.CTkEntry(self, width=550)
        self.desc_entry.grid(row=6, column=0, padx=20, pady=(0, 10), sticky='ew')
        
        ctk.CTkLabel(self, text='关键词').grid(row=7, column=0, sticky='w', padx=20, pady=(10, 5))
        self.keywords_entry = ctk.CTkEntry(self, width=550)
        self.keywords_entry.grid(row=8, column=0, padx=20, pady=(0, 15), sticky='ew')
        
        btn_frame = ctk.CTkFrame(self, fg_color='transparent')
        btn_frame.grid(row=9, column=0, sticky='e', padx=20, pady=(0, 15))
        
        ctk.CTkButton(btn_frame, text='取消', command=self.destroy, width=100).pack(side='left', padx=5)
        ctk.CTkButton(btn_frame, text='保存', command=self._save, width=100).pack(side='left', padx=5)
    
    def _load_data(self):
        """Load project data"""
        self.name_entry.insert(0, self.project.name)
        self.title_entry.insert(0, self.project.title)
        self.category_entry.insert(0, self.project.category)
        self.tags_entry.insert(0, ', '.join(self.project.tags))
        self.desc_entry.insert(0, self.project.description)
        self.keywords_entry.insert(0, self.project.keywords)
    
    def _save(self):
        """Save project data"""
        name = self.name_entry.get().strip()
        title = self.title_entry.get().strip()
        
        if not name or not title:
            from tkinter import messagebox
            messagebox.showwarning('警告', '名称和标题不能为空')
            return
        
        self.result = Project(
            id=self.project.id,
            name=name,
            title=title,
            category=self.category_entry.get().strip(),
            tags=[t.strip() for t in self.tags_entry.get().split(',') if t.strip()],
            description=self.desc_entry.get().strip(),
            keywords=self.keywords_entry.get().strip()
        )
        
        self.destroy()
