import { useEffect, useRef, useState } from 'react'

export const useTypeWriter = (baseInterval = 100) => {
  const [text, _setText] = useState('')
  const [buffer, setBuffer] = useState('')

  const lastCallTime = useRef(0)
  const interval = useRef(0)
  const callTimes = useRef<number[]>([])
  const disabled = useRef(true)

  const setText = (_text: string) => {
    _setText(_text)
    setBuffer(_text)
  }

  const addText = (_text: string) => {
    disabled.current = false
    _setInterval(buffer.length - text.length + _text.length)
    setBuffer((prev) => prev + _text)
  }

  const flushBuffer = () => {
    interval.current = 200 / buffer.length - text.length
  }

  function _setInterval(textLength: number) {
    if (!lastCallTime.current) {
      lastCallTime.current = performance.now()
      interval.current = baseInterval / textLength
      return
    }

    const currentTime = performance.now()
    const _interval = currentTime - lastCallTime.current
    lastCallTime.current = currentTime

    const averageTime =
      callTimes.current.reduce((acc, cur) => acc + cur, 0) / callTimes.current.length
    callTimes.current.push(_interval)
    if (callTimes.current.length > 10) callTimes.current.shift()

    interval.current = (0.125 * averageTime + (1 - 0.125) * _interval) / textLength
  }

  useEffect(() => {
    if (disabled.current) return
    const timer = setInterval(() => {
      if (buffer.length !== text.length) {
        _setText(buffer.slice(0, text.length + 1))
      } else {
        clearInterval(timer)
        disabled.current = true
      }
    }, interval.current)
    return () => clearInterval(timer)
  }, [text, buffer])

  return { text, setText, addText, flushBuffer }
}

export const scrollAuto = (el: HTMLElement) => {
  let timer: ReturnType<typeof setInterval>

  function startScroll() {
    setTimeout(() => {
      scrollToBottom()
      timer = setInterval(() => {
        if (
          el.scrollTop + el.clientHeight >
          el.scrollHeight - Math.min(200, el.clientHeight * 0.2)
        ) {
          scrollToBottom()
        }
      }, 200)
    }, 200)
  }

  function stopScroll() {
    if (!timer) return
    setTimeout(() => {
      if (
        el.scrollTop + el.clientHeight >
        el.scrollHeight - Math.min(250, el.clientHeight * 0.25)
      ) {
        scrollToBottom()
      }
    }, 250)
    clearInterval(timer)
  }

  function scrollToBottom() {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  return { startScroll, stopScroll, scrollToBottom }
}
