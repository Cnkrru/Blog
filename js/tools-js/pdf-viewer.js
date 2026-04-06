// PDF预览器功能实现

let pdfDoc = null;
let currentPage = 1;
let zoomLevel = 1;

// 初始化PDF.js
if (window['pdfjsLib']) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPdfViewer();
});

function initPdfViewer() {
    const pdfFile = document.getElementById('pdfFile');
    const loadPdfBtn = document.getElementById('loadPdfBtn');
    const pdfUrl = document.getElementById('pdfUrl');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const zoomLevelSelect = document.getElementById('zoomLevel');
    
    if (pdfFile) {
        pdfFile.addEventListener('change', handleFileSelect);
    }
    
    if (loadPdfBtn) {
        loadPdfBtn.addEventListener('click', function() {
            if (pdfUrl && pdfUrl.value) {
                loadPdfFromUrl(pdfUrl.value);
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextPage);
    }
    
    if (zoomLevelSelect) {
        zoomLevelSelect.addEventListener('change', function() {
            zoomLevel = parseFloat(this.value);
            if (pdfDoc) {
                renderPage(currentPage);
            }
        });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedArray = new Uint8Array(this.result);
            loadPdf(typedArray);
        };
        fileReader.readAsArrayBuffer(file);
    }
}

function loadPdfFromUrl(url) {
    showLoading(true);
    pdfjsLib.getDocument(url).promise.then(function(doc) {
        pdfDoc = doc;
        currentPage = 1;
        updatePageInfo();
        renderPage(currentPage);
        showLoading(false);
    }).catch(function(error) {
        console.error('加载PDF失败:', error);
        alert('加载PDF失败，请检查URL是否正确');
        showLoading(false);
    });
}

function loadPdf(data) {
    showLoading(true);
    pdfjsLib.getDocument(data).promise.then(function(doc) {
        pdfDoc = doc;
        currentPage = 1;
        updatePageInfo();
        renderPage(currentPage);
        showLoading(false);
    }).catch(function(error) {
        console.error('加载PDF失败:', error);
        alert('加载PDF失败');
        showLoading(false);
    });
}

function renderPage(pageNum) {
    if (!pdfDoc) return;
    
    pdfDoc.getPage(pageNum).then(function(page) {
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: zoomLevel });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
        });
    });
}

function showPreviousPage() {
    if (pdfDoc && currentPage > 1) {
        currentPage--;
        updatePageInfo();
        renderPage(currentPage);
    }
}

function showNextPage() {
    if (pdfDoc && currentPage < pdfDoc.numPages) {
        currentPage++;
        updatePageInfo();
        renderPage(currentPage);
    }
}

function updatePageInfo() {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (totalPagesElement && pdfDoc) {
        totalPagesElement.textContent = pdfDoc.numPages;
    }
}

function showLoading(show) {
    const loadingElement = document.getElementById('pdfLoading');
    const canvasElement = document.getElementById('pdfCanvas');
    
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
    
    if (canvasElement) {
        canvasElement.style.display = show ? 'none' : 'block';
    }
}
