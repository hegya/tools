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

// 简化版（无动态监听）
(function() {
    'use strict';
    function replaceDomain(url) {
        return typeof url === 'string' ? url.replace(/wangmoyu\.com/g, 'toto.im') : url;
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img').forEach(img => {
            if (img.src) img.src = replaceDomain(img.src);
        });
    });
})();
