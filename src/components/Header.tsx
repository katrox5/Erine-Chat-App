import { useContentsDispatch } from '../contexts/content'
import { Avatar, Button, Popconfirm } from 'antd'
import { ClearOutlined } from '@ant-design/icons'

export default function Header({ className }: { className: string }) {
  const contentsDispatch = useContentsDispatch()

  function clearContents() {
    contentsDispatch({ type: 'clearContents' })
  }

  return (
    <header className={`w-full ${className}`}>
      <div className="flex items-center">
        <Avatar
          shape="square"
          size={64}
          src="https://img.picgo.net/2024/07/12/avatar364a427fd16ed66f.jpg"
        />
        <Popconfirm
          placement="left"
          title="该操作将清除所有对话"
          okText="确认"
          cancelText="取消"
          onConfirm={clearContents}
        >
          <Button className="ml-auto" type="link" size="large" icon={<ClearOutlined />} />
        </Popconfirm>
      </div>
      <div className="flex text-2xl font-bold text-transparent">
        <div className="bg-gradient-to-r bg-clip-text from-[#8270ff] to-[#59b8ed]">
          Erine-Speed-128K
        </div>
      </div>
    </header>
  )
}
