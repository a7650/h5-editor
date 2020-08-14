const requireComponent = require.context('./widgets', true, /[a-zA-Z]\w+Widget\.(vue)$/)
const allWidgets = {}
requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const _fileName = fileName.match(/\.\/(\S*).vue/)[1]
    // 全局注册组件
    allWidgets[_fileName] = componentConfig.default || componentConfig
})
export default allWidgets
