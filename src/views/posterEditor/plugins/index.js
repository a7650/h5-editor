import { usePlugin } from './helpers'

import pluginA from './pluginA'

usePlugin('pluginA', pluginA)

export { pluginMap, pluginWrap } from './helpers'
