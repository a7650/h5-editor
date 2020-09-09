import Widget from './widget'
import _merge from 'lodash/merge'
import { createHtmlStr } from '@/utils/posterUtils'

function codeGen(config) {
    const style = config.wState.style
    console.log(config.dragInfo)
    console.log(Widget.getPositionStyle(config.dragInfo))
    return createHtmlStr({
        tag: 'div',
        style: {
            ...Object.assign({}, style, {
                borderWidth: style.borderWidth + 'px',
                borderTopLeftRadius: style.borderTopLeftRadius + '%',
                borderTopRightRadius: style.borderTopRightRadius + '%',
                borderBottomLeftRadius: style.borderBottomLeftRadius + '%',
                borderBottomRightRadius: style.borderBottomRightRadius + '%'
            }),
            ...Widget.getPositionStyle(config.dragInfo)
        }
    })
}

// 矩形Widget
export default class RectWidget extends Widget {
    constructor(config) {
        config = _merge({
            type: 'rect',
            typeLabel: '矩形',
            componentName: 'rect-widget',
            icon: 'icon-rect',
            lock: false,
            visible: true,
            wState: {
                style: {
                    borderColor: '#000',
                    borderWidth: 0, // px
                    borderStyle: 'solid',
                    backgroundColor: '#2d51cc',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }
            }
        }, config)
        super(config)
        this._codeGen = codeGen
    }
}
