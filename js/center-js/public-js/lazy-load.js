// 图片懒加载功能实现
// 使用 Intersection Observer API 实现高性能懒加载

(function() {
    'use strict';

    // 配置选项
    const config = {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01, // 元素可见1%时触发
        placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E', // 默认占位图
        loadingClass: 'lazy-loading', // 加载中类名
        loadedClass: 'lazy-loaded', // 加载完成类名
        errorClass: 'lazy-error' // 加载失败类名
    };

    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // 不支持则直接加载所有图片
        loadAllImages();
        return;
    }

    // 创建 Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: config.rootMargin,
        threshold: config.threshold
    });

    // 初始化懒加载
    function initLazyLoad() {
        // 获取所有带有 data-src 属性的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            // 添加加载中类名
            img.classList.add(config.loadingClass);
            
            // 设置占位图
            if (!img.src || img.src === window.location.href) {
                img.src = config.placeholder;
            }
            
            // 开始观察
            imageObserver.observe(img);
        });

        // 同时处理背景图片懒加载
        const lazyBackgrounds = document.querySelectorAll('[data-bg-src]');
        lazyBackgrounds.forEach(bg => {
            bg.classList.add(config.loadingClass);
            imageObserver.observe(bg);
        });
    }

    // 加载图片
    function loadImage(element) {
        // 处理普通图片
        if (element.tagName.toLowerCase() === 'img') {
            const src = element.getAttribute('data-src');
            const srcset = element.getAttribute('data-srcset');
            const sizes = element.getAttribute('data-sizes');

            if (!src) return;

            // 创建临时图片预加载
            const tempImage = new Image();
            
            tempImage.onload = function() {
                // 加载成功
                element.src = src;
                
                if (srcset) {
                    element.srcset = srcset;
                }
                
                if (sizes) {
                    element.sizes = sizes;
                }
                
                element.classList.remove(config.loadingClass);
                element.classList.add(config.loadedClass);
                element.removeAttribute('data-src');
                element.removeAttribute('data-srcset');
                element.removeAttribute('data-sizes');
                
                // 触发自定义事件
                element.dispatchEvent(new CustomEvent('lazyLoaded', { detail: { src: src } }));
            };
            
            tempImage.onerror = function() {
                // 加载失败
                element.classList.remove(config.loadingClass);
                element.classList.add(config.errorClass);
                
                // 如果有错误占位图则显示
                const errorSrc = element.getAttribute('data-error-src');
                if (errorSrc) {
                    element.src = errorSrc;
                }
                
                console.error('Failed to load image:', src);
            };
            
            tempImage.src = src;
        }
        // 处理背景图片
        else {
            const bgSrc = element.getAttribute('data-bg-src');
            
            if (!bgSrc) return;

            const tempImage = new Image();
            
            tempImage.onload = function() {
                element.style.backgroundImage = `url(${bgSrc})`;
                element.classList.remove(config.loadingClass);
                element.classList.add(config.loadedClass);
                element.removeAttribute('data-bg-src');
            };
            
            tempImage.onerror = function() {
                element.classList.remove(config.loadingClass);
                element.classList.add(config.errorClass);
                console.error('Failed to load background image:', bgSrc);
            };
            
            tempImage.src = bgSrc;
        }
    }

    // 不支持 Intersection Observer 时的降级方案
    function loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            loadImage(img);
        });
        
        const lazyBackgrounds = document.querySelectorAll('[data-bg-src]');
        lazyBackgrounds.forEach(bg => {
            loadImage(bg);
        });
    }

    // 手动触发加载特定图片
    function loadSpecificImage(selector) {
        const element = document.querySelector(selector);
        if (element) {
            loadImage(element);
            imageObserver.unobserve(element);
        }
    }

    // 重新初始化（用于动态添加的图片）
    function refresh() {
        initLazyLoad();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoad);
    } else {
        initLazyLoad();
    }

    // 导出到全局
    window.lazyLoad = {
        refresh: refresh,
        load: loadSpecificImage,
        config: config
    };

    // 添加 CSS 样式
    function addLazyLoadStyles() {
        if (document.getElementById('lazy-load-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'lazy-load-styles';
        style.textContent = `
            /* 懒加载样式 */
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            img.lazy-loading {
                opacity: 0.5;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: lazy-loading-shimmer 1.5s infinite;
            }
            
            img.lazy-loaded {
                opacity: 1;
            }
            
            img.lazy-error {
                opacity: 1;
                filter: grayscale(100%);
            }
            
            [data-bg-src] {
                background-color: #f0f0f0;
            }
            
            [data-bg-src].lazy-loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: lazy-loading-shimmer 1.5s infinite;
            }
            
            @keyframes lazy-loading-shimmer {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
            
            /* 深色模式适配 */
            @media (prefers-color-scheme: dark) {
                img.lazy-loading,
                [data-bg-src].lazy-loading {
                    background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
                    background-size: 200% 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 添加样式
    addLazyLoadStyles();

})();
