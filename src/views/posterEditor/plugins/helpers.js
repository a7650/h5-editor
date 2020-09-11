import { HoC } from '@/utils/posterUtils'
import store from '@/store'

export const pluginMap = {
    leftSide: {},
    bottomBar: {},
    controlPanel: {},
    extendSideBar: {},
    widget: {}
}

export function usePlugin(name, options) {
    if (options._registered) {
        return
    }
    options._registered = true
    const { leftSide, bottomBar, controlPanel, extendSideBar, widget } = options
    if (leftSide) {
        pluginMap.leftSide[name] = leftSide
    }
    if (leftSide) {
        pluginMap.bottomBar[name] = bottomBar
    }
    if (leftSide) {
        pluginMap.controlPanel[name] = controlPanel
    }
    if (leftSide) {
        pluginMap.extendSideBar[name] = extendSideBar
    }
    if (leftSide) {
        pluginMap.widget[name] = widget
    }
}

const pluginHelpers = {
    addWidget(widget) {
        store.dispatch('poster/addItem', widget)
    }
}

export function pluginWrap(component) {
    return HoC(component, {
        props: {
            pluginHelpers
        }
    })
}

