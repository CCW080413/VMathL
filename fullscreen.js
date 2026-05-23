// 全屏切换函数
function toggleFullscreen() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.classList.toggle('fullscreen-mode');

    const btn = document.querySelector('.fullscreen-toggle');
    if (pageContainer.classList.contains('fullscreen-mode')) {
        btn.textContent = '✕ 退出全屏';
    } else {
        btn.textContent = '⛶ 全屏';
    }
}

// 退出全屏
function exitFullscreen() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.classList.remove('fullscreen-mode');
    const btn = document.querySelector('.fullscreen-toggle');
    if (btn) btn.textContent = '⛶ 全屏';
}

// 键盘快捷键 - F 键全屏
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
    if (e.key === 'Escape') {
        exitFullscreen();
    }
});
