/*==============================目录生成脚本==============================*/
/* 功能：自动生成文章目录，支持点击跳转和滚动高亮 */

/*==========初始化目录系统==========*/
function initTOC() {
    /* 获取DOM元素 */
    const tocBtn = document.querySelector('.toc-btn');           /* 目录按钮 */
    const tocCard = document.querySelector('.toc-card');         /* 目录卡片 */
    const tocCloseBtn = document.querySelector('.toc-close-btn'); /* 关闭按钮 */
    const tocList = document.querySelector('.toc-list');         /* 目录列表 */
    const centerCardContent = document.querySelector('.center-card-content'); /* 内容区域 */

    /* 检查必要元素是否存在 */
    if (!tocBtn || !tocCard || !tocList || !centerCardContent) return;

    /* 目录状态 */
    let tocActive = false;

    /* 点击目录按钮显示目录 */
    tocBtn.addEventListener('click', function() {
        tocCard.classList.add('active');
        tocActive = true;
    });

    /* 点击关闭按钮隐藏目录 */
    if (tocCloseBtn) {
        tocCloseBtn.addEventListener('click', function() {
            tocCard.classList.remove('active');
            tocActive = false;
        });
    }

    /* 点击目录卡片外部隐藏目录 */
    tocCard.addEventListener('click', function(e) {
        if (e.target === tocCard) {
            tocCard.classList.remove('active');
            tocActive = false;
        }
    });

    /*==========生成目录函数==========*/
    function generateTOC() {
        /* 清空目录列表 */
        tocList.innerHTML = '';
        /* 获取所有标题和段落元素 */
        const headings = centerCardContent.querySelectorAll('h1, h2, h3, p');
        /* 目录项ID计数器 */
        let idCounter = 0;

        /* 遍历每个元素 */
        headings.forEach((element, index) => {
            let level = '';     /* 标题级别 */
            let levelClass = ''; /* CSS类名 */

            /* 根据元素类型设置级别 */
            if (element.tagName === 'H1') {
                level = '1';
                levelClass = 'level-1';
            } else if (element.tagName === 'H2') {
                level = '2';
                levelClass = 'level-2';
            } else if (element.tagName === 'H3') {
                level = '3';
                levelClass = 'level-3';
            } else if (element.tagName === 'P') {
                /* 过滤短段落 */
                if (element.textContent.trim().length < 10) return;
                level = 'p';
                levelClass = 'level-p';
            }

            /* 生成唯一ID */
            const id = `toc-${idCounter}`;
            idCounter++;
            /* 设置元素ID */
            element.setAttribute('id', id);

            /* 创建目录项 */
            const li = document.createElement('li');
            li.className = `toc-item ${levelClass}`;

            /* 创建链接 */
            const a = document.createElement('a');
            a.href = `#${id}`;
            /* 截取文本，限制长度 */
            let text = element.textContent.trim();
            if (text.length > 30) {
                text = text.substring(0, 30) + '...';
            }
            a.textContent = text;

            /* 点击链接平滑滚动到对应位置 */
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.getElementById(id);
                if (target) {
                    /* 计算目标元素相对于中心内容卡片的位置 */
                    const contentRect = centerCardContent.getBoundingClientRect();
                    const targetRect = target.getBoundingClientRect();
                    const scrollPosition = targetRect.top - contentRect.top + centerCardContent.scrollTop;
                    
                    /* 平滑滚动到目标位置 */
                    centerCardContent.scrollTo({
                        top: scrollPosition - 20, /* 减去20像素的偏移量，让标题显示在更合适的位置 */
                        behavior: 'smooth'
                    });
                    
                    /* 点击后隐藏目录 */
                    tocCard.classList.remove('active');
                    tocActive = false;
                }
            });

            /* 添加到目录列表 */
            li.appendChild(a);
            tocList.appendChild(li);
        });
    }

    /* 生成目录 */
    generateTOC();

    /* 活动目录项 */
    let activeItem = null;
    const tocItems = tocList.querySelectorAll('.toc-item');

    /*==========更新活动目录项函数==========*/
    function updateActiveTOC() {
        /* 获取所有带有toc-前缀ID的标题和段落 */
        const headings = centerCardContent.querySelectorAll('h1, h2, h3, p[id^="toc-"]');
        let currentActive = null;

        /* 找到当前可见的最上方元素 */
        headings.forEach((heading) => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentActive = heading;
            }
        });

        /* 更新活动状态 */
        if (currentActive) {
            const id = currentActive.getAttribute('id');
            tocItems.forEach((item) => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    }

    /* 滚动时更新活动目录项 */
    window.addEventListener('scroll', updateActiveTOC);
}

/*==========页面加载完成后初始化目录系统==========*/
document.addEventListener('DOMContentLoaded', initTOC);

// PJAX 成功时重新初始化
document.addEventListener('pjax:success', initTOC);
