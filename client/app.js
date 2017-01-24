import Vue from 'vue'
import Vuex from 'vuex'

import 'mdui/dist/css/mdui.css'

import components from './components/' // 加载公共组件
import App from './components/App'

Vue.use(Vuex)

Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase()) // 首字母大写
  Vue.component(`v${name}`, components[key])
})

const app = new Vue({ ...App })

window.addEventListener('popstate', (e) => {
  app.currentRoute = decodeURI(window.location.pathname)
})

export default app

