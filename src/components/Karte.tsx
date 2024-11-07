import 'highlight.js/styles/github-dark-dimmed.css'

import { useMessages, useContentsDispatch } from '../contexts/content'
import { useOptions } from '../contexts/option'
import { useStatusSet } from '../App'
import { useEffect, useRef, useState } from 'react'
import { Button, Card, Divider, Skeleton, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { useTypeWriter } from '../utils/chat'

type Props = {
  prompt: string
  index: number
  answer?: string
}

export default function Karte({ prompt, index, answer }: Props) {
  const messages = useMessages()
  const contentsDispatch = useContentsDispatch()
  const options = useOptions()
  const setStatus = useStatusSet()
  const id = useRef(-1)
  const { text: output, setText: setOutput, addText: addOutput, flushBuffer } = useTypeWriter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    id.current = index
    if (answer) {
      setOutput(answer)
      setLoading(false)
      return
    }
    sendPrompt()
  }, [])

  return (
    <Card hoverable className="cursor-auto mx-4 my-1">
      <div className="text-[15px] pr-2">{prompt}</div>
      {!loading && (
        <Button
          shape="circle"
          className="absolute right-1 top-1 w-8 h-8"
          icon={<ReloadOutlined />}
          onClick={resendPrompt}
        />
      )}
      <Divider />
      {output === '' ? (
        <Skeleton paragraph={{ rows: 2 }} active />
      ) : (
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          className="prose prose-zinc max-w-none dark:prose-invert"
        >
          {output}
        </ReactMarkdown>
      )}
    </Card>
  )

  function sendPrompt(resend?: 2) {
    const temperature = options.temperature / 100
    const penalty_score = (options.penaltyScore + 100) / 100
    const access_token = options.accessToken
    const prompt = messages.slice(0, 2 * id.current + 1)

    setLoading(true)
    setStatus?.(resend ?? 1)

    fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=${access_token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature,
          penalty_score,
          messages: prompt,
          stream: true,
        }),
      },
    )
      .then(async (resp) => {
        if (!resp.body || resp.status !== 200) {
          throw new Error()
        }
        const reader = resp.body.pipeThrough(new TextDecoderStream()).getReader()
        if (!reader) return

        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            flushBuffer()
            contentsDispatch?.({
              type: 'setAnswer',
              answer: buffer,
              index: id.current,
            })
            break
          }
          if (value) {
            for (const data of parseData(value)) {
              const result = JSON.parse(data)?.result
              buffer += result
              addOutput(result)
            }
          }
        }
      })
      .catch(() => {
        message.error('请求异常')
        setOutput('请重试')
      })
      .finally(() => {
        setLoading(false)
        setStatus?.(0)
      })
  }

  function resendPrompt() {
    setLoading(true)
    message.loading('重新生成回答...')
    setOutput('')
    sendPrompt(2)
  }

  function parseData(value: string) {
    const regex = /data:\s*(\{.*?\})\s*(?=data:|$)/gs
    const matches = []

    let match
    while ((match = regex.exec(value)) !== null) {
      matches.push(match[1])
    }
    return matches
  }
}
