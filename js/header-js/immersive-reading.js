/*==============================沉浸阅读功能==============================*/
(function() {
    'use strict';

    /*==========获取沉浸阅读按钮（第二个按钮，book图标）==========*/
    function getImmersiveButton() {
        return document.querySelector('.immersive-reading-btn');
    }

    /*==========切换沉浸阅读模式==========*/
    function toggleImmersiveReading() {
        document.body.classList.toggle('immersive-reading');
    }

    /*==========初始化==========*/
    function initImmersiveReading() {
        const immersiveButton = getImmersiveButton();
        if (immersiveButton) {
            immersiveButton.addEventListener('click', toggleImmersiveReading);
        }
    }

    /*==========页面加载完成后初始化==========*/
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImmersiveReading);
    } else {
        initImmersiveReading();
    }
})();
