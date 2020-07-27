import directives from './directives/index'
import prototype from './prototype'
export default {
    install(Vue) {
        prototype(Vue)

        Object.keys(directives).forEach(key => {
            Vue.directive(key, directives[key])
        })
    }
}
