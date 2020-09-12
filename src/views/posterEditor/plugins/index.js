import { usePlugin } from './helpers'
export { pluginMap, pluginWrap } from './helpers'

import pluginA from './pluginA'

usePlugin('pluginA', pluginA)

