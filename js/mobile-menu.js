document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const leftAsider = document.querySelector('.left-asider-S');
    
    // 菜单按钮点击事件
    mobileMenuToggle.addEventListener('click', function() {
        leftAsider.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
    });
    
    // 遮罩层点击事件
    mobileMenuOverlay.addEventListener('click', function() {
        leftAsider.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    });
    
    // 侧边栏链接点击事件
    const sidebarLinks = leftAsider.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            leftAsider.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });
    });
});