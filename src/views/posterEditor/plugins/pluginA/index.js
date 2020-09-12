import leftSide from './leftSide'
import widget from './widget'
import PluginA from './constructor'
import widgetControl from './widgetControl'

export default {
    leftSide: {
        icon: 'el-icon-star-off', // 图标
        name: 'test132', // 名称
        component: leftSide // 组件
    },
    widget: {
        component: widget,
        constructor: PluginA
    },
    controlPanel: {
        component: widgetControl
    }
}
