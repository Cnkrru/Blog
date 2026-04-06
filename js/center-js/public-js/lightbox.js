// 图片灯箱功能实现
// 轻量级、无依赖的图片查看器

(function() {
    'use strict';

    // 配置
    const config = {
        selector: '[data-lightbox]',
        animationDuration: 300,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        closeOnOverlayClick: true,
        showCounter: true,
        enableKeyboard: true
    };

    // 当前状态
    let currentIndex = 0;
    let images = [];
    let isOpen = false;

    // 创建灯箱DOM结构
    function createLightbox() {
        if (document.getElementById('lightbox-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-container">
                <button class="lightbox-close" title="关闭 (Esc)">&times;</button>
                <button class="lightbox-prev" title="上一张 (←)">&#8249;</button>
                <button class="lightbox-next" title="下一张 (→)">&#8250;</button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-loading">加载中...</div>
                </div>
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 绑定事件
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        // 关闭按钮
        const closeBtn = overlay.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        // 点击遮罩关闭
        if (config.closeOnOverlayClick) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay || e.target.classList.contains('lightbox-container')) {
                    closeLightbox();
                }
            });
        }

        // 上一张/下一张
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showPrev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showNext();
            });
        }

        // 键盘事件
        if (config.enableKeyboard) {
            document.addEventListener('keydown', handleKeyboard);
        }

        // 触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;

        overlay.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        overlay.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showNext();
                } else {
                    showPrev();
                }
            }
        }
    }

    // 处理键盘事件
    function handleKeyboard(e) {
        if (!isOpen) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    }

    // 初始化灯箱
    function initLightbox() {
        createLightbox();
        createStyles();

        // 获取所有带 data-lightbox 属性的图片
        const imageElements = document.querySelectorAll(config.selector);

        imageElements.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // 收集图片数据
        images = Array.from(imageElements).map(img => ({
            src: img.getAttribute('data-lightbox') || img.src,
            caption: img.getAttribute('data-caption') || img.alt || '',
            thumb: img.src
        }));
    }

    // 打开灯箱
    function openLightbox(index) {
        if (images.length === 0) return;

        currentIndex = index;
        isOpen = true;

        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 禁止背景滚动

        loadImage(currentIndex);
        updateCounter();
    }

    // 关闭灯箱
    function closeLightbox() {
        isOpen = false;

        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        overlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动

        // 清空图片
        const img = overlay.querySelector('.lightbox-image');
        if (img) {
            img.src = '';
            img.style.opacity = '0';
        }
    }

    // 加载图片
    function loadImage(index) {
        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        const img = overlay.querySelector('.lightbox-image');
        const loading = overlay.querySelector('.lightbox-loading');
        const caption = overlay.querySelector('.lightbox-caption');

        if (!img || !images[index]) return;

        // 显示加载状态
        if (loading) loading.style.display = 'block';
        img.style.opacity = '0';

        // 预加载图片
        const tempImg = new Image();
        tempImg.onload = function() {
            img.src = images[index].src;
            img.style.opacity = '1';
            if (loading) loading.style.display = 'none';
        };
        tempImg.onerror = function() {
            if (loading) loading.style.display = 'none';
            console.error('Failed to load image:', images[index].src);
        };
        tempImg.src = images[index].src;

        // 更新标题
        if (caption) {
            caption.textContent = images[index].caption;
            caption.style.display = images[index].caption ? 'block' : 'none';
        }

        // 更新按钮状态
        updateNavButtons();
    }

    // 显示上一张
    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            loadImage(currentIndex);
            updateCounter();
        }
    }

    // 显示下一张
    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            loadImage(currentIndex);
            updateCounter();
        }
    }

    // 更新导航按钮状态
    function updateNavButtons() {
        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');

        if (prevBtn) {
            prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
        }
        if (nextBtn) {
            nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
        }
    }

    // 更新计数器
    function updateCounter() {
        if (!config.showCounter || images.length <= 1) return;

        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        const counter = overlay.querySelector('.lightbox-counter');
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }
    }

    // 创建CSS样式
    function createStyles() {
        if (document.getElementById('lightbox-styles')) return;

        const style = document.createElement('style');
        style.id = 'lightbox-styles';
        style.textContent = `
            /* 灯箱遮罩层 */
            .lightbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${config.backgroundColor};
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity ${config.animationDuration}ms ease, visibility ${config.animationDuration}ms ease;
            }

            .lightbox-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            /* 灯箱容器 */
            .lightbox-container {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            /* 关闭按钮 */
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: #fff;
                font-size: 36px;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
                z-index: 10;
            }

            .lightbox-close:hover {
                transform: scale(1.1);
            }

            /* 导航按钮 */
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #fff;
                font-size: 48px;
                cursor: pointer;
                padding: 0 15px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                border-radius: 4px;
                z-index: 10;
            }

            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .lightbox-prev {
                left: -60px;
            }

            .lightbox-next {
                right: -60px;
            }

            /* 图片内容区 */
            .lightbox-content {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                transition: opacity ${config.animationDuration}ms ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            /* 加载提示 */
            .lightbox-loading {
                position: absolute;
                color: #fff;
                font-size: 14px;
                display: none;
            }

            /* 标题 */
            .lightbox-caption {
                color: #fff;
                margin-top: 15px;
                font-size: 14px;
                text-align: center;
                max-width: 100%;
                word-wrap: break-word;
            }

            /* 计数器 */
            .lightbox-counter {
                position: absolute;
                top: -35px;
                left: 0;
                color: #fff;
                font-size: 14px;
            }

            /* 响应式 */
            @media (max-width: 768px) {
                .lightbox-prev,
                .lightbox-next {
                    font-size: 36px;
                    padding: 0 10px;
                    height: 50px;
                }

                .lightbox-prev {
                    left: 10px;
                }

                .lightbox-next {
                    right: 10px;
                }

                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                }

                .lightbox-counter {
                    top: 10px;
                    left: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 5px 10px;
                    border-radius: 4px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }

    // 导出API
    window.lightbox = {
        open: openLightbox,
        close: closeLightbox,
        next: showNext,
        prev: showPrev,
        refresh: initLightbox
    };

})();
