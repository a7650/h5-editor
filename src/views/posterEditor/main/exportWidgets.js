import { pluginMap, pluginWrap } from '../plugins'

const requireComponent = require.context('./widgets', true, /[a-zA-Z]\w+Widget\.(vue)$/)
const allWidgets = {}
requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const _fileName = fileName.match(/\.\/(\S*).vue/)[1]
    allWidgets[_fileName] = componentConfig.default || componentConfig
})

const pluginComponents = {}
Object.values(pluginMap.widget).forEach(options => {
    const { component, componentName } = options
    pluginComponents[componentName] = pluginWrap(component)
})
export default { ...allWidgets, ...pluginComponents }
