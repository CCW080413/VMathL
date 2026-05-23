// 导航功能
function navigateTo(element) {
    const path = element.getAttribute('data-path');

    // 如果路径为 "#"，说明还未开发，显示提示
    if (path === '#') {
        showNotification('此功能正在开发中，敬请期待！');
        return;
    }

    // 平滑过渡
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        window.location.href = path;
    }, 500);
}

// 返回函数
function goBack() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        window.location.href = 'main.html';
    }, 500);
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #000000;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease';
    }, 100);
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // Esc键返回
    if (e.key === 'Escape') {
        goBack();
    }
});
