# 豆包自动深色模式 (Doubao Auto Dark Mode)

[![Userscript](https://img.shields.io/badge/安装-油猴脚本-blue)](https://raw.githubusercontent.com/funnyjacy/doubao-dark/main/doubao-dark.js)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

一个油猴（Tampermonkey）脚本，开启[豆包](https://www.doubao.com)网页版**没有官方开关的隐藏深色模式**，并跟随系统主题自动切换。

## 功能

- 🌙 开启豆包网页版隐藏的深色模式，跟随系统自动切换浅色/深色
- 🔧 修复深色模式下底部输入框工具栏文字/图标发黑的问题（豆包设计系统 dbd 的正文色 token 被锁定在浅色值）
- 🔧 修复行内代码（`inline code`）深色背景上黑字看不清的问题

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展
2. 点击下面链接安装（篡改猴会自动弹安装页）：

   **https://raw.githubusercontent.com/funnyjacy/doubao-dark/main/doubao-dark.js**

   或手动：篡改猴面板 → 添加新脚本 → 粘贴 [doubao-dark.js](doubao-dark.js) 全文并保存

## 说明

- 兼容 Chrome / Edge（其他 Chromium 内核浏览器同样适用）
- 深色模式下部分第三方嵌入卡片可能仍为浅色，属豆包自身样式问题
- 本脚本基于 greasyfork 上 alikia2x 的[原版](https://greasyfork.org/zh-CN/scripts/547094)修改而来，感谢原作者

## License

MIT
