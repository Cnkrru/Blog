#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
媒体配置更新功能
整合音乐和视频配置的更新功能
"""

from common import get_project_paths
from music_config import update_music_json
from video_config import update_video_json


def update_media_json():
    """更新媒体配置"""
    project_root, _, _ = get_project_paths()
    
    print("请选择要更新的媒体配置：")
    print("  1. 音乐配置")
    print("  2. 视频配置")
    print("  3. 同时更新音乐和视频配置")
    print()
    
    choice = input("请输入选项 (1/2/3，直接回车取消): " ).strip()
    if not choice:
        print("[INFO] 已取消")
        return
    
    if choice == '1':
        update_music_json(project_root)
    elif choice == '2':
        update_video_json(project_root)
    elif choice == '3':
        print("\n===== 开始更新音乐配置 =====")
        update_music_json(project_root)
        print("\n===== 开始更新视频配置 =====")
        update_video_json(project_root)
        print("\n[SUCCESS] 音乐和视频配置更新完成")
    else:
        print("[ERROR] 无效的选项")