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
            wState: {
                text: '双击编辑文本',
                style: {
                    color: '#000',
                    textAlign: 'center',
                    fontSize: 14, // px
                    padding: 0, // px
                    borderColor: '#000',
                    borderWidth: 0, // px
                    borderStyle: 'solid',
                    lineHeight: 100, // %
                    letterSpacing: 0, // %
                    backgroundColor: '',
                    fontWeight: '',
                    fontStyle: '',
                    textDecoration: ''
                }
            }
        }, config)
        super(config)
    }
}
