import { getPathTo, lazyReport } from "./utils"

// 手动上报
export function track( eventType = 'click', detail) {
  lazyReport('action', { eventType, detail })
}


// 自动上报
export function trackAuto() {
  document.addEventListener('click', handleEvent, false)

  function handleEvent(e) {
 
    const clickedDom = e.target,
          no = clickedDom?.getAttribute('data-no'),
          target = clickedDom?.getAttribute('data-monitor');
    
    // 避免重复上报
    if (no) return
    if (target) {
      
      lazyReport('action', {
        eventType: 'click',
        detail: target
      })
    } else {
      const detail = getPathTo(clickedDom)
      lazyReport('action', {
        eventType: 'click',
        detail
      })
    }
  }
}