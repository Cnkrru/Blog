# Blog Manager

基于 Python + CustomTkinter 的博客管理桌面应用。

## 功能

- 文章管理：创建、编辑、删除 Markdown 文章
- 友链管理：管理 links.json 中的链接
- 项目管理：管理 projects.json 中的项目
- 自动同步：自动更新 search.json 和 routes.json

## 安装

```bash
pip install -r requirements.txt
```

## 运行

```bash
python -m app.main
```

## 打包

```bash
pyinstaller --onefile --windowed --name "BlogManager" app/main.py
```
