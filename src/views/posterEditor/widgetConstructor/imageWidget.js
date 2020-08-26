import Widget from './widget'
import _merge from 'lodash/merge'
// 图片Widget
export default class ImageWidget extends Widget {
    constructor(config) {
        config = _merge({
            type: 'image',
            typeLabel: '图片',
            componentName: 'image-widget',
            icon: 'el-icon-picture',
            lock: false,
            visible: true
        }, config)
        super(config)
        this.src = config.src
    }
}
