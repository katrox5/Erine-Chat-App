import Setting from './Setting'
import { useEffect, useRef, useState } from 'react'
import { Button, Image } from 'antd'
import { CloseOutlined, MinusOutlined, PushpinOutlined, SettingOutlined } from '@ant-design/icons'

export default function NavBar({ className }) {
  const [isWinOnTop, setWinOnTop] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => window.electronAPI?.setWinOnTop(isWinOnTop), [isWinOnTop])

  return (
    <nav className={`drag flex items-center ${className}`}>
      <Image width={20} className="ml-2" src="https://bce.bdstatic.com/img/favicon.ico" />
      <Button.Group className="ml-auto no-drag">
        <Button icon={<SettingOutlined />} type="link" onClick={showModal} />
        <Button
          icon={<PushpinOutlined />}
          type="text"
          className={isWinOnTop && 'bg-gray-200'}
          onClick={swtchWinOnTop}
        />
        <Button icon={<MinusOutlined />} type="text" onClick={minimizeWin} />
        <Button icon={<CloseOutlined />} type="text" onClick={quitApp} />
      </Button.Group>
      <Setting ref={modalRef} />
    </nav>
  )

  function showModal() {
    modalRef.current.show()
  }

  function swtchWinOnTop() {
    setWinOnTop((i) => !i)
  }

  function minimizeWin() {
    window.electronAPI?.minimizeWin()
  }

  function quitApp() {
    window.electronAPI?.quitApp()
  }
}
