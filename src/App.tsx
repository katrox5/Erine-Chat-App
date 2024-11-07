import './App.css'

import NavBar from './components/NavBar'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
import ContentProvider from './contexts/content'
import OptionProvider from './contexts/option'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { scrollAuto } from './utils/chat'

type Status = 0 | 1 | 2

const StatusContext = createContext<Status>(0)
const StatusSetContext = createContext<React.Dispatch<React.SetStateAction<Status>> | null>(null)

export function useStatus() {
  return useContext(StatusContext)
}

export function useStatusSet() {
  return useContext(StatusSetContext)
}

export default function App() {
  const [status, setStatus] = useState<Status>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoScroll = useRef<{
    startScroll: Function | null
    stopScroll: Function | null
  }>({ startScroll: null, stopScroll: null })

  useEffect(() => {
    if (containerRef.current) {
      autoScroll.current = scrollAuto(containerRef.current)
    }
  }, [])

  useEffect(() => {
    switch (status) {
      case 0:
        autoScroll.current.stopScroll?.()
        break
      case 1:
        autoScroll.current.startScroll?.()
        break
    }
  }, [status])

  return (
    <div className="h-screen w-screen">
      <OptionProvider>
        <NavBar className="w-full bg-gray-100 absolute z-50" />
        <div className="h-full pt-12 pb-6 flex flex-col">
          <ContentProvider>
            <StatusContext.Provider value={status}>
              <StatusSetContext.Provider value={setStatus}>
                <Header />
                <div ref={containerRef} className="flex-1 overflow-y-scroll scrollbar">
                  <Content />
                </div>
                <Footer />
              </StatusSetContext.Provider>
            </StatusContext.Provider>
          </ContentProvider>
        </div>
      </OptionProvider>
    </div>
  )
}
