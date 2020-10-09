import { usePlugin } from './helpers'
export { pluginMap, pluginWrap, pluginConstructorMap } from './helpers'

import pluginA from './pluginA'
import pageTemplate from './pageTemplate'

// usePlugin('pluginA', pluginA)
usePlugin('pageTemplate', pageTemplate)

