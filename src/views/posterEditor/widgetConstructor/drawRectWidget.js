import Widget from './widget'

// 绘制矩形（矩形前置组件）
export default class DrawRectWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'rect',
            typeLabel: '矩形',
            componentName: 'draw-rect-widget',
            icon: 'icon-rect',
            lock: false,
            visible: true,
            layerPanelVisible: false,
            replicable: false,
            couldAddToActive: false
        }, config)
        super(config)
        this.drawing = true
    }
}
