import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Raven from 'raven-js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/element-variables.scss'

import VueAddition from '@/addition'
import PortalVue from 'portal-vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAddition)
Vue.use(PortalVue)

const _ravenConfig = {
  release: 'staging@2.0.0'
}
const raven = Raven.config('http://localhost:3000/xxx', _ravenConfig)
raven.install()
raven.setTransport(function(option) {
  const data = {
    stack: option.data,
    msg: (() => {
      const res = []
      const data = option.data
      data.exception &&
        data.exception.values &&
        data.exception.values.length &&
        res.push(
          `${data.exception.values[0].type}:${data.exception.values[0].value}`
        )
      return res.join(';')
    })()
  }
  console.log(data)
  option.onSuccess()
})
function formatComponentName(vm) {
  if (vm.$root === vm) {
    return 'root instance'
  }
  var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
  )
}

Vue.config.productionTip = false
const _oldOnError = Vue.config.errorHandler
Vue.config.errorHandler = function(error, vm, info) {
  const metaData = {}
  if (Object.prototype.toString.call(vm) === '[object Object]') {
    metaData.componentName = formatComponentName(vm)
    metaData.propsData = vm.$options.propsData
  }

  if (typeof info !== 'undefined') {
    metaData.lifecycleHook = info
  }

  Raven.captureException(error, {
    extra: metaData
  })

  if (typeof _oldOnError === 'function') {
    _oldOnError.call(this, error, vm, info)
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
