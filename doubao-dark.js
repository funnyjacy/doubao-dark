// ==UserScript==
// @name         豆包自动深色模式
// @name:en      Doubao Auto Dark Mode
// @version      2026.11.21
// @description  开启豆包网页版隐藏的深色模式，跟随系统自动切换；修复深色下底部输入框工具栏文字/图标发黑、行内代码看不清等问题
// @description:en  Enable the hidden dark mode of Doubao web, follows system theme automatically. Fixes unreadable toolbar text/icons and inline code in dark mode.
// @author       funnyjacy
// @namespace    https://github.com/funnyjacy
// @match        https://*.doubao.com/*
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateTheme() {
        const theme = getSystemTheme();

        if (document.documentElement.getAttribute('data-theme') !== theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }

        const eles = document.querySelectorAll(".flow-markdown-body");
        for (const ele of eles) {
            if (ele.getAttribute("theme-mode") !== theme) {
                ele.setAttribute("theme-mode", theme);
            }
        }
    }

    function setDataTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const eles = document.querySelectorAll(".flow-markdown-body")
        for (const ele of eles) {
            ele.setAttribute("theme-mode", theme)
        }
    }

    const CSS = `
    @media (prefers-color-scheme: dark) {
        [class^="code-product-card-container"] [class^="card"] {
            background: #333 !important;
        }
        .md-box-root {
            --md-box-color-fg: white !important;
        }
        /* 行内代码（\`code\`）在深色模式下默认仍是黑字，深色背景上看不清，
           这里改成浅色字 + 半透明深色底，并加圆角与内边距让它更清晰 */
        .flow-markdown-body :not(pre) > code,
        .md-box-root :not(pre) > code {
            color: #e6e6e6 !important;
            background: rgba(255, 255, 255, 0.12) !important;
            border-radius: 4px;
            padding: 0.1em 0.35em;
        }
        /* 豆包设计系统(dbd)的正文色 token --dbd-text-100 浅色值挂在 :root 上，
           站点深色 token 靠属性切换但被 JS 锁定，普通优先级覆盖无效，
           这里强制切到深色值，修复底部输入框工具栏文字/图标发黑 */
        html[data-theme="dark"] {
            --dbd-text-100: #ffffffd9 !important;
        }
    }
    `

    const styleElement = document.createElement('style');

    styleElement.textContent = CSS;

    document.body.appendChild(styleElement);

    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    // 实测工具栏位图图标亮度：深色素材才反白（站点自带白色 dark: 素材不动）
    const invertedIcons = new Set();
    async function invertDarkIcons() {
        const imgs = document.querySelectorAll(".dbd-button__content img");
        for (const img of imgs) {
            if (!img.getBoundingClientRect().width || invertedIcons.has(img.src)) continue;
            invertedIcons.add(img.src);
            try {
                const bmp = await createImageBitmap(await (await fetch(img.src)).blob());
                const ctx = new OffscreenCanvas(8, 8).getContext("2d");
                ctx.drawImage(bmp, 0, 0, 8, 8);
                const d = ctx.getImageData(0, 0, 8, 8).data;
                let sum = 0, n = 0;
                for (let i = 0; i < d.length; i += 4) {
                    if (d[i + 3] > 128) { sum += (d[i] + d[i + 1] + d[i + 2]) / 3; n++; }
                }
                if (n && sum / n < 128) img.style.filter = "invert(1)";
            } catch (e) { /* 跨域等失败时放弃该图标 */ }
        }
    }
    invertDarkIcons();

    const observer = new MutationObserver((mutations) => {
        updateTheme();
        invertDarkIcons();
    });
    observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['data-theme', 'theme-mode']
    });

    const settingsEl = document.querySelector(".flow-web-root-outlet");
    if (settingsEl) {
        settingsEl.style.background = "#222";
    }
})();
