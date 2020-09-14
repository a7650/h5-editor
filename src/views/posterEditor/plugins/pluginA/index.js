import leftSide from './leftSide'
import widget from './widget'
import PluginA from './constructor'
import widgetControl from './widgetControl'
import bottomBar from './bottomBar'
import extendSideBar from './extendSideBar'

export default {
    leftSide: {
        icon: 'el-icon-star-off',
        name: 'test132',
        component: leftSide
    },
    widget: {
        component: widget,
        constructor: PluginA
    },
    controlPanel: {
        component: widgetControl
    },
    bottomBar: {
        component: bottomBar
    },
    extendSideBar: {
        icon: 'el-icon-star-off',
        name: '插件测试',
        component: extendSideBar
    }
}
