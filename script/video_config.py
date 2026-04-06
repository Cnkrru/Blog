#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
视频配置更新功能
包含视频配置的更新功能
"""

import json
from pathlib import Path


# 更新视频配置
def update_video_json(project_root: Path):
    print("="*50)
    print("更新视频配置")
    print("="*50)
    print()
    
    video_dir = project_root / "static" / "video"
    videos_dir = video_dir / "videos"
    imgs_dir = video_dir / "imgs"
    video_json_path = project_root / "config" / "video-launch.json"
    
    if not videos_dir.exists():
        print(f"[ERROR] 视频目录不存在: {videos_dir}")
        return
    
    # 加载现有配置
    existing_config = {}
    if video_json_path.exists():
        try:
            with open(video_json_path, 'r', encoding='utf-8') as f:
                existing_config = json.load(f)
        except Exception as e:
            print(f"[ERROR] 读取视频配置失败: {e}")
    
    # 扫描视频文件
    video_files = list(videos_dir.glob('*.mp4'))
    if not video_files:
        print("[INFO] 没有找到视频文件")
        return
    
    print(f"发现 {len(video_files)} 个视频文件")
    print()
    
    # 生成新配置
    new_videos = []
    for i, video_file in enumerate(video_files, 1):
        # 提取视频信息
        file_name = video_file.stem
        title = file_name
        
        # 查找对应图片
        image_path = ""
        for ext in ['.jpg', '.png', '.jpeg']:
            img_file = imgs_dir / f"{file_name}{ext}"
            if img_file.exists():
                image_path = f"./static/video/imgs/{file_name}{ext}"
                break
        
        # 构建相对路径
        relative_path = f"./static/video/videos/{video_file.name}"
        
        # 添加到配置
        new_videos.append({
            "id": i-1,
            "title": title,
            "filePath": relative_path,
            "imagePath": image_path
        })
        
        print(f"[{i:2d}] {title}")
    
    # 构建新配置
    new_config = {
        "videos": new_videos
    }
    
    # 保存配置
    try:
        with open(video_json_path, 'w', encoding='utf-8') as f:
            json.dump(new_config, f, ensure_ascii=False, indent=2)
        print()
        print("[SUCCESS] 视频配置更新成功")
        print(f"  配置文件: {video_json_path}")
        print(f"  视频数量: {len(new_videos)}")
    except Exception as e:
        print(f"[ERROR] 保存配置失败: {e}")