/**
 * Super Prefetcher (Instant Page) - Debug Version
 */

let _speculationRulesType = 'prefetch'
  , _useWhitelist = false
  , _delayOnHover = 65
  , _mouseoverTimer
  , _preloadedList = new Set()
  , _scriptElementsQueue = [] 

// 调试开关
const DEBUG_MODE = true;

/**
 * [配置项] MAX_SCRIPT_COUNT
 */
let MAX_SCRIPT_COUNT = 10; 

const EXCLUDED_EXTENSIONS = [
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.dmg', '.pkg', '.z', '.tgz',
  '.exe', '.msi', '.apk', '.bat', '.sh', '.bin', '.app', '.deb', '.rpm', '.vbs', '.gadget', '.msu',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.rtf', '.txt', '.csv', '.ods', '.xlsm',
  '.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma', '.mid', '.midi', '.aif', '.aiff',
  '.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm', '.m4v', '.3gp', '.flv', '.vob', '.ogv',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.psd', '.ai', '.eps', '.indd',
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  '.vmdk', '.img', '.vhd', '.vdi', '.ova', '.ovf', '.bak', '.gho', '.torrent',
  '.json', '.xml', '.yaml', '.yml', '.sql', '.db', '.sqlite', '.epub', '.mobi', '.azw3'
];

init();

function init() {
  const supportChecksRelList = document.createElement('link').relList;
  if (!supportChecksRelList.supports('prefetch')) {
    if (DEBUG_MODE) console.error("[Prefetcher] 浏览器不支持 Prefetch!");
    return;
  }

  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    _speculationRulesType = 'prefetch';
    if (DEBUG_MODE) console.log("%c[Prefetcher] 模式: Speculation Rules (现代)", "color: #007bff; font-weight: bold;");
  } else {
    if (DEBUG_MODE) console.log("%c[Prefetcher] 模式: Link Prefetch (兼容)", "color: #17a2b8; font-weight: bold;");
  }

  const eventListenersOptions = { capture: true, passive: true };
  document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
  document.addEventListener('mousedown', mousedownListener, eventListenersOptions);
}

function isPreloadable(anchorElement) {
  if (!anchorElement || !anchorElement.href) return false;

  try {
    const url = new URL(anchorElement.href);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    if (url.protocol === 'http:' && location.protocol === 'https:') return false;
    if (url.hash && url.pathname + url.search === location.pathname + location.search) return false;
    if (anchorElement.hasAttribute('download')) return false;

    const pathname = url.pathname.toLowerCase();
    if (EXCLUDED_EXTENSIONS.some(ext => pathname.endsWith(ext))) return false;

    const actionKeywords = ['logout', 'signout', 'delete', 'remove', 'wp-admin', 'admin', 'login', 'exit', 'destroy'];
    const searchParams = url.search.toLowerCase();
    if (actionKeywords.some(keyword => pathname.includes(keyword) || searchParams.includes(keyword))) return false;

    if ('noInstant' in anchorElement.dataset) return false;
    if (_useWhitelist && !('instant' in anchorElement.dataset)) return false;

    return true;
  } catch (e) {
    return false;
  }
}

function preload(url, fetchPriority = 'auto', anchorElement = null) {
  if (_preloadedList.has(url)) return;

  if (DEBUG_MODE) {
    console.log(`%c[Prefetcher] 🚀 触发预加载: ${url}`, "color: #28a745; font-weight: bold; border: 1px solid #28a745; padding: 2px;");
    // 给链接加个临时的高亮边框（可选）
    if (anchorElement) {
        anchorElement.style.outline = "2px dashed #28a745";
        anchorElement.style.outlineOffset = "2px";
    }
  }

  if (_speculationRulesType !== 'none' && HTMLScriptElement.supports?.('speculationrules')) {
    preloadUsingSpeculationRules(url);
  } else {
    preloadUsingLinkElement(url, fetchPriority);
  }

  _preloadedList.add(url);
}

function preloadUsingSpeculationRules(url) {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'speculationrules';
  scriptElement.textContent = JSON.stringify({
    [_speculationRulesType]: [{ source: 'list', urls: [url] }]
  });

  if (_scriptElementsQueue.length >= MAX_SCRIPT_COUNT) {
    const oldScript = _scriptElementsQueue.shift();
    if (oldScript && oldScript.parentNode) {
      oldScript.remove();
      if (DEBUG_MODE) console.log(`%c[Prefetcher] 🗑️ 队列已满，移除旧规则。当前队列: ${_scriptElementsQueue.length}/${MAX_SCRIPT_COUNT}`, "color: #ffc107");
    }
  }

  document.head.appendChild(scriptElement);
  _scriptElementsQueue.push(scriptElement);
}

function preloadUsingLinkElement(url, fetchPriority = 'auto') {
  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = url;
  linkElement.fetchPriority = fetchPriority;
  linkElement.as = 'document';
  document.head.appendChild(linkElement);
}

// --- 事件监听器 ---

function mouseoverListener(event) {
  if (!('closest' in event.target)) return;
  const anchorElement = event.target.closest('a');
  if (!isPreloadable(anchorElement)) return;

  anchorElement.addEventListener('mouseout', mouseoutListener, { passive: true });
  
  _mouseoverTimer = setTimeout(() => {
    preload(anchorElement.href, 'high', anchorElement);
    _mouseoverTimer = null;
  }, _delayOnHover);
}

function mousedownListener(event) {
  const anchorElement = event.target.closest('a');
  if (isPreloadable(anchorElement)) preload(anchorElement.href, 'high', anchorElement);
}

function mouseoutListener(event) {
  if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) return;
  if (_mouseoverTimer) {
    clearTimeout(_mouseoverTimer);
    _mouseoverTimer = null;
  }
}