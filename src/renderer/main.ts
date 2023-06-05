import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/table-column/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/descriptions/style/css'
import 'element-plus/es/components/descriptions-item/style/css'
import 'element-plus/es/components/descriptions/style/css'
import 'element-plus/es/components/descriptions-item/style/css'
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/progress/style/css'
import 'element-plus/es/components/pagination/style/css'
import './styles/index.scss'
import './styles/recover.scss'
import './assets/click.js'

import './permission'
import App from './App.vue'
import router from './router'
import { errorHandler } from './error'
import { i18n } from "./i18n"
import TitleBar from "./components/common/TitleBar.vue"

const app = createApp(App)
const store = createPinia()
app.use({ i18n: i18n.global.d})
app.use(router)
app.use(store)
app.use(i18n)
errorHandler(app)

// 全局引入 TitleBar 组件
app.component("TitleBar", TitleBar);

app.mount("#app")

