# FastChrome 

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chrome.google.com/webstore)
[![Speed](https://img.shields.io/badge/Speed-Instant-green.svg)](#)

**FastChrome** 是一款极简、高性能的 Chrome 浏览器扩展。它利用 Google 的 **推测性预加载 (Speculation Rules)** 技术，在用户真正点击链接前，提前完成页面加载，为你带来近乎“瞬间开启”的极速上网体验。

---

## ✨ 核心特性

### 1. 毫秒级预判加载
* **悬停触发**：当鼠标悬停在链接上超过 **65ms** 时，插件即判定用户有 50% 以上的概率点击，并立即启动预加载。
* **消除延迟**：人类对低于 100ms 的动作感知为“瞬时”。FastChrome 平均提供 **300ms+** 的领先加载时间，让网页渲染在点击的一刻便已就绪。

### 2. 智能内存管理
* **自动控额**：动态维护预加载队列，将预加载脚本标签（Scripts）限制在 **10 个** 以内。
* **防溢出**：有效防止页面因过度预加载导致的内存膨胀和浏览器卡顿。

### 3. 深度安全拦截 (Safe-Preload)
* **静默避让**：自动识别并过滤包含 `logout`、`delete`、`admin`、`signout` 等关键词的敏感链接，防止意外执行登出或删除操作。
* **后缀黑名单**：内置 60+ 种文件后缀检测，精准拦截以下类型的预加载，节省流量并避免误触发下载：
    * **压缩包**: `.zip`, `.rar`, `.7z`, `.tar`, `.iso` ...
    * **执行文件**: `.exe`, `.msi`, `.apk`, `.bat` ...
    * **多媒体**: `.mp4`, `.mkv`, `.mp3`, `.flac` ...
    * **文档/字体**: `.pdf`, `.docx`, `.ttf`, `.woff2` ...

---

## 🛠️ 后缀拦截列表 (部分)

| 类型 | 拦截后缀 |
| :--- | :--- |
| **压缩/镜像** | `.zip` `.rar` `.7z` `.tar` `.gz` `.iso` `.dmg` |
| **安装/执行** | `.exe` `.msi` `.apk` `.deb` `.app` `.sh` |
| **办公/文档** | `.pdf` `.docx` `.xlsx` `.pptx` `.txt` `.epub` |
| **影音素材** | `.mp4` `.mkv` `.avi` `.mp3` `.wav` `.flac` |
| **开发/数据库**| `.json` `.xml` `.yaml` `.sql` `.sqlite` |

---

## 🚀 安装方法

1.  **下载源码**：下载本项目仓库并解压到本地文件夹（如 `FastChrome-main`）。
2.  **管理扩展**：在 Chrome 地址栏输入 `chrome://extensions/` 并回车。
3.  **开发者模式**：打开页面右上角的 **“开发者模式”** 开关。
4.  **导入插件**：点击左上角的 **“加载已解压的扩展程序” (Load unpacked)**。
5.  **选择目录**：在弹出的窗口中选择刚才解压的文件夹，安装即刻完成。

---

## 🛠 技术原理

本插件主要采用了 Chrome 108+ 支持的 Speculation Rules API。

预判逻辑：当鼠标在链接上悬停超过 65ms 时，插件认为用户有极大概率访问该页面。

内存保护：采用 FIFO（先进先出）队列管理注入的规则标签，确保页面 head 始终保持整洁。

兼容性：在不支持推测规则的浏览器上，会自动降级使用传统的 <link rel="prefetch">。

---

## 📂 文件结构

manifest.json：扩展程序配置文件。

content.js：核心逻辑脚本。

icons/：存放插件图标 (16x16, 48x48, 128x128)。

README.md：项目说明文档。

---

## 🙏 致谢 (Acknowledgments)

本项目在开发过程中参考了以下优秀项目与文章的思路：

## 1.ChromeAppHeroes - Faster Chrome
感谢 zhaoolee 提供的插件英雄榜推荐与启发。

## 2.instant.page
感谢 Alexandre Dieulot 提出的即时预加载理念及其优秀的开源基础。

---

## 📝 注意事项

* 本插件目前主要针对 **Windows 桌面端** 的鼠标行为进行优化。
* 预加载效果取决于目标网站对 `Speculation Rules API` 的兼容性及页面本身的渲染速度。

---

### 开源协议

[MIT License](LICENSE) © 2026
