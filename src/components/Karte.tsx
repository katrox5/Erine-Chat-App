import 'highlight.js/styles/github-dark-dimmed.css'

import { throttleWithLastCall } from '../utils/throttle'
import { useMessages, useContentsDispatch } from '../contexts/content'
import { useOptions } from '../contexts/option'
import { useGeneratingDispatch } from '../App'
import { useEffect, useRef, useState } from 'react'
import { Button, Card, Divider, Skeleton, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

type props = {
  prompt: string
  index: number
  answer?: string
}

export default function Karte({ prompt, index, answer }: props) {
  const messages = useMessages()
  const contentsDispatch = useContentsDispatch()
  const options = useOptions()
  const generatingDispatch = useGeneratingDispatch()
  const id = useRef(-1)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    id.current = index
    if (answer) {
      setOutput(answer)
      setLoading(false)
      return
    }
    generate()
  }, [])

  return (
    <Card hoverable className="cursor-auto">
      <div className="text-[15px] pr-2">{prompt}</div>
      {!loading && (
        <Button
          shape="circle"
          className="absolute right-1 top-1 w-8 h-8"
          icon={<ReloadOutlined />}
          onClick={regenerate}
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

  function generate() {
    const temperature = options.temperature / 100
    const penalty_score = (options.penaltyScore + 100) / 100
    const access_token = options.accessToken
    const prompt = messages.slice(0, 2 * id.current + 1)

    setLoading(true)
    generatingDispatch(true)

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
        const reader = resp.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            contentsDispatch({
              type: 'setAnswer',
              answer: buffer,
              index: id.current,
            })
            break
          }
          const chunkText = decoder.decode(value)
          const data = chunkText.split('data: ')[1]
          buffer += JSON.parse(data)?.result
          throttleWithLastCall(setOutput)(buffer)
        }
      })
      .catch((_) => {
        message.error('请求异常')
        setOutput('请重试')
      })
      .finally(() => {
        setLoading(false)
        generatingDispatch(false)
      })
  }

  function regenerate() {
    setLoading(true)
    message.loading('重新生成回答...')
    setOutput('')
    generate()
  }
}
