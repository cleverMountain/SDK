import { lazyReport } from "./utils";

let pre = new Date().getTime()
let curPage = ''
const getTime = () => {
  const now = new Date().getTime(),
    stayTime = now - pre
  pre = now
  curPage = window.location.href
  return stayTime
}
function listener() {
  const time = getTime() / 1000
  lazyReport('pageTrack', {
    eventType: curPage,
    detail: time
  })
}
const createHistoryEvent = function (type) {
  const historyEvent = history[type];
  return function () {
    const newEvent = historyEvent.apply(this, arguments); //执行history函数
    const e = new Event(type);  //声明自定义事件
    e.arguments = arguments;
    window.dispatchEvent(e);  //抛出事件
    return newEvent;  //返回方法，用于重写history的方法
  };
};
export function h5HistoryTrack() {

  history.pushState = createHistoryEvent('pushState');
  history.replaceState = createHistoryEvent('replaceState');
  // 路由改变
  window.addEventListener('pushState', listener);
  // history.go()、history.back()、history.forward() 监听
  window.addEventListener('popstate', listener);
}


export function hashHistoryTrack() {
  // vue3底层采用的是history路由不是hash路由
  window.history.pushState = createHistoryEvent('pushState');
  window.addEventListener('hashchange', listener)
  window.addEventListener('pushState', listener)
}