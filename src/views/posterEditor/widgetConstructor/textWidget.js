import Widget from './widget'
import _merge from 'lodash/merge'
import { createHtmlStr } from 'poster/utils'

function codeGen(config) {
    return createHtmlStr({
        tag: 'div',
        style: {
            ...Widget.getPositionStyle(config.dragInfo)
        },
        children: [
            {
                tag: 'div',
                text: config.wState.text,
                style: {
                    ...config.wState.style
                }
            }
        ]
    })
}

// 文本Widget
export default class TextWidget extends Widget {
    constructor(config) {
        config = _merge({
            type: 'text',
            typeLabel: '文本',
            componentName: 'text-widget',
            icon: 'icon-text',
            lock: false,
            visible: true,
            wState: {
                text: '双击编辑文本',
                style: {
                    margin: '10px',
                    wordBreak: 'break-all',
                    color: '#000',
                    textAlign: 'center',
                    fontSize: '14px', // px
                    padding: 0, // px
                    borderColor: '#000',
                    borderWidth: 0, // px
                    borderStyle: 'solid',
                    lineHeight: '100%', // %
                    letterSpacing: 0, // %
                    backgroundColor: '',
                    fontWeight: '',
                    fontStyle: '',
                    textDecoration: ''
                }
            }
        }, config)
        super(config)
        this._codeGen = codeGen
    }
}
