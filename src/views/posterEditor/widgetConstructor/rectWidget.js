import Widget from './widget'

// 矩形Widget
export default class RectWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'rect',
            typeLabel: '矩形',
            componentName: 'rect-widget',
            icon: 'icon-rect',
            lock: false,
            visible: true
        }, config)
        super(config)
    }
}
