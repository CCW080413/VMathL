function enterApp() {
    // 平滑过渡到菜单页面
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 500);
}

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease';
    }, 100);
});
