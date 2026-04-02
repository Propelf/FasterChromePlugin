
let _speculationRulesType = 'prefetch'
  , _useWhitelist = false
  , _delayOnHover = 65
  , _mouseoverTimer
  , _preloadedList = new Set()
  , _scriptElementsQueue = []
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
  if (!supportChecksRelList.supports('prefetch')) return;

  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    _speculationRulesType = 'prefetch';
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

function preload(url, fetchPriority = 'auto') {
  if (_preloadedList.has(url)) return;

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

function mouseoverListener(event) {
  if (!('closest' in event.target)) return;
  const anchorElement = event.target.closest('a');
  if (!isPreloadable(anchorElement)) return;

  anchorElement.addEventListener('mouseout', mouseoutListener, { passive: true });

  _mouseoverTimer = setTimeout(() => {
    preload(anchorElement.href, 'high');
    _mouseoverTimer = null;
  }, _delayOnHover);
}

function mousedownListener(event) {
  const anchorElement = event.target.closest('a');
  if (isPreloadable(anchorElement)) preload(anchorElement.href, 'high');
}

function mouseoutListener(event) {
  if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) return;
  if (_mouseoverTimer) {
    clearTimeout(_mouseoverTimer);
    _mouseoverTimer = null;
  }
}
