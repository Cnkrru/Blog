/*==============================版权号自动生成==============================*/

/*==========更新版权号函数==========*/
function updateCopyright() {
    const currentYear = new Date().getFullYear();
    const copyrightText = `© ${currentYear} Cnkrru`;
    
    const elements = document.querySelectorAll('.copyright');
    elements.forEach(element => {
        element.textContent = copyrightText;
    });
}

/*==========初始化版权号==========*/
function initCopyright() {
    updateCopyright();
}

/*==========页面加载完成后初始化==========*/
document.addEventListener('DOMContentLoaded', initCopyright);
