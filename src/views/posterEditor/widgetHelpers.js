import uniqueId from 'lodash/uniqueId'

const defaultWidgetConfig = {
    type: '', // 类型
    typeLabel: '', // 类型标签
    componentName: '', // 动态component的name
    icon: '', // 图标class
    rename: '', // typeLabel重命名
    lock: false, // 是否处于锁定状态
    visible: true, // 是否可见
    id: ''
}

// 组件父类
export class Widget {
    constructor(config = defaultWidgetConfig) {
        const item = Object.assign({}, defaultWidgetConfig, config, {
            id: uniqueId(config.typeLabel)
        })
        this._config = item
        Object.keys(item).forEach(key => {
            this[key] = item[key]
        })
    }
}

// 图片Widget
export class ImageWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, config, {
            type: 'image',
            typeLabel: '图片',
            componentName: 'image-widget',
            icon: 'el-icon-picture',
            lock: false,
            visible: true
        })
        super(config)
        this.src = config.src
    }
}
