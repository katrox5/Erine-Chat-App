import { useOptionsDispatch } from '../contexts/option'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Form, FormProps, Input, Modal, message } from 'antd'

type AppAuth = {
  ApiKey: string
  SecretKey: string
}

const TokenGetter = forwardRef((_, ref) => {
  const optionsDispatch = useOptionsDispatch()
  const [modalVisible, setModalVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      setModalVisible(true)
    },
  }))

  const getToken: FormProps<AppAuth>['onFinish'] = (values) => {
    fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${values.ApiKey}&client_secret=${values.SecretKey}`,
      {
        method: 'POST',
      },
    )
      .then(async (resp) => {
        const data = await resp.json()
        optionsDispatch({
          type: 'accessToken',
          value: data.access_token,
        })
        setModalVisible(false)
        message.success('设置成功')
      })
      .catch((_) => {
        message.error('获取失败！请检查参数')
      })
  }

  return (
    <Modal
      title={
        <Button type="link" size="large" onClick={openLink}>
          ① 前往获取鉴权参数
        </Button>
      }
      footer={null}
      open={modalVisible}
      styles={{ body: { paddingTop: 10 } }}
      onCancel={() => setModalVisible(false)}
    >
      <Form
        name="basic"
        requiredMark={false}
        onFinish={getToken}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item<AppAuth>
          label="API Key"
          name="ApiKey"
          rules={[{ required: true, message: '请输入 App 的 API Key' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<AppAuth>
          label="Secret Key"
          name="SecretKey"
          rules={[{ required: true, message: '请输入 App 的 Secret Key' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            ② 获取 Access Token
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )

  function openLink() {
    // @ts-ignore
    window.electronAPI?.openLink(
      'https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application',
    )
  }
})

export default TokenGetter
