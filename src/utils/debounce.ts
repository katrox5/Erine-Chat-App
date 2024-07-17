let timer: NodeJS.Timeout

export default function debounce(fn: Function, delay = 500) {
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => fn(...args), delay)
  }
}
