import Widget from './widget'

// 背景Widget
export default class BackgroundWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'background',
            typeLabel: '背景',
            componentName: 'background-widget',
            icon: 'icon-background',
            lock: false,
            visible: true,
            couldAddToActive: false,
            replicable: false
        }, config)
        super(config)
        this.src = config.src
        this.isSolid = !!config.isSolid // 是否是纯色背景
        this.backgroundColor = config.backgroundColor || '#fff'
    }

    static widgetMixin = () => {
        const { created, mounted, methods, computed } = Widget.widgetMixin({ baseMenuList: [] })
        return {
            created,
            mounted,
            methods,
            computed
        }
    }
}
