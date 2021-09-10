import { Widget } from 'poster/widgetConstructor'
import _merge from 'lodash/merge'

// 组件要继承Widget类
export default class PluginA extends Widget {
  constructor(config) {
    // 支持的配置项参考widget.js中的defaultWidgetConfig
    config = _merge(
      {
        type: 'pluginA',
        typeLabel: '插件测试',
        componentName: 'plugin-pluginA', // 插件的componentName必须以plugin开头
        icon: 'el-icon-star-off',
        replicable: false,
        wState: {
          buttonCount: 3
        }
      },
      config
    )
    super(config)
  }
}
