/*==============================CSS 颜色工具功能==============================*/

/*==========转义HTML特殊字符==========*/
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/*==========RGBA 调色工具部分==========*/

// 当前颜色状态
let currentColor = {
    h: 0,    // 色相 (0-360)
    s: 100,  // 饱和度 (0-100)
    l: 50,   // 亮度 (0-100)
    a: 1     // 透明度 (0-1)
};

/*==========渐变生成器部分==========*/

// 全局变量
let colorStops = [
    { color: 'rgba(255, 0, 0, 1)', position: 0 },
    { color: 'rgba(0, 255, 0, 1)', position: 100 }
];
let gradientType = 'linear';
let gradientDirection = 90;

/*==========DOM元素==========*/

// RGBA 调色工具元素
const colorPreviewBox = document.getElementById('colorPreviewBox');
const rgbaValue = document.getElementById('rgbaValue');
const hexValue = document.getElementById('hexValue');
const hueSlider = document.getElementById('hueSlider');
const saturationSlider = document.getElementById('saturationSlider');
const lightnessSlider = document.getElementById('lightnessSlider');
const alphaInput = document.getElementById('alphaInput');
const hueValue = document.getElementById('hueValue');
const saturationValue = document.getElementById('saturationValue');
const lightnessValue = document.getElementById('lightnessValue');
const alphaValue = document.getElementById('alphaValue');

// 渐变生成器元素
const gradientPreviewBox = document.getElementById('gradientPreviewBox');
const gradientValue = document.getElementById('gradientValue');
const gradientTypeSelect = document.getElementById('gradientType');
const gradientDirectionSlider = document.getElementById('gradientDirectionSlider');
const gradientDirectionValue = document.getElementById('gradientDirectionValue');
const addColorStopBtn = document.getElementById('addColorStopBtn');
const colorStopsContainer = document.getElementById('colorStopsContainer');

/*==========初始化==========*/
function init() {
    // 初始化 RGBA 调色工具
    initRgbaTool();
    
    // 初始化渐变生成器
    initGradientGenerator();
    
    // 绑定复制按钮事件
    bindCopyButtonEvents();
}

/*==========初始化 RGBA 调色工具==========*/
function initRgbaTool() {
    // 绑定滑块事件
    bindSliderEvents();
    
    // 绑定透明度输入事件
    bindAlphaInputEvent();
    
    // 更新颜色显示
    updateColorDisplay();
    
    // 更新滑块渐变背景
    updateSliderGradients();
}

/*==========绑定滑块事件==========*/
function bindSliderEvents() {
    if (hueSlider) {
        hueSlider.addEventListener('input', (e) => {
            currentColor.h = parseInt(e.target.value);
            if (hueValue) hueValue.textContent = currentColor.h + '°';
            updateColorDisplay();
            updateSliderGradients();
        });
    }
    
    if (saturationSlider) {
        saturationSlider.addEventListener('input', (e) => {
            currentColor.s = parseInt(e.target.value);
            if (saturationValue) saturationValue.textContent = currentColor.s + '%';
            updateColorDisplay();
        });
    }
    
    if (lightnessSlider) {
        lightnessSlider.addEventListener('input', (e) => {
            currentColor.l = parseInt(e.target.value);
            if (lightnessValue) lightnessValue.textContent = currentColor.l + '%';
            updateColorDisplay();
            updateSliderGradients();
        });
    }
}

/*==========绑定透明度输入事件==========*/
function bindAlphaInputEvent() {
    if (alphaInput) {
        alphaInput.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            // 限制范围
            if (value < 0) value = 0;
            if (value > 1) value = 1;
            currentColor.a = value;
            if (alphaValue) alphaValue.textContent = value;
            updateColorDisplay();
        });
    }
}

/*==========更新颜色显示==========*/
function updateColorDisplay() {
    const rgba = hslaToRgba(currentColor.h, currentColor.s, currentColor.l, currentColor.a);
    const hex = rgbaToHex(rgba.r, rgba.g, rgba.b);
    
    // 更新预览框
    if (colorPreviewBox) {
        colorPreviewBox.style.backgroundColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${currentColor.a})`;
    }
    
    // 更新RGBA值显示
    if (rgbaValue) {
        rgbaValue.textContent = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${currentColor.a})`;
    }
    
    // 更新HEX值显示
    if (hexValue) {
        hexValue.textContent = hex;
    }
}

/*==========更新滑块渐变背景==========*/
function updateSliderGradients() {
    if (saturationSlider) {
        const hue = currentColor.h;
        saturationSlider.style.background = `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`;
    }
    
    if (lightnessSlider) {
        const hue = currentColor.h;
        const sat = currentColor.s;
        lightnessSlider.style.background = `linear-gradient(to right, hsl(${hue}, ${sat}%, 0%), hsl(${hue}, ${sat}%, 50%), hsl(${hue}, ${sat}%, 100%))`;
    }
}

/*==========初始化渐变生成器==========*/
function initGradientGenerator() {
    renderColorStops();
    updateGradient();
    bindGradientEvents();
}

/*==========绑定渐变生成器事件==========*/
function bindGradientEvents() {
    // 渐变类型变化
    if (gradientTypeSelect) {
        gradientTypeSelect.addEventListener('change', function() {
            gradientType = this.value;
            updateGradient();
        });
    }

    // 渐变方向变化
    if (gradientDirectionSlider) {
        gradientDirectionSlider.addEventListener('input', function() {
            gradientDirection = parseInt(this.value);
            if (gradientDirectionValue) gradientDirectionValue.textContent = `${gradientDirection}°`;
            updateGradient();
        });
    }

    // 添加颜色节点
    if (addColorStopBtn) {
        addColorStopBtn.addEventListener('click', addColorStop);
    }
}

/*==========渲染颜色节点==========*/
function renderColorStops() {
    if (!colorStopsContainer) return;
    
    colorStopsContainer.innerHTML = '';

    colorStops.forEach((stop, index) => {
        const colorStopElement = document.createElement('div');
        colorStopElement.className = 'color-stop-item';
        const safeColor = escapeHtml(stop.color);
        const safePosition = escapeHtml(stop.position.toString());
        const safeIndex = escapeHtml(index.toString());
        colorStopElement.innerHTML = `
            <div class="color-stop-color" style="background-color: ${safeColor}" data-index="${safeIndex}"></div>
            <div class="color-stop-controls">
                <div class="color-stop-position">
                    <label>位置:</label>
                    <input type="number" min="0" max="100" value="${safePosition}" data-index="${safeIndex}">
                    <span>%</span>
                </div>
            </div>
            <button class="remove-color-stop-btn" data-index="${safeIndex}">删除</button>
        `;
        colorStopsContainer.appendChild(colorStopElement);
    });

    // 绑定颜色选择事件
    document.querySelectorAll('.color-stop-color').forEach(element => {
        element.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openColorPicker(index);
        });
    });

    // 绑定位置输入事件
    document.querySelectorAll('.color-stop-position input').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const position = parseInt(this.value);
            if (!isNaN(position) && position >= 0 && position <= 100) {
                colorStops[index].position = position;
                // 重新排序颜色节点
                colorStops.sort((a, b) => a.position - b.position);
                renderColorStops();
                updateGradient();
            }
        });
    });

    // 绑定删除事件
    document.querySelectorAll('.remove-color-stop-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (colorStops.length > 2) {
                colorStops.splice(index, 1);
                renderColorStops();
                updateGradient();
            }
        });
    });
}

/*==========添加颜色节点==========*/
function addColorStop() {
    // 找到合适的位置插入新节点
    let newPosition = 50;
    if (colorStops.length > 0) {
        // 找到中间位置
        colorStops.sort((a, b) => a.position - b.position);
        for (let i = 0; i < colorStops.length - 1; i++) {
            const currentPos = colorStops[i].position;
            const nextPos = colorStops[i + 1].position;
            if (nextPos - currentPos > 20) {
                newPosition = Math.floor((currentPos + nextPos) / 2);
                break;
            }
        }
    }

    // 生成随机RGBA颜色
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 1;
    const randomColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    // 添加新节点
    colorStops.push({ color: randomColor, position: newPosition });
    colorStops.sort((a, b) => a.position - b.position);
    renderColorStops();
    updateGradient();
}

/*==========打开颜色选择器==========*/
function openColorPicker(index) {
    // 创建自定义颜色选择器
    createColorPicker(index);
}

/*==========创建自定义颜色选择器==========*/
function createColorPicker(index) {
    // 解析当前颜色
    let rgba = { r: 255, g: 0, b: 0, a: 1 };
    const currentColor = colorStops[index].color;
    
    // 检查是否是RGBA格式
    if (currentColor.startsWith('rgba')) {
        const match = currentColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(.*)\)/);
        if (match) {
            rgba = {
                r: parseInt(match[1]) || 0,
                g: parseInt(match[2]) || 0,
                b: parseInt(match[3]) || 0,
                a: parseFloat(match[4]) || 1
            };
        }
    } else {
        // 处理十六进制格式
        const rgb = hexToRgb(currentColor);
        rgba = { ...rgb, a: 1 };
    }

    // 创建颜色选择器覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'color-picker-overlay';

    // 创建颜色选择器容器
    const container = document.createElement('div');
    container.className = 'color-picker-container';

    // 创建颜色选择器内容
    const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    const safeRgbaString = escapeHtml(rgbaString);
    container.innerHTML = `
        <div class="color-picker-header">
            <h3>选择颜色</h3>
            <button class="color-picker-close">&times;</button>
        </div>
        <div class="color-picker-content">
            <div class="color-preview" id="colorPickerPreview"></div>
            <div class="color-inputs">
                <div class="color-input-group">
                    <label for="colorPickerRgba">RGBA</label>
                    <input type="text" id="colorPickerRgba" value="${safeRgbaString}" placeholder="例如: rgba(255, 0, 0, 1)">
                </div>
            </div>
            <div class="color-picker-buttons">
                <button class="color-picker-btn secondary" id="colorPickerCancel">取消</button>
                <button class="color-picker-btn primary" id="colorPickerConfirm">确定</button>
            </div>
        </div>
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // 绑定事件
    const rgbaInput = document.getElementById('colorPickerRgba');
    const closeBtn = container.querySelector('.color-picker-close');
    const cancelBtn = document.getElementById('colorPickerCancel');
    const confirmBtn = document.getElementById('colorPickerConfirm');
    const preview = document.getElementById('colorPickerPreview');

    // 解析RGBA字符串
    function parseRgbaString(rgbaStr) {
        const match = rgbaStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(.*)\)/);
        if (match) {
            return {
                r: parseInt(match[1]) || 0,
                g: parseInt(match[2]) || 0,
                b: parseInt(match[3]) || 0,
                a: parseFloat(match[4]) || 1
            };
        }
        return { r: 0, g: 0, b: 0, a: 1 };
    }

    // 更新颜色预览
    function updateColorPickerPreview() {
        const rgbaStr = rgbaInput.value;
        const rgba = parseRgbaString(rgbaStr);

        if (preview) {
            preview.style.backgroundColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        }
    }

    // 初始化颜色预览
    updateColorPickerPreview();

    // 颜色输入事件
    if (rgbaInput) rgbaInput.addEventListener('input', updateColorPickerPreview);

    // 关闭事件
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (overlay && overlay.parentNode === document.body) {
                document.body.removeChild(overlay);
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (overlay && overlay.parentNode === document.body) {
                document.body.removeChild(overlay);
            }
        });
    }

    // 确认事件
    if (confirmBtn) {
        confirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (rgbaInput) {
                const rgbaStr = rgbaInput.value;
                const rgba = parseRgbaString(rgbaStr);
                
                // 存储为RGBA格式
                const rgbaColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
                colorStops[index].color = rgbaColor;

                // 更新UI
                renderColorStops();
                updateGradient();
            }

            // 关闭颜色选择器
            if (overlay && overlay.parentNode === document.body) {
                document.body.removeChild(overlay);
            }
        });
    }

    // 点击覆盖层关闭
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && overlay.parentNode === document.body) {
                document.body.removeChild(overlay);
            }
        });
    }
}

/*==========更新渐变==========*/
function updateGradient() {
    let gradientCSS = '';

    if (gradientType === 'linear') {
        // 线性渐变
        gradientCSS = `linear-gradient(${gradientDirection}deg, `;
    } else {
        // 径向渐变
        gradientCSS = `radial-gradient(circle, `;
    }

    // 添加颜色节点
    colorStops.forEach((stop, index) => {
        gradientCSS += `${stop.color} ${stop.position}%`;
        if (index < colorStops.length - 1) {
            gradientCSS += ', ';
        }
    });

    gradientCSS += ')';

    // 更新预览和CSS代码
    if (gradientPreviewBox) gradientPreviewBox.style.background = gradientCSS;
    if (gradientValue) gradientValue.textContent = gradientCSS;
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

/*==========HSLA转RGBA==========*/
function hslaToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }
    
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
        a: a
    };
}

/*==========RGBA转HEX==========*/
function rgbaToHex(r, g, b) {
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

/*==========十六进制颜色转RGB==========*/
function hexToRgb(hex) {
    // 移除#号
    hex = hex.replace(/^#/, '');

    // 处理简写形式
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // 解析RGB值
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

/*==========RGB转十六进制颜色==========*/
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/*==========页面加载完成后初始化==========*/
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}