# Erine Chat

基于 [Vue3](https://cn.vuejs.org/) + [Vite](https://cn.vitejs.dev/) 构建，用于部署私人的 [ErineChat](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/6ltgkzya5/) 前端应用。

技术：
* 使用 [Vue Router](https://router.vuejs.org/zh/guide/) 作为路由管理
* 使用 [Pinia](https://pinia.vuejs.org/zh/) 作为状态管理
* 使用 [Typescrip](https://www.typescriptlang.org/zh/) 作为开发语言
* 使用 [UnoCSS](https://unocss.dev/) 作为 CSS 框架
* 使用 [Naive](https://www.naiveui.com/zh-CN/) 作为 UI 组件库

工具：
* 使用 `prettier` 格式化代码
* 使用 `unplugin-vue-components` `unplugin-auto-import` 自动引入API组件

## 项目开始
安装依赖：
```sh
npm install
```

### 开发
运行环境：
```sh
npm run dev
```

----

格式化代码：
```sh
npm run fmt
```

### 构建
编译并打包：
```sh
npm run build
```
