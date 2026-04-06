# 个人博客项目

## 项目简介

这是一个功能完整的个人博客网站，包含文章管理、小说阅读、工具集等功能。项目采用纯HTML、CSS和JavaScript开发，无需后端服务器，可直接部署到任何静态网站托管服务。

## 项目结构

```
├── config/               # 配置文件
│   ├── projects.json     # 项目配置
│   └── search.json       # 搜索索引
├── css/                  # 样式文件
│   ├── center-css/       # 中心内容样式
│   │   ├── pages-css/    # 页面特定样式
│   │   ├── tools-css/    # 工具页面样式
│   │   └── ...
│   ├── header-css/       # 页头样式
│   └── public-css/       # 公共样式
├── html/                 # HTML页面
│   ├── archives/         # 归档页面
│   ├── indexs/           # 索引页面
│   ├── links/            # 友链页面
│   ├── novels/           # 小说页面
│   ├── posts/            # 文章页面
│   ├── projects/         # 项目页面
│   └── tools/            # 工具页面
├── import_export/        # 导入导出目录
│   ├── export/           # 导出文件
│   └── import/           # 导入文件
├── js/                   # JavaScript文件
│   ├── center-js/        # 中心内容脚本
│   ├── config-js/        # 配置脚本
│   ├── footer-js/        # 页脚脚本
│   ├── header-js/        # 页头脚本
│   ├── tools-js/         # 工具脚本
│   └── baidu-analytics.js # 百度统计
├── script/               # Python脚本
│   ├── category_management.py    # 分类管理
│   ├── cli_utils.py              # 命令行工具通用函数
│   ├── color_utils.py            # 颜色输出工具
│   ├── common.py                 # 通用工具函数
│   ├── config_utils.py           # 配置管理
│   ├── content_import_export.py  # 内容导入导出
│   ├── error_handling.py         # 错误处理
│   ├── file_monitor.py           # 文件系统监控
│   ├── help_utils.py             # 帮助系统
│   ├── import_functions.py       # 导入功能
│   ├── log_utils.py              # 日志管理
│   ├── path_utils.py             # 路径管理
│   ├── post_management.py        # 文章管理
│   ├── post_operations.py        # 文章操作
│   ├── post_utils.py             # 文章工具函数
│   ├── site_maintenance.py       # 站点维护
│   ├── stats_analysis.py         # 数据统计和分析
│   ├── tag_management.py         # 标签管理
│   ├── version_utils.py          # 版本管理
│   └── main.py                   # 主调度脚本
├── static/               # 静态资源
│   └── img/              # 图片
├── index.html            # 首页
├── robots.txt            # 爬虫配置
├── sitemap.xml           # 站点地图
└── README.md             # 项目说明
```

## 主要功能

### 1. 文章系统
- 支持Markdown格式文章
- 文章分类和标签
- 文章搜索功能
- 文章上下篇导航
- 代码高亮和复制
- 支持KaTeX数学公式
- 支持Mermaid流程图

### 2. 小说系统
- 小说章节管理
- 小说阅读页面
- 章节导航

### 3. 工具集
- Base64编解码器
- 图表生成器
- CSS颜色工具
- 日期工具
- PDF查看器
- 二维码生成器
- 正则表达式生成器

### 4. 其他功能
- 深色/浅色主题切换
- 响应式设计
- 百度统计分析
- 分享功能
- 评论系统
- 灯箱效果
- 懒加载

## 如何使用

### 1. 本地运行

1. 克隆项目到本地
2. 使用浏览器直接打开 `index.html` 文件
3. 或使用本地服务器运行

### 2. 部署

1. 将所有文件上传到静态网站托管服务
2. 确保 `sitemap.xml` 和 `robots.txt` 正确配置
3. 配置百度统计（修改 `js/baidu-analytics.js` 中的站点ID）

## 脚本工具

### 命令行工具 (`script/main.py`)

项目提供了一个功能强大的命令行工具，用于管理博客内容和维护站点。运行方式：

```bash
python script/main.py
```

主要功能包括：

1. **文章管理**
   - 创建新文章
   - 删除文章（单篇或批量）
   - 编辑文章元数据
   - 预览文章内容
   - 搜索文章
   - 文章统计
   - 扫描并更新search.json

2. **站点维护**
   - 创建Markdown文章模板
   - 草稿管理（重命名、删除、预览、发布）
   - 将草稿转化为HTML模板
   - 清空草稿文件夹
   - 站点统计
   - 自动清理（临时文件和空目录）

3. **内容导入导出**
   - 导出文章为Markdown
   - 导出文章为HTML
   - 从Markdown导入文章
   - 从HTML导入文章
   - 导入导出目录管理

4. **分类管理**
   - 查看所有分类
   - 添加新分类
   - 编辑分类
   - 删除分类

5. **标签管理**
   - 查看所有标签
   - 添加新标签
   - 编辑标签
   - 删除标签

6. **数据统计和分析**
   - 文章统计
   - 分类统计
   - 标签统计
   - 生成统计报告

7. **配置管理**
   - 查看当前配置
   - 编辑配置
   - 重置配置为默认值
   - 导入/导出配置
   - 验证配置

8. **日志管理**
   - 查看日志
   - 清理日志

9. **帮助中心**
    - 查看使用帮助

10. **版本管理**
    - 查看版本信息
    - 更新版本号

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **样式**：CSS变量, 响应式设计
- **脚本**：Python 3
- **第三方库**：
  - Markdown
  - KaTeX (数学公式)
  - Mermaid (流程图)
  - Notyf (通知)
  - Clipboard.js (代码复制)
  - QRCode.js (二维码)

## 目录说明

- **config/**: 存储各种配置文件
- **css/**: 样式文件，按功能和页面分类
- **html/**: 所有HTML页面，按功能分类
- **import_export/**: 导入导出目录，用于存放导入导出的文件
- **js/**: JavaScript脚本，按功能分类
- **script/**: Python工具脚本，包含完整的命令行工具
- **static/**: 静态资源（图片）

## 开发建议

1. **添加新文章**：使用命令行工具 `python script/main.py` 中的"文章管理"功能创建
2. **管理文章**：使用命令行工具 `python script/main.py` 中的"文章管理"功能进行管理
3. **优化性能**：使用资源压缩工具压缩CSS/JS
4. **SEO优化**：确保每个页面都有合适的meta标签
5. **使用命令行工具**：命令行工具提供了完整的站点管理功能，建议使用它来管理博客内容

## 浏览器兼容性

- 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- 响应式设计，支持移动端

## 许可证

MIT License
