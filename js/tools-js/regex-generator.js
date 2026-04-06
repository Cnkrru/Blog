/*==============================正则表达式生成器功能==============================*/

/*==========DOM元素==========*/

// 预览和值显示元素
const regexPreview = document.getElementById('regexPreview');
const regexValue = document.getElementById('regexValue');

// 字符类型选择
const charLetters = document.getElementById('charLetters');
const charNumbers = document.getElementById('charNumbers');
const charLowercase = document.getElementById('charLowercase');
const charUppercase = document.getElementById('charUppercase');
const charWhitespace = document.getElementById('charWhitespace');
const charSpecial = document.getElementById('charSpecial');
const charCustom = document.getElementById('charCustom');
const customChars = document.getElementById('customChars');

// 重复次数设置
const repeatFixed = document.getElementById('repeatFixed');
const repeatFixedValue = document.getElementById('repeatFixedValue');
const repeatRange = document.getElementById('repeatRange');
const repeatMin = document.getElementById('repeatMin');
const repeatMax = document.getElementById('repeatMax');
const repeatAtLeast = document.getElementById('repeatAtLeast');
const repeatAtLeastValue = document.getElementById('repeatAtLeastValue');
const repeatOptional = document.getElementById('repeatOptional');
const repeatAny = document.getElementById('repeatAny');

// 位置设置
const positionStart = document.getElementById('positionStart');
const positionEnd = document.getElementById('positionEnd');

// 高级选项
const optionCaseInsensitive = document.getElementById('optionCaseInsensitive');
const optionGlobal = document.getElementById('optionGlobal');
const optionMultiline = document.getElementById('optionMultiline');

/*==========初始化==========*/
function init() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化生成正则表达式
    generateRegex();
    
    // 绑定复制按钮事件
    bindCopyButtonEvents();
}

/*==========绑定事件监听器==========*/
function bindEventListeners() {
    // 字符类型选择事件
    if (charLetters) charLetters.addEventListener('change', generateRegex);
    if (charNumbers) charNumbers.addEventListener('change', generateRegex);
    if (charLowercase) charLowercase.addEventListener('change', generateRegex);
    if (charUppercase) charUppercase.addEventListener('change', generateRegex);
    if (charWhitespace) charWhitespace.addEventListener('change', generateRegex);
    if (charSpecial) charSpecial.addEventListener('change', generateRegex);
    if (charCustom) charCustom.addEventListener('change', generateRegex);
    if (customChars) customChars.addEventListener('input', generateRegex);
    
    // 重复次数设置事件
    if (repeatFixed) repeatFixed.addEventListener('change', generateRegex);
    if (repeatFixedValue) repeatFixedValue.addEventListener('input', generateRegex);
    if (repeatRange) repeatRange.addEventListener('change', generateRegex);
    if (repeatMin) repeatMin.addEventListener('input', generateRegex);
    if (repeatMax) repeatMax.addEventListener('input', generateRegex);
    if (repeatAtLeast) repeatAtLeast.addEventListener('change', generateRegex);
    if (repeatAtLeastValue) repeatAtLeastValue.addEventListener('input', generateRegex);
    if (repeatOptional) repeatOptional.addEventListener('change', generateRegex);
    if (repeatAny) repeatAny.addEventListener('change', generateRegex);
    
    // 位置设置事件
    if (positionStart) positionStart.addEventListener('change', generateRegex);
    if (positionEnd) positionEnd.addEventListener('change', generateRegex);
    
    // 高级选项事件
    if (optionCaseInsensitive) optionCaseInsensitive.addEventListener('change', generateRegex);
    if (optionGlobal) optionGlobal.addEventListener('change', generateRegex);
    if (optionMultiline) optionMultiline.addEventListener('change', generateRegex);
}

/*==========生成正则表达式==========*/
function generateRegex() {
    let regex = '';
    
    // 添加开头锚点
    if (positionStart && positionStart.checked) {
        regex += '^';
    }
    
    // 生成字符集
    const charSet = generateCharSet();
    regex += charSet;
    
    // 添加重复次数
    const repeatPattern = generateRepeatPattern();
    regex += repeatPattern;
    
    // 添加结尾锚点
    if (positionEnd && positionEnd.checked) {
        regex += '$';
    }
    
    // 添加标志
    const flags = generateFlags();
    const fullRegex = `/${regex}/${flags}`;
    
    // 更新预览和值显示
    if (regexPreview) regexPreview.textContent = fullRegex;
    if (regexValue) regexValue.textContent = fullRegex;
}

/*==========生成字符集==========*/
function generateCharSet() {
    let charSet = '';
    let hasChars = false;
    
    // 收集所有选中的字符类型
    if (charLetters && charLetters.checked) {
        charSet += 'a-zA-Z';
        hasChars = true;
    }
    
    if (charNumbers && charNumbers.checked) {
        charSet += '0-9';
        hasChars = true;
    }
    
    if (charLowercase && charLowercase.checked) {
        charSet += 'a-z';
        hasChars = true;
    }
    
    if (charUppercase && charUppercase.checked) {
        charSet += 'A-Z';
        hasChars = true;
    }
    
    if (charWhitespace && charWhitespace.checked) {
        charSet += '\\s';
        hasChars = true;
    }
    
    if (charSpecial && charSpecial.checked) {
        // 转义特殊字符
        charSet += '!@#$%^&*()_+-=[]{};\\'"\\|,.<>/?';
        hasChars = true;
    }
    
    if (charCustom && charCustom.checked && customChars && customChars.value) {
        // 转义自定义字符中的特殊字符
        const custom = escapeRegExp(customChars.value);
        charSet += custom;
        hasChars = true;
    }
    
    // 如果没有选择任何字符类型，默认使用任意字符
    if (!hasChars) {
        return '.';
    }
    
    // 包装为字符集
    return `[${charSet}]`;
}

/*==========生成重复模式==========*/
function generateRepeatPattern() {
    if (repeatFixed && repeatFixed.checked && repeatFixedValue) {
        const value = parseInt(repeatFixedValue.value) || 1;
        return `{${value}}`;
    }
    
    if (repeatRange && repeatRange.checked && repeatMin && repeatMax) {
        const min = parseInt(repeatMin.value) || 0;
        const max = parseInt(repeatMax.value) || 10;
        return `{${min},${max}}`;
    }
    
    if (repeatAtLeast && repeatAtLeast.checked && repeatAtLeastValue) {
        const value = parseInt(repeatAtLeastValue.value) || 0;
        return `{${value},}`;
    }
    
    if (repeatOptional && repeatOptional.checked) {
        return '?';
    }
    
    if (repeatAny && repeatAny.checked) {
        return '*';
    }
    
    // 默认重复一次
    return '';
}

/*==========生成标志==========*/
function generateFlags() {
    let flags = '';
    
    if (optionCaseInsensitive && optionCaseInsensitive.checked) {
        flags += 'i';
    }
    
    if (optionGlobal && optionGlobal.checked) {
        flags += 'g';
    }
    
    if (optionMultiline && optionMultiline.checked) {
        flags += 'm';
    }
    
    return flags;
}

/*==========转义正则表达式特殊字符==========*/
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/*==========绑定复制按钮事件==========*/
function bindCopyButtonEvents() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const text = targetElement.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    // 显示复制成功状态
                    const originalText = button.textContent;
                    button.textContent = '已复制';
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove('copied');
                    }, 1500);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        });
    });
}

/*==========页面加载完成后初始化==========*/
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}