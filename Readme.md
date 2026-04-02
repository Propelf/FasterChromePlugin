FastChrome ⚡️
FastChrome 是一款极简、高性能的 Chrome 扩展程序，通过 推测性预加载 (Speculation Rules) 技术，在用户点击链接前提前加载页面内容，实现近乎“瞬间开启”的上网体验。

✨ 核心特性
1.在Windows桌面端，基于鼠标悬停和按下行为预测，提前获取目标页面。
用户在点击链接之前，会将鼠标悬停在该链接上。当用户悬停65毫秒后，他们会有二分之一的概率会点击该链接，因此本插件会从此时开始预加载，平均页面预加载时间为 300 毫秒以上。
人脑会将持续时间少于 100 毫秒的动作感知为瞬间完成的动作。这会让你的页面感觉像瞬间加载一样（假设你的页面渲染速度很快）。
2.智能内存管理：自动维护预加载队列，限制Scripts脚本标签数量（默认最大 10 个），防止数据膨胀和内存溢出。
3.深度下载拦截：内置详尽的后缀名黑名单（涵盖 60+ 种格式），有效防止误触发压缩包、安装包、音视频等大文件下载。
压缩/归档：
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.dmg', '.pkg', '.z', '.tgz',
执行/安装：
  '.exe', '.msi', '.apk', '.bat', '.sh', '.bin', '.app', '.deb', '.rpm', '.vbs', '.gadget', '.msu',
文档/办公：
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.rtf', '.txt', '.csv', '.ods', '.xlsm',
音频：
  '.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma', '.mid', '.midi', '.aif', '.aiff',
视频：
  '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm', '.m4v', '.3gp', '.flv', '.vob', '.ogv',
图像/设计：
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.psd', '.ai', '.eps', '.indd',
字体：
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
磁盘/备份/虚拟化：
  '.vmdk', '.img', '.vhd', '.vdi', '.ova', '.ovf', '.bak', '.gho', '.torrent',
网页/开发相关数据：
  '.json', '.xml', '.yaml', '.yml', '.sql', '.db', '.sqlite', '.epub', '.mobi', '.azw3'
此外自动识别并过滤 logout、delete、admin 等敏感动作关键词，确保预加载不会导致意外登出或数据删除。

🚀 安装方法
1.下载本项目的所有文件到一个文件夹并解压。

2.打开 Chrome 浏览器，进入扩展程序页面：chrome://extensions/。

3.在右上角开启 “开发者模式” (Developer mode)。

4.点击左上角的 “加载已解压的扩展程序” (Load unpacked)。

5.选择包含本项目文件的FasterChrome文件夹/压缩包即可完成安装。
