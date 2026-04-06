/*==============================返回顶部功能==============================*/
(function() {
    'use strict';

    /*==========获取中心内容区域==========*/
    const centerCardContent = document.querySelector('.center-card-content');
    
    /*==========获取返回顶部按钮==========*/
    const backToTopBtn = document.querySelector('.back-to-top-btn');

    /*==========返回顶部功能==========*/
    function scrollToTop() {
        if (centerCardContent) {
            centerCardContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    /*==========绑定事件==========*/
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
})();
