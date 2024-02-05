import { loadingConfig } from "./src/utils"
import { track } from "./src/trackAction"
function initSDK(options) {

  // 加载配置
  loadingConfig(options)


}

function trackError() {

}

export {
  initSDK,
  track,
  trackError,
}