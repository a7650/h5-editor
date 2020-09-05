import Widget from './widget'

// 复制Widget
export default class CopiedWidget extends Widget {
    constructor(config) {
        const configCopy = Object.assign({}, JSON.parse(JSON.stringify(config)),
            {
                typeLabel: config.typeLabel + '-copy',
                isCopied: true,
                componentState: config.componentState,
                initHook: config.initHook
            }
        )
        super(configCopy)
        configCopy.componentState.count = (configCopy.componentState.count || 0) + 1
        this._codeGen = configCopy._codeGen
        console.log(this._codeGen)
    }
}
