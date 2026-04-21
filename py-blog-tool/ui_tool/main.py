#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vue-Blog UI 工具主入口
"""

import sys
from pathlib import Path
from PyQt5.QtWidgets import QApplication

# 添加当前目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from app import VueBlogUITool

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = VueBlogUITool()
    window.show()
    sys.exit(app.exec_())