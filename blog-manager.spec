# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller spec file for Blog Manager"""

import os
import sys
from pathlib import Path

block_cipher = None

# Use current working directory as base
BASE_DIR = Path.cwd()
TEMPLATE_DIR = BASE_DIR / 'app' / 'templates'

# Collect all Python files in app directory
hidden_imports = [
    'customtkinter',
    'tkinter',
    'tkinter.filedialog',
    'tkinter.messagebox',
    'markdown',
    'markdown.extensions.tables',
    'markdown.extensions.fenced_code',
    'markdown.extensions.toc',
    'markdown.extensions.nl2br',
    'app.config',
    'app.ui.main_window',
    'app.ui.sidebar',
    'app.ui.post_panel',
    'app.ui.link_panel',
    'app.ui.project_panel',
    'app.ui.changelog_panel',
    'app.ui.announcement_panel',
    'app.ui.page_editor_panel',
    'app.ui.stats_panel',
    'app.ui.tag_panel',
    'app.ui.lazy_panel',
    'app.ui.base_panel',
    'app.ui.post_editor',
    'app.ui.markdown_preview_panel',
    'app.models.post',
    'app.models.link',
    'app.models.project',
    'app.models.changelog',
    'app.models.announcement',
    'app.services.post_service',
    'app.services.link_service',
    'app.services.project_service',
    'app.services.changelog_service',
    'app.services.announcement_service',
    'app.services.search_index_service',
    'app.services.base_service',
    'app.services.route_service',
    'app.utils.async_worker',
    'app.utils.cache',
    'app.utils.task_queue',
]

a = Analysis(
    ['app\\main.py'],
    pathex=[],
    binaries=[],
    datas=[
        (str(TEMPLATE_DIR), 'app\\templates'),
    ],
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='BlogManager',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='BlogManager',
)
