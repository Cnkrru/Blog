// 获取基础路径函数
function getBasePath() {
    // 简化路径获取，直接返回相对于文章页面的路径
    return '../../';
}

// 自动填充上下篇文章按钮链接
function initPostNav() {
    // 检查元素是否存在
    const prevBtn = document.querySelector('.post-nav-btn.prev');
    const nextBtn = document.querySelector('.post-nav-btn.next');
    
    if (!prevBtn || !nextBtn) {
        console.log('上下篇导航元素不存在');
        return; // 元素不存在，不执行
    }
    
    // 加载search.json文件
    const basePath = getBasePath();
    console.log('加载search.json:', basePath + 'config/search.json');
    
    fetch(basePath + 'config/search.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('搜索数据加载成功:', data.length, '篇文章');
            
            // 解析当前页面URL，提取文章id
            const currentUrl = window.location.href;
            const postIdMatch = currentUrl.match(/post-(\d+)\.html/);
            
            if (postIdMatch) {
                const currentId = parseInt(postIdMatch[1]);
                console.log('当前文章ID:', currentId);
                
                // 按id排序文章数据
                const sortedPosts = data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                console.log('排序后的文章ID:', sortedPosts.map(p => p.id));
                
                // 找到当前文章的索引
                const currentIndex = sortedPosts.findIndex(post => parseInt(post.id) === currentId);
                console.log('当前文章索引:', currentIndex);
                
                if (currentIndex !== -1) {
                    // 找到上一篇文章
                    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
                    // 找到下一篇文章
                    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
                    
                    console.log('上一篇文章:', prevPost);
                    console.log('下一篇文章:', nextPost);
                    
                    // 更新上一篇按钮
                    if (prevPost) {
                        prevBtn.href = prevPost.path.replace('./', '../../');
                        const prevTitle = prevBtn.querySelector('.post-nav-btn-title');
                        if (prevTitle) {
                            prevTitle.textContent = prevPost.title;
                        }
                    } else {
                        prevBtn.href = '#';
                        const prevTitle = prevBtn.querySelector('.post-nav-btn-title');
                        if (prevTitle) {
                            prevTitle.textContent = '暂无';
                        }
                    }
                    
                    // 更新下一篇按钮
                    if (nextPost) {
                        nextBtn.href = nextPost.path.replace('./', '../../');
                        const nextTitle = nextBtn.querySelector('.post-nav-btn-title');
                        if (nextTitle) {
                            nextTitle.textContent = nextPost.title;
                        }
                    } else {
                        nextBtn.href = '#';
                        const nextTitle = nextBtn.querySelector('.post-nav-btn-title');
                        if (nextTitle) {
                            nextTitle.textContent = '暂无';
                        }
                    }
                } else {
                    console.log('未找到当前文章在搜索数据中');
                }
            } else {
                console.log('无法从URL提取文章ID');
            }
        })
        .catch(error => {
            console.error('加载search.json失败:', error);
        });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostNav);
} else {
    initPostNav();
}

// PJAX 成功时执行
document.addEventListener('pjax:success', initPostNav);