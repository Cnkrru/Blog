<script setup>
// Google Analytics (GA4) 代码
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
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
}
</script>

<template>
  <!-- Google Analytics 组件，无渲染内容 -->
</template>