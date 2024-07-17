import Karte from './Karte'
import Footer from './Footer'
import TokenGetter from './TokenGetter'
import { useContents } from '../contexts/content'
import { useOptions } from '../contexts/option'
import { useRef } from 'react'
import { Button, Tag } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function Content() {
  const contents = useContents()
  const options = useOptions()
  const modalRef = useRef(null)

  return (
    <>
      {!options.accessToken && (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          <span>尚未设置鉴权</span>
          <Button type="link" size="small" onClick={showModal}>
            前往获取
          </Button>
        </Tag>
      )}
      {contents.map(({ prompt, answer }, index) => (
        <Karte key={index + prompt} prompt={prompt} index={index} answer={answer} />
      ))}
      <Footer className="mt-4" />
      <TokenGetter ref={modalRef} />
    </>
  )

  function showModal() {
    modalRef.current.show()
  }
}
