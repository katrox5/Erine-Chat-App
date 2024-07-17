import './App.css'

import NavBar from './components/NavBar'
import Header from './components/Header'
import Content from './components/Content'
import ContentProvider from './contexts/content'
import OptionProvider from './contexts/option'
import { createContext, useContext, useState } from 'react'

const GeneratingContext = createContext(false)
const GeneratingDispatchContext = createContext<any>(null)

export function useGenerating() {
  return useContext(GeneratingContext)
}

export function useGeneratingDispatch() {
  return useContext(GeneratingDispatchContext)
}

export default function App() {
  const [generating, generatingDispatch] = useState(false)

  return (
    <div className="w-full">
      <OptionProvider>
        <NavBar className="bg-gray-100 sticky top-0 z-50" />
        <div className="px-4 py-6">
          <ContentProvider>
            <GeneratingContext.Provider value={generating}>
              <GeneratingDispatchContext.Provider value={generatingDispatch}>
                <Header className="mb-4" />
                <Content />
              </GeneratingDispatchContext.Provider>
            </GeneratingContext.Provider>
          </ContentProvider>
        </div>
      </OptionProvider>
    </div>
  )
}
