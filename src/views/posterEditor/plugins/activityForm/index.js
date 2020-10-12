import leftSide from './leftSide'
import widget from './widget'
import PluginA from './constructor'
// import widgetControl from './widgetControl'

export default {
    leftSide: {
        icon: 'el-icon-s-order',
        name: '活动表单',
        component: leftSide
    },
    widget: {
        component: widget,
        constructor: PluginA
    }
    // controlPanel: {
    //     component: widgetControl
    // }
}
