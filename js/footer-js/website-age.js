/*==============================网站建立时间计算==============================*/
/* 从 2026-03-28 12:00:00 开始计数 */

/*==========网站建立时间==========*/
const startTime = new Date('2026-03-28T12:00:00').getTime();

/*==========数字补零函数==========*/
function padZero(num) {
    return num.toString().padStart(2, '0');
}

/*==========更新显示函数==========*/
function updateDisplay(text) {
    const elements = document.querySelectorAll('.website-age');
    elements.forEach(element => {
        element.textContent = `本站已建立${text}`;
    });
}

/*==========更新网站年龄函数==========*/
function updateAge() {
    const now = Date.now();
    const diff = now - startTime;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const displayMonths = months % 12;
    const displayDays = days % 30;
    const displayHours = hours % 24;
    const displayMinutes = minutes % 60;
    const displaySeconds = seconds % 60;

    const ageText = `${years}年${displayMonths}月${displayDays}天${padZero(displayHours)}时${padZero(displayMinutes)}分${padZero(displaySeconds)}秒`;

    updateDisplay(ageText);
}

/*==========初始化网站年龄计算==========*/
function initWebsiteAge() {
    updateAge();
    setInterval(updateAge, 1000);
}

/*==========页面加载完成后初始化==========*/
document.addEventListener('DOMContentLoaded', initWebsiteAge);
