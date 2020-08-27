import Widget from './widget'
import _merge from 'lodash/merge'

// 背景Widget
export default class BackgroundWidget extends Widget {
  constructor(config) {
    config = _merge({
      type: 'background',
      typeLabel: '背景',
      componentName: 'background-widget',
      icon: 'icon-background',
      lock: false,
      visible: true,
      couldAddToActive: false,
      replicable: false,
      wState: {
        isSolid: true,
        src: '',
        style: {
          backgroundColor: '#fff'
        }
      }
    }, config)
    super(config)
  }

  static widgetMixin = () => {
    const { created, mounted, methods, computed } = Widget.widgetMixin({ baseMenuList: [] })
    return {
      created,
      mounted,
      methods,
      computed
    }
  }
}
