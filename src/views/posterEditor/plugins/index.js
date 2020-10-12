import { usePlugin } from './helpers'
export { pluginMap, pluginWrap, pluginConstructorMap } from './helpers'

// import pluginA from './pluginA'
import pageTemplate from './pageTemplate'
import activityForm from './activityForm'

// usePlugin('pluginA', pluginA)
usePlugin('activityForm', activityForm)
usePlugin('pageTemplate', pageTemplate)

