#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章管理功能
整合文章操作和工具相关的函数
"""

# 导入文章操作相关函数
from post_operations import delete_post, batch_delete_posts, edit_post_metadata, batch_edit_post_metadata, preview_post, search_posts, create_post

# 导入文章工具相关函数
from post_utils import post_statistics, scan_and_update_search_json, create_post_template