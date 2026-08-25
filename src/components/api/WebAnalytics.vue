<script setup>
// Web Analytics (Google Analytics + Baidu Analytics) 代码
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  // Google Analytics (GA4)
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-081MCRMZPS');

  (function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-081MCRMZPS';
    var s = document.getElementsByTagName('script')[0];
    if (s) {
      s.parentNode.insertBefore(script, s);
    } else {
      document.head.appendChild(script);
    }
  })();

  // Baidu Analytics
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?6a9c58ae2a568e9aadebe953a9a4092f";
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
  <!-- Web Analytics 组件，无渲染内容 -->
</template>