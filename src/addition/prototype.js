
import moment from '@/utils/momentConfig'
import storage from '@/utils/storage'
import cssVariables from '@/styles/variables.scss'

// const debug = process.env.NODE_ENV !== 'production'

export default function(Vue) {
    Vue.prototype.$moment = moment

    Vue.prototype.$setLocal = storage.setLocal

    Vue.prototype.$getLocal = storage.getLocal

    Vue.prototype.$removeLocal = storage.removeLocal

    Vue.prototype.$setSession = storage.setSession

    Vue.prototype.$getSession = storage.getSession

    Vue.prototype.$removeSession = storage.removeSession

    // css变量
    Vue.prototype.$css = cssVariables

    /**
     * 只能复制能被JSON化的数据，如接口返回的数据
     * @param {Object|Array} data
     */
    Vue.prototype.$deepCopy = (data) => {
        if (data) {
            return JSON.parse(JSON.stringify(data))
        } else {
            return {}
        }
    }

    Vue.prototype.$ENV = process.env.NODE_ENV
}
