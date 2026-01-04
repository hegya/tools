// Via浏览器本地脚本：替换wangmoyu.com为toto.im
(function() {
    'use strict';
    // 核心替换逻辑
    function replaceDomain(url) {
        return typeof url === 'string' ? url.replace(/wangmoyu\.com/g, 'toto.im') : url;
    }
    // 替换图片/背景图
    function replaceAllImages() {
        // 处理img标签（含懒加载）
        const imgAttrs = ['src', 'srcset', 'data-src', 'data-original', 'data-lazy'];
        document.querySelectorAll('img').forEach(img => {
            imgAttrs.forEach(attr => {
                if (img.hasAttribute(attr)) {
                    img.setAttribute(attr, replaceDomain(img.getAttribute(attr)));
                }
            });
        });
        // 处理背景图片
        document.querySelectorAll('*').forEach(elem => {
            const bg = elem.style.backgroundImage;
            if (bg) elem.style.backgroundImage = replaceDomain(bg);
        });
    }
    // 等待DOM加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceAllImages);
    } else {
        replaceAllImages();
    }
    // 监听动态加载的内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => m.addedNodes.length && replaceAllImages());
    });
    observer.observe(document.body || document.documentElement, {
        childList: true, subtree: true
    });
})();
