// 日期工具功能实现
// 使用day.js库

// 初始化day.js
function initDayjs() {
    // 配置中文语言
    dayjs.locale('zh-cn');
    
    // 启用插件
    dayjs.extend(dayjs_plugin_relativeTime);
    dayjs.extend(dayjs_plugin_advancedFormat);
    dayjs.extend(dayjs_plugin_customParseFormat);
    dayjs.extend(dayjs_plugin_duration);
}

// 日期格式化
function formatDate() {
    const dateStr = document.getElementById('formatDate').value;
    const pattern = document.getElementById('formatPattern').value;
    
    if (!dateStr) {
        alert('请选择日期');
        return;
    }
    
    const formattedDate = dayjs(dateStr).format(pattern);
    document.getElementById('formatResult').value = formattedDate;
}

// 相对时间计算
function calculateRelativeTime() {
    const dateStr = document.getElementById('relativeDate').value;
    
    if (!dateStr) {
        alert('请选择日期');
        return;
    }
    
    const relativeTime = dayjs(dateStr).fromNow();
    document.getElementById('relativeResult').value = relativeTime;
}

// 日期计算
function calculateDate() {
    const dateStr = document.getElementById('calculateDate').value;
    const type = document.getElementById('calculateType').value;
    const value = parseInt(document.getElementById('calculateValue').value);
    const unit = document.getElementById('calculateUnit').value;
    
    if (!dateStr) {
        alert('请选择基准日期');
        return;
    }
    
    let result;
    if (type === 'add') {
        result = dayjs(dateStr).add(value, unit);
    } else {
        result = dayjs(dateStr).subtract(value, unit);
    }
    
    document.getElementById('calculateResult').value = result.format('YYYY-MM-DD HH:mm:ss');
}

// 日期比较
function compareDates() {
    const date1Str = document.getElementById('compareDate1').value;
    const date2Str = document.getElementById('compareDate2').value;
    
    if (!date1Str || !date2Str) {
        alert('请选择两个日期');
        return;
    }
    
    const date1 = dayjs(date1Str);
    const date2 = dayjs(date2Str);
    
    let result;
    if (date1.isBefore(date2)) {
        result = '日期1 在 日期2 之前';
    } else if (date1.isAfter(date2)) {
        result = '日期1 在 日期2 之后';
    } else {
        result = '日期1 和 日期2 相同';
    }
    
    document.getElementById('compareResult').value = result;
}

// 日期差计算
function calculateDateDiff() {
    const date1Str = document.getElementById('diffDate1').value;
    const date2Str = document.getElementById('diffDate2').value;
    const unit = document.getElementById('diffUnit').value;
    
    if (!date1Str || !date2Str) {
        alert('请选择开始和结束日期');
        return;
    }
    
    const date1 = dayjs(date1Str);
    const date2 = dayjs(date2Str);
    const diff = date2.diff(date1, unit);
    
    document.getElementById('diffResult').value = `${diff} ${unit}`;
}

// 获取当前日期时间
function getCurrentTime() {
    const now = dayjs();
    document.getElementById('nowResult').value = now.format('YYYY-MM-DD HH:mm:ss');
    document.getElementById('timestampResult').value = now.unix();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化day.js
    initDayjs();
    
    // 绑定事件
    document.getElementById('formatBtn').addEventListener('click', formatDate);
    document.getElementById('relativeBtn').addEventListener('click', calculateRelativeTime);
    document.getElementById('calculateBtn').addEventListener('click', calculateDate);
    document.getElementById('compareBtn').addEventListener('click', compareDates);
    document.getElementById('diffBtn').addEventListener('click', calculateDateDiff);
    document.getElementById('nowBtn').addEventListener('click', getCurrentTime);
    
    // 初始获取当前时间
    getCurrentTime();
});
