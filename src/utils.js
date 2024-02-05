import { h5HistoryTrack, hashHistoryTrack } from "./pageTrack"
import { trackAuto } from "./trackAction"
import { errorAutoTrack } from "./errorTrack"
import cache from "./cache"


let sdkOptions = {}
let timer = null;
const loadingConfig = (options) => {

  const {
    autoTrack, // 是否开启自动埋点
    isHashPage, // 是否是hash模式
    errorReport, // 是否开启错误监控
  } = options
  sdkOptions = options

  if (autoTrack) {
    trackAuto()
  }
  if (errorReport) {
    errorAutoTrack()
  }
  isHashPage ? hashHistoryTrack() : h5HistoryTrack()
}


function lazyReport(reportType, options) {
  const { eventType, detail } = options
  const params = JSON.stringify({ eventType, detail })
  cache.addCache(params)
  const data = cache.getData()
  if (sdkOptions.delay == 0) {
    // 不延迟上报
    report(data)
    cache.clearCache()
  } else {
    clearInterval(timer)
    timer = setTimeout(() => {
      report(data)
      cache.clearCache()
    }, 1000)
  }
}

function report(data) {
  if (navigator.sendBeacon) { // 支持sendBeacon的浏览器
    navigator.sendBeacon(url, JSON.stringify(data));
  } else { // 不支持sendBeacon的浏览器
    let oImage = new Image();
    oImage.src = `${url}?logs=${data}`;
  }
  console.log('上报:' + data)
}

function getPathTo(element) {
  if (element.id !== '')
    return '//*[@id="' + element.id + '"]';
  if (element === document.body)
    return element.tagName;

  let ix = 0;
  let siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element)
      return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
      ix++;
  }
}


export {
  loadingConfig,
  lazyReport,
  getPathTo
}