// 百度统计分析代码
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?your-site-id";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

// 百度分析配置
function initBaiduAnalytics() {
    // 这里可以添加百度分析的自定义配置
    // 例如：_hmt.push(['_setCustomVar', 1, 'userType', 'visitor', 3]);
    console.log('百度分析已初始化');
}

// 页面加载完成后初始化百度分析
document.addEventListener('DOMContentLoaded', function() {
    initBaiduAnalytics();
});
