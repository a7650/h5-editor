import leftSide from './leftSide'
import widget from './widget'
import PluginA from './constructor'
import controlPanel from './controlPanel'
import bottomBar from './bottomBar'
import extendSideBar from './extendSideBar'

export default {
  // 左边栏
  leftSide: {
    icon: 'el-icon-star-off', // 左边栏显示的图标
    name: '插件测试', // 鼠标悬浮时显示的名称
    component: leftSide
  },
  // 画布上的组件
  widget: {
    component: widget,
    constructor: PluginA // 组件构造函数
  },
  // 组件控制面板（页面最右侧编辑区域）
  controlPanel: {
    component: controlPanel
  },
  // 底部工具栏
  bottomBar: {
    component: bottomBar
  },
  // 右侧工具栏
  extendSideBar: {
    icon: 'el-icon-star-off', // 显示的图标
    name: '插件测试', // 鼠标悬浮时显示的名称
    component: extendSideBar
  }
}
