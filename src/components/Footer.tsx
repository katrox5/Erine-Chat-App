import { useContentsDispatch } from '../contexts/content'
import { useGenerating } from '../App'
import { KeyboardEvent, useState } from 'react'
import { Button, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { SendOutlined } from '@ant-design/icons'

export default function Footer({ className }: { className: string }) {
  const contentsDispatch = useContentsDispatch()
  const generating = useGenerating()
  const [prompt, setPrompt] = useState('')

  const enter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      generate()
    }
  }

  function generate() {
    if (generating) {
      message.warning('生成中请稍后再试')
      return
    }
    if (prompt.trim() === '') {
      message.warning('问题不能为空')
      return
    }
    contentsDispatch({
      type: 'addPrompt',
      prompt: prompt.trim(),
    })
    setPrompt('')
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TextArea
        size="large"
        value={prompt}
        onKeyDown={(e) => enter(e)}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="请输入问题"
        autoSize={{ maxRows: 5 }}
      />
      <Button icon={<SendOutlined />} size="large" disabled={generating} onClick={generate} />
    </div>
  )
}
