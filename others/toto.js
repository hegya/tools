// ==UserScript==
// @name         替换wangmoyu.com为toto.im
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  适配Via浏览器，全局替换图片域名
// @author       自定义
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // 核心替换函数
    function replaceDomain(url) {
        return typeof url === 'string' ? url.replace(/wangmoyu\.com/g, 'toto.im') : url;
    }
    // 替换所有图片URL
    function replaceAllImages() {
        const imgAttrs = ['src', 'srcset', 'data-src', 'data-original'];
        // 处理img标签
        document.querySelectorAll('img').forEach(img => {
            imgAttrs.forEach(attr => img.hasAttribute(attr) && img.setAttribute(attr, replaceDomain(img.getAttribute(attr))));
        });
        // 处理背景图
        document.querySelectorAll('*').forEach(elem => {
            if (elem.style.backgroundImage) elem.style.backgroundImage = replaceDomain(elem.style.backgroundImage);
        });
    }
    // 监听动态DOM
    new MutationObserver(() => replaceAllImages()).observe(document.documentElement, {
        childList: true, subtree: true, attributes: true
    });
    // 初始化执行
    replaceAllImages();
    window.addEventListener('load', replaceAllImages);
})();
