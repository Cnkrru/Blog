/*==============================分享功能==============================*/
/* 支持微信、QQ、微博分享和链接复制 */

/*==========获取分享信息==========*/
function getShareInfo() {
    const title = document.querySelector('.center-head-card h2')?.textContent || document.title;
    const url = window.location.href;
    const description = '来看看这篇文章吧！';
    
    return { title, url, description };
}

/*==========显示提示==========*/
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--card-bg);
        color: var(--text-color);
        padding: 16px 32px;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--shadow-color);
        z-index: 10000;
        font-size: 14px;
        border: 2px solid var(--button-border);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease';
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

/*==========微信分享==========*/
function shareToWechat() {
    const { title, url } = getShareInfo();
    alert(`微信分享：\n\n标题：${title}\n链接：${url}\n\n请截图或复制链接分享给微信好友`);
}

/*==========QQ分享==========*/
function shareToQQ() {
    const { title, url, description } = getShareInfo();
    const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/*==========微博分享==========*/
function shareToWeibo() {
    const { title, url } = getShareInfo();
    const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/*==========复制链接==========*/
async function copyLink() {
    const { url } = getShareInfo();
    try {
        await navigator.clipboard.writeText(url);
        showToast('链接已复制到剪贴板！');
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('链接已复制到剪贴板！');
    }
}

/*==========绑定事件==========*/
function bindEvents() {
    /* 微信分享 */
    const wechatBtn = document.querySelector('.share-btn.wechat');
    if (wechatBtn) {
        wechatBtn.addEventListener('click', shareToWechat);
    }

    /* QQ分享 */
    const qqBtn = document.querySelector('.share-btn.qq');
    if (qqBtn) {
        qqBtn.addEventListener('click', shareToQQ);
    }

    /* 微博分享 */
    const weiboBtn = document.querySelector('.share-btn.weibo');
    if (weiboBtn) {
        weiboBtn.addEventListener('click', shareToWeibo);
    }

    /* 复制链接 */
    const copyBtn = document.querySelector('.share-btn.copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyLink);
    }
}

/*==========初始化分享系统==========*/
function initShareSystem() {
    bindEvents();
}

/*==========页面加载完成后初始化分享系统==========*/
document.addEventListener('DOMContentLoaded', initShareSystem);

// PJAX 成功时重新初始化
document.addEventListener('pjax:success', initShareSystem);
