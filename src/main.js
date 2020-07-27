import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/element-variables.scss'

import VueAddition from '@/addition'
import PortalVue from 'portal-vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAddition)
Vue.use(PortalVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
