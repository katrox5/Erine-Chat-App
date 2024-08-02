import debounce from '../utils/debounce'
import { Options, useOptions, useOptionsDispatch } from '../contexts/option'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Form, Modal, Slider } from 'antd'

const Setting = forwardRef((_, ref) => {
  const options = useOptions()
  const optionsDispatch = useOptionsDispatch()
  const [modalVisible, setModalVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      setModalVisible(true)
    },
  }))

  const formatter = (value: number = 0) => (value / 100).toFixed(2)

  return (
    <Modal
      title="设置"
      footer={null}
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      styles={{ body: { paddingTop: 15 } }}
    >
      <Form
        name="options"
        initialValues={options}
        onValuesChange={(val) => debounce(setValue)(val)}
        colon={false}
      >
        <Form.Item<Options>
          label="生成温度"
          name="temperature"
          tooltip={
            <>
              <div>说明：</div>
              <div>（1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定。</div>
              <div>（2）默认0.70，范围 (0, 1.0]</div>
            </>
          }
        >
          <Slider min={10} step={5} tooltip={{ formatter }} />
        </Form.Item>
        <Form.Item<Options>
          label="重复惩罚"
          name="penaltyScore"
          tooltip={
            <>
              <div>对已生成的token增加惩罚，减少重复生成的现象。</div>
              <div>说明：</div>
              <div>（1）值越大表示惩罚越大</div>
              <div>（2）默认1.0，取值范围：[1.0, 2.0]</div>
            </>
          }
        >
          <Slider step={5} tooltip={{ formatter: (val = 0) => formatter(val + 100) }} />
        </Form.Item>
        <Form.Item>
          <Button onClick={clearAuth}>清除鉴权凭据</Button>
        </Form.Item>
      </Form>
    </Modal>
  )

  function clearAuth() {
    setValue({ accessToken: '' })
    setModalVisible(false)
  }

  function setValue(obj: any) {
    for (const key in obj) {
      optionsDispatch({
        type: key,
        value: obj[key],
      })
    }
  }
})

export default Setting
