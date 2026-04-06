// 图表生成器功能实现
// 使用Chart.js库

let myChart = null;
let currentColorScheme = 'default';

// 颜色方案配置
const colorSchemes = {
    default: {
        background: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)',
            'rgba(83, 102, 255, 0.5)'
        ],
        border: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)'
        ]
    },
    warm: {
        background: [
            'rgba(255, 99, 71, 0.5)',
            'rgba(255, 140, 0, 0.5)',
            'rgba(255, 165, 0, 0.5)',
            'rgba(255, 215, 0, 0.5)',
            'rgba(255, 69, 0, 0.5)',
            'rgba(220, 20, 60, 0.5)',
            'rgba(255, 20, 147, 0.5)',
            'rgba(255, 105, 180, 0.5)'
        ],
        border: [
            'rgba(255, 99, 71, 1)',
            'rgba(255, 140, 0, 1)',
            'rgba(255, 165, 0, 1)',
            'rgba(255, 215, 0, 1)',
            'rgba(255, 69, 0, 1)',
            'rgba(220, 20, 60, 1)',
            'rgba(255, 20, 147, 1)',
            'rgba(255, 105, 180, 1)'
        ]
    },
    cool: {
        background: [
            'rgba(0, 191, 255, 0.5)',
            'rgba(30, 144, 255, 0.5)',
            'rgba(65, 105, 225, 0.5)',
            'rgba(138, 43, 226, 0.5)',
            'rgba(75, 0, 130, 0.5)',
            'rgba(0, 128, 128, 0.5)',
            'rgba(32, 178, 170, 0.5)',
            'rgba(0, 139, 139, 0.5)'
        ],
        border: [
            'rgba(0, 191, 255, 1)',
            'rgba(30, 144, 255, 1)',
            'rgba(65, 105, 225, 1)',
            'rgba(138, 43, 226, 1)',
            'rgba(75, 0, 130, 1)',
            'rgba(0, 128, 128, 1)',
            'rgba(32, 178, 170, 1)',
            'rgba(0, 139, 139, 1)'
        ]
    },
    pastel: {
        background: [
            'rgba(255, 179, 186, 0.5)',
            'rgba(255, 223, 186, 0.5)',
            'rgba(255, 255, 186, 0.5)',
            'rgba(186, 255, 201, 0.5)',
            'rgba(186, 225, 255, 0.5)',
            'rgba(225, 186, 255, 0.5)',
            'rgba(255, 186, 225, 0.5)',
            'rgba(186, 255, 255, 0.5)'
        ],
        border: [
            'rgba(255, 179, 186, 1)',
            'rgba(255, 223, 186, 1)',
            'rgba(255, 255, 186, 1)',
            'rgba(186, 255, 201, 1)',
            'rgba(186, 225, 255, 1)',
            'rgba(225, 186, 255, 1)',
            'rgba(255, 186, 225, 1)',
            'rgba(186, 255, 255, 1)'
        ]
    }
};

// 示例数据
const examples = {
    sales: {
        title: '月度销售数据',
        labels: '一月,二月,三月,四月,五月,六月',
        values: '120, 190, 300, 500, 200, 300',
        datasetLabel: '销售额（万元）'
    },
    traffic: {
        title: '网站访问量统计',
        labels: '周一,周二,周三,周四,周五,周六,周日',
        values: '1500, 2300, 3200, 2800, 3500, 4200, 3800',
        datasetLabel: '访问量（次）'
    },
    survey: {
        title: '用户满意度调查',
        labels: '非常满意,满意,一般,不满意,非常不满意',
        values: '45, 30, 15, 7, 3',
        datasetLabel: '人数（人）'
    },
    temperature: {
        title: '一周温度变化',
        labels: '周一,周二,周三,周四,周五,周六,周日',
        values: '22, 24, 26, 25, 23, 21, 20',
        datasetLabel: '温度（℃）'
    }
};

// 初始化图表
document.addEventListener('DOMContentLoaded', function() {
    // 生成默认图表
    generateChart();
    
    // 绑定事件
    document.getElementById('generateChart').addEventListener('click', generateChart);
    document.getElementById('downloadChart').addEventListener('click', downloadChart);
    document.getElementById('clearData').addEventListener('click', clearData);
    
    // 颜色方案切换
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentColorScheme = this.dataset.colors;
            generateChart();
        });
    });
    
    // 示例数据加载
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const exampleKey = this.dataset.example;
            const example = examples[exampleKey];
            if (example) {
                document.getElementById('chartTitle').value = example.title;
                document.getElementById('dataLabels').value = example.labels;
                document.getElementById('dataValues').value = example.values;
                document.getElementById('datasetLabel').value = example.datasetLabel;
                generateChart();
            }
        });
    });
    
    // 图表类型改变时重新生成
    document.getElementById('chartType').addEventListener('change', generateChart);
});

// 生成图表
function generateChart() {
    const chartType = document.getElementById('chartType').value;
    const chartTitle = document.getElementById('chartTitle').value;
    const dataLabels = document.getElementById('dataLabels').value.split(',').map(s => s.trim());
    const dataValues = document.getElementById('dataValues').value.split(',').map(s => parseFloat(s.trim()) || 0);
    const datasetLabel = document.getElementById('datasetLabel').value;
    
    // 获取颜色方案
    const colors = colorSchemes[currentColorScheme];
    
    // 如果数据长度超过颜色数量，循环使用颜色
    const backgroundColors = [];
    const borderColors = [];
    for (let i = 0; i < dataValues.length; i++) {
        backgroundColors.push(colors.background[i % colors.background.length]);
        borderColors.push(colors.border[i % colors.border.length]);
    }
    
    // 销毁旧图表
    if (myChart) {
        myChart.destroy();
    }
    
    // 创建新图表
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // 配置数据
    const chartData = {
        labels: dataLabels,
        datasets: [{
            label: datasetLabel,
            data: dataValues,
            backgroundColor: chartType === 'line' ? colors.background[0] : backgroundColors,
            borderColor: chartType === 'line' ? colors.border[0] : borderColors,
            borderWidth: 2,
            fill: chartType === 'line' ? false : true,
            tension: chartType === 'line' ? 0.4 : 0
        }]
    };
    
    // 图表配置
    const config = {
        type: chartType,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea' || chartType === 'radar' ? {} : {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    myChart = new Chart(ctx, config);
}

// 下载图表
function downloadChart() {
    if (!myChart) {
        alert('请先生成图表');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = myChart.toBase64Image();
    link.click();
}

// 清空数据
function clearData() {
    document.getElementById('chartTitle').value = '';
    document.getElementById('dataLabels').value = '';
    document.getElementById('dataValues').value = '';
    document.getElementById('datasetLabel').value = '';
    
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
}
