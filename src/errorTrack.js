import { lazyReport } from "./utils"
export function errorAutoTrack() {
  window.addEventListener('error', (error) => {
    lazyReport('error', {})
    console.log(error)

  })
  window.addEventListener('unhandledrejection', (error) => {
  
    lazyReport('error', {
      message: error.reason,
      error,
      errorType: 'promiseError'
    });
  });
}