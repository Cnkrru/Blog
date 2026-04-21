#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI工具函数
"""

from PyQt5.QtWidgets import (
    QMessageBox, QInputDialog, QFileDialog, QProgressDialog,
    QTableWidget, QTableWidgetItem, QHeaderView
)
from PyQt5.QtCore import Qt


def show_info_message(parent, title, message):
    """显示信息消息框"""
    QMessageBox.information(parent, title, message)


def show_warning_message(parent, title, message):
    """显示警告消息框"""
    QMessageBox.warning(parent, title, message)


def show_error_message(parent, title, message):
    """显示错误消息框"""
    QMessageBox.critical(parent, title, message)


def show_question_message(parent, title, message):
    """显示确认消息框"""
    return QMessageBox.question(
        parent, title, message,
        QMessageBox.Yes | QMessageBox.No, QMessageBox.No
    ) == QMessageBox.Yes


def get_text_input(parent, title, label, default=''):
    """获取文本输入"""
    text, ok = QInputDialog.getText(parent, title, label, text=default)
    if ok:
        return text
    return None


def get_file_path(parent, title, directory='', filter='All Files (*)'):
    """获取文件路径"""
    file_path, _ = QFileDialog.getOpenFileName(
        parent, title, directory, filter
    )
    return file_path


def get_directory_path(parent, title, directory=''):
    """获取目录路径"""
    directory_path = QFileDialog.getExistingDirectory(
        parent, title, directory
    )
    return directory_path


def create_progress_dialog(parent, title, label, maximum=100):
    """创建进度对话框"""
    dialog = QProgressDialog(label, "取消", 0, maximum, parent)
    dialog.setWindowTitle(title)
    dialog.setWindowModality(Qt.WindowModal)
    return dialog


def setup_table_widget(table, headers):
    """设置表格组件"""
    table.setColumnCount(len(headers))
    table.setHorizontalHeaderLabels(headers)
    table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
    table.setSelectionBehavior(QTableWidget.SelectRows)
    table.setEditTriggers(QTableWidget.NoEditTriggers)


def add_table_row(table, values):
    """添加表格行"""
    row = table.rowCount()
    table.insertRow(row)
    for col, value in enumerate(values):
        item = QTableWidgetItem(str(value))
        item.setTextAlignment(Qt.AlignCenter)
        table.setItem(row, col, item)


def clear_table(table):
    """清空表格"""
    table.setRowCount(0)


def get_selected_row(table):
    """获取选中的行"""
    selected = table.selectionModel().selectedRows()
    if selected:
        return selected[0].row()
    return -1


def get_table_item_value(table, row, col):
    """获取表格单元格值"""
    item = table.item(row, col)
    if item:
        return item.text()
    return ''