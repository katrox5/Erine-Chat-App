let start = 0
let timer: NodeJS.Timeout

export function throttleWithLastCall(fn: Function, delay = 500) {
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    const now = new Date().getTime()
    if (now - start > delay) {
      fn(...args)
      start = now
    } else {
      timer = setTimeout(() => throttleWithLastCall(fn, delay)(...args), delay)
    }
  }
}
