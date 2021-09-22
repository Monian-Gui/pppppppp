import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.scss'
// import '@/assets/iconfont/iconfont.css'

//引入ElementUI
import ElementUI from 'element-ui'
Vue.use(ElementUI)

//注册全局组件
import Components from './components'
Vue.use(Components)

import '@/permission' // permission control

import http from '@/utils/request'
Vue.prototype.http = http
import base from '@/api/ndApi/base'
Vue.prototype.url = base.url_cl

//引入echarts
import '@/plugins/echarts'
import '@/plugins/dataV'
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
