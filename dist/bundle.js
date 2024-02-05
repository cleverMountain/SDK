var pre = new Date().getTime();
var curPage = '';
var getTime = function getTime() {
  var now = new Date().getTime(),
    stayTime = now - pre;
  pre = now;
  curPage = window.location.href;
  return stayTime;
};
function listener() {
  var time = getTime() / 1000;
  lazyReport('pageTrack', {
    eventType: curPage,
    detail: time
  });
}
var createHistoryEvent = function createHistoryEvent(type) {
  var historyEvent = history[type];
  return function () {
    var newEvent = historyEvent.apply(this, arguments); //执行history函数
    var e = new Event(type); //声明自定义事件
    e.arguments = arguments;
    window.dispatchEvent(e); //抛出事件
    return newEvent; //返回方法，用于重写history的方法
  };
};
function h5HistoryTrack() {
  history.pushState = createHistoryEvent('pushState');
  history.replaceState = createHistoryEvent('replaceState');
  // 路由改变
  window.addEventListener('pushState', listener);
  // history.go()、history.back()、history.forward() 监听
  window.addEventListener('popstate', listener);
}
function hashHistoryTrack() {
  // vue3底层采用的是history路由不是hash路由
  window.history.pushState = createHistoryEvent('pushState');
  window.addEventListener('hashchange', listener);
  window.addEventListener('pushState', listener);
}

// 手动上报
function track() {
  var eventType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'click';
  var detail = arguments.length > 1 ? arguments[1] : undefined;
  lazyReport('action', {
    eventType: eventType,
    detail: detail
  });
}

// 自动上报
function trackAuto() {
  document.addEventListener('click', handleEvent, false);
  function handleEvent(e) {
    var clickedDom = e.target,
      no = clickedDom === null || clickedDom === void 0 ? void 0 : clickedDom.getAttribute('data-no'),
      target = clickedDom === null || clickedDom === void 0 ? void 0 : clickedDom.getAttribute('data-monitor');

    // 避免重复上报
    if (no) return;
    if (target) {
      lazyReport('action', {
        eventType: 'click',
        detail: target
      });
    } else {
      var detail = getPathTo(clickedDom);
      lazyReport('action', {
        eventType: 'click',
        detail: detail
      });
    }
  }
}

function errorAutoTrack() {
  window.addEventListener('error', function (error) {
    lazyReport('error', {});
    console.log(error);
  });
  window.addEventListener('unhandledrejection', function (error) {
    lazyReport('error', {
      message: error.reason,
      error: error,
      errorType: 'promiseError'
    });
  });
}

function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);
    this.cache = [];
  }
  _createClass(Cache, [{
    key: "addCache",
    value: function addCache(data) {
      this.cache.push(data);
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.cache = [];
    }
  }, {
    key: "getData",
    value: function getData() {
      return this.cache;
    }
  }, {
    key: "size",
    value: function size() {
      return this.cache.length;
    }
  }]);
  return Cache;
}();
var cache = new Cache();

var sdkOptions = {};
var timer = null;
var loadingConfig = function loadingConfig(options) {
  var autoTrack = options.autoTrack,
    isHashPage = options.isHashPage,
    errorReport = options.errorReport;
  sdkOptions = options;
  if (autoTrack) {
    trackAuto();
  }
  if (errorReport) {
    errorAutoTrack();
  }
  isHashPage ? hashHistoryTrack() : h5HistoryTrack();
};
function lazyReport(reportType, options) {
  var eventType = options.eventType,
    detail = options.detail;
  var params = JSON.stringify({
    eventType: eventType,
    detail: detail
  });
  cache.addCache(params);
  var data = cache.getData();
  if (sdkOptions.delay == 0) {
    // 不延迟上报
    report(data);
    cache.clearCache();
  } else {
    clearInterval(timer);
    timer = setTimeout(function () {
      report(data);
      cache.clearCache();
    }, 1000);
  }
}
function report(data) {
  console.log('上报:' + data);
}
function getPathTo(element) {
  if (element.id !== '') return '//*[@id="' + element.id + '"]';
  if (element === document.body) return element.tagName;
  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element) return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

function initSDK(options) {
  // 加载配置
  loadingConfig(options);
}
function trackError() {}

export { initSDK, track, trackError };
