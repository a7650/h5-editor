import Widget from './widget'

// 复制Widget
export default class CopiedWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, JSON.parse(JSON.stringify(config)),
            {
                typeLabel: config.typeLabel + '-copy',
                isCopied: true,
                componentState: config.componentState,
                initHook: config.initHook
            }
        )
        super(config)
        config.componentState.count = (config.componentState.count || 0) + 1
    }
}
