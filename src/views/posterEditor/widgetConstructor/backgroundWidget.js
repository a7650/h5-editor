import Widget from './widget'
import _merge from 'lodash/merge'
import { createHtmlStr } from 'poster/utils'

function codeGen(config) {
  const node = {
    style: {
      ...config.wState.style,
      ...Widget.getPositionStyle(config.dragInfo)
    }
  }
  if (config.wState.isSolid) {
    node.tag = 'div'
    node.style.backgroundColor = config.wState.style.backgroundColor
  } else {
    node.tag = 'image'
    node.attrs = { src: config.wState.src }
  }
  return createHtmlStr(node)
}
// 背景Widget
export default class BackgroundWidget extends Widget {
  constructor(config) {
    config = _merge({
      type: 'background',
      typeLabel: '背景',
      componentName: 'background-widget',
      icon: 'icon-background',
      lock: true,
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
    this._codeGen = codeGen
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
