import Widget from './widget'

// 文本Widget
export default class TextWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'text',
            typeLabel: '文本',
            componentName: 'text-widget',
            icon: 'icon-text',
            lock: false,
            visible: true,
            text: '双击编辑文本'
        }, config)
        super(config)
        this.text = config.text
    }
}
