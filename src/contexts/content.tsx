import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

export type Content = {
  prompt: string
  answer?: string
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type ContentAction =
  | { type: 'addPrompt'; prompt: string }
  | { type: 'setAnswer'; answer: string; index: number }
  | { type: 'clearContents' }

const ContentContext = createContext<Content[]>([])
const MessageContext = createContext<Message[]>([])
const ContentDispatchContext = createContext<any>(null)

export default function ContentProvider({ children }: { children: React.ReactElement }) {
  const [contents, contentsDispatch] = useReducer(contentReducer, loadContents())

  const messages = useMemo(
    () =>
      contents.reduce((result, content) => {
        result.push({
          role: 'user',
          content: content.prompt,
        })
        if (content.answer) {
          result.push({
            role: 'assistant',
            content: content.answer,
          })
        }
        return result
      }, [] as Message[]),
    [contents],
  )

  useEffect(() => localStorage.setItem('messages', JSON.stringify(messages)), [messages])

  return (
    <ContentContext.Provider value={contents}>
      <MessageContext.Provider value={messages}>
        <ContentDispatchContext.Provider value={contentsDispatch}>
          {children}
        </ContentDispatchContext.Provider>
      </MessageContext.Provider>
    </ContentContext.Provider>
  )

  function contentReducer(contents: Content[], action: ContentAction): Content[] {
    switch (action.type) {
      case 'addPrompt': {
        const index = contents.length - 1
        if (!contents[index]?.answer) {
          return [...contents.slice(0, index), { prompt: action.prompt }]
        }
        return [...contents, { prompt: action.prompt }]
      }
      case 'setAnswer': {
        return contents.map((content, index) => {
          if (index === action.index) {
            return { ...content, answer: action.answer }
          }
          return content
        })
      }
      case 'clearContents': {
        return []
      }
    }
  }

  function loadContents() {
    const messages = JSON.parse(localStorage.getItem('messages') ?? '[]')
    const contents: Content[] = []
    for (let i = 0; i < messages.length; i += 2) {
      const prompt = messages[i]
      const answer = messages[i + 1]
      if (
        prompt['role'] !== 'user' ||
        !prompt['content'] ||
        answer?.['role'] !== 'assistant' ||
        !answer['content']
      ) {
        continue
      }
      contents.push({
        prompt: prompt['content'],
        answer: answer['content'],
      })
    }
    return contents
  }
}

export function useContents() {
  return useContext(ContentContext)
}

export function useMessages() {
  return useContext(MessageContext)
}

export function useContentsDispatch() {
  return useContext(ContentDispatchContext)
}
