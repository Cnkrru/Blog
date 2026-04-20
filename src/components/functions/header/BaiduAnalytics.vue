<script setup>
// 百度统计分析代码
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?6a9c58ae2a568e9aadebe953a9a4092f";
    // 使用document.head或document.getElementsByTagName("script")[0]作为插入点
    var s = document.getElementsByTagName("script")[0];
    if (s) {
      s.parentNode.insertBefore(hm, s);
    } else {
      document.head.appendChild(hm);
    }
  })();
}
</script>

<template>
  <!-- 百度统计组件，无渲染内容 -->
</template>