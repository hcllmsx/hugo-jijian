// 汉堡菜单交互功能
(function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!menuToggle || !menu || !menuOverlay) {
        return;
    }
    
    // 切换菜单显示/隐藏
    function toggleMenu() {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            // 关闭菜单
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            // 恢复滚动
            document.body.style.overflow = '';
        } else {
            // 打开菜单
            menu.classList.add('active');
            menuOverlay.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            // 禁止滚动
            document.body.style.overflow = 'hidden';
        }
    }
    
    // 关闭菜单
    function closeMenu() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        // 恢复滚动
        document.body.style.overflow = '';
    }
    
    // 点击汉堡按钮切换菜单
    menuToggle.addEventListener('click', toggleMenu);
    
    // 点击遮罩关闭菜单
    menuOverlay.addEventListener('click', closeMenu);
    
    // 点击菜单项关闭菜单（如果是移动端）
    const menuItems = menu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // 监听窗口大小变化，在大屏幕上自动关闭菜单
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
    
    // 监听键盘事件，按ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
})();
