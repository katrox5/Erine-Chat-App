export function debounce(func: Function, delay = 500) {
  let timer: number
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, delay)
  }
}
