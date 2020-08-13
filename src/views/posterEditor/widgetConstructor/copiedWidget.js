import Widget from './widget'

// 复制Widget
export default class CopiedWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, config,
            {
                typeLabel: config.typeLabel + '-copy',
                isCopied: true
            }
        )
        super(config)
        config.componentState.count = (config.componentState.count || 0) + 1
    }
}
