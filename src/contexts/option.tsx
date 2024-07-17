import { createContext, useContext, useEffect, useReducer } from 'react'

export type Options = {
  temperature: number
  penaltyScore: number
  accessToken: string
}

export type OptionAction =
  | {
      type: 'temperature' | 'penaltyScore'
      value: number
    }
  | {
      type: 'accessToken'
      value: string
    }

const defaultOptions: Options = {
  temperature: 70,
  penaltyScore: 0,
  accessToken: '',
}

const OptionContext = createContext<Options>(defaultOptions)
const OptionDispatchContext = createContext<any>(null)

export default function OptionProvider({ children }: { children: React.ReactElement[] }) {
  const [options, optionsDispatch] = useReducer(optionReducer, loadOptions())

  useEffect(() => {
    localStorage.setItem('options', JSON.stringify(options))
    // @ts-ignore
    window.electronAPI?.setItem('access_token', options.accessToken)
  }, [options])

  return (
    <OptionContext.Provider value={options}>
      <OptionDispatchContext.Provider value={optionsDispatch}>
        {children}
      </OptionDispatchContext.Provider>
    </OptionContext.Provider>
  )

  function optionReducer(options: Options, action: OptionAction) {
    switch (action.type) {
      case 'temperature': {
        return {
          ...options,
          temperature: action.value,
        }
      }
      case 'penaltyScore': {
        return {
          ...options,
          penaltyScore: action.value,
        }
      }
      case 'accessToken': {
        return {
          ...options,
          accessToken: action.value,
        }
      }
    }
  }

  function loadOptions(): Options {
    return {
      ...JSON.parse(localStorage.getItem('options') ?? JSON.stringify(defaultOptions)),
      // @ts-ignore
      accessToken: window.electronAPI?.getItem('access_token') ?? '',
    }
  }
}

export function useOptions() {
  return useContext(OptionContext)
}

export function useOptionsDispatch() {
  return useContext(OptionDispatchContext)
}
