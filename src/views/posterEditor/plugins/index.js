import { usePlugin } from './helpers'
export { pluginMap, pluginWrap, pluginConstructorMap } from './helpers'

import pluginA from './pluginA'

// 每一个作为插件的组件的实例上都会加上$pluginHelpers属性，有一些常用的方法，参考pluginHelpers.js
usePlugin('pluginA', pluginA)
