// import { HoC } from 'poster/utils'
import { pluginHelpers } from './pluginHelpers'

export const pluginMap = {
  leftSide: {},
  widget: {},
  controlPanel: {},
  bottomBar: {},
  extendSideBar: {}
}

export const hooks = []

export function registerHook(fn) {
  hooks.push(fn)
}

export const pluginConstructorMap = {}

export function usePlugin(name, options) {
  if (options._registered) {
    return
  }
  options._registered = true
  const { leftSide, bottomBar, controlPanel, extendSideBar, widget } = options
  if (leftSide) {
    pluginMap.leftSide[name] = leftSide
  }
  if (bottomBar) {
    pluginMap.bottomBar[name] = bottomBar
  }
  if (controlPanel) {
    pluginMap.controlPanel[name] = controlPanel
  }
  if (extendSideBar) {
    pluginMap.extendSideBar[name] = extendSideBar
  }
  if (widget) {
    const { component, constructor } = widget
    const { componentName, type } = new constructor()
    if (componentName.indexOf('plugin-') !== 0) {
      return
    }
    pluginMap.widget[name] = {
      constructor,
      component: enhanceWidgetComponent(
        component,
        constructor,
        controlPanel && controlPanel.component
      ),
      componentName
    }
    pluginConstructorMap[type] = widget.constructor
    //
  }
}

function enhanceWidgetComponent(component, constructor, controlPanel) {
  enhanceMixins(component, [
    constructor.widgetMixin(),
    {
      components: {
        controlPanel: controlPanel ? pluginWrap(controlPanel) : null,
        controlPanelPortal: {
          render(h) {
            if (this.$parent.isActive) {
              return h(
                'portal',
                {
                  attrs: {
                    to: this.$parent.$data.$controlTarget
                  }
                },
                this.$slots.default
              )
            } else {
              return null
            }
          }
        }
      }
    }
  ])
  return component
}

function enhanceMixins(component, mixins) {
  if (!component.mixins) {
    component.mixins = []
  }
  component.mixins.push(...mixins)
}

export function pluginWrap(component) {
  enhanceMixins(component, [
    {
      beforeCreate() {
        this.$pluginHelpers = pluginHelpers
      }
    }
  ])
  return component
}

export { commonMixin as controlMixin } from '../control/widgets/common/mixins'
