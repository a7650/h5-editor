import Widget from './widget'
import _merge from 'lodash/merge'
import { createHtmlStr } from '@/utils/posterUtils'

function codeGen(config) {
    return createHtmlStr({
        tag: 'image',
        attrs: {
            src: config.wState.src
        },
        style: {
            ...Widget.getPositionStyle(config.dragInfo)
        }
    })
}

// 图片Widget
export default class ImageWidget extends Widget {
    constructor(config) {
        config = _merge({
            type: 'image',
            typeLabel: '图片',
            componentName: 'image-widget',
            icon: 'el-icon-picture',
            lock: false,
            visible: true,
            wState: {
                src: ''
            }
        }, config)
        super(config)
        this._codeGen = codeGen
    }
}
