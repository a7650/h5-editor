import uniqueId from 'lodash/uniqueId'
import { mapGetters, mapActions } from 'poster/poster.vuex'

const defaultWidgetConfig = {
    type: '', // 类型
    typeLabel: '', // 类型标签
    componentName: '', // 动态component的name
    icon: '', // 图标class
    rename: '', // typeLabel重命名
    lock: false, // 是否处于锁定状态
    visible: true, // 是否可见
    id: '',
    initHook: null, // Function 组件初始化时候（created）执行
    layerPanelVisible: true // 是否在图片面板中可见
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
    static mixin() {
        return {
            data() {
                return {
                    isActive: false,
                    dragInfo: {
                        w: 100,
                        h: 100,
                        x: 0,
                        y: 0,
                        rotateZ: 0
                    }
                }
            },
            props: {
                item: {
                    type: Object,
                    default() {
                        return {}
                    }
                }
            },
            computed: {
                ...mapGetters(['activeItemIds'])
            },
            created() {
                if (this.item.initHook && typeof this.item.initHook === 'function') {
                    this.item.initHook(this._self)
                }
            },
            watch: {
                activeItemIds(newVal) {
                    if (newVal.includes(this.item.id)) {
                        if (!this.isActive) {
                            this.activated()
                        }
                    } else {
                        if (this.isActive) {
                            this.deactivated()
                        }
                    }
                }
            },
            methods: {
                ...mapActions(['addActiveItem', 'replaceActiveItems', 'removeActiveItem']),
                activated() {
                    this.isActive = true
                    this.replaceActiveItems([this.item])
                },
                deactivated() {
                    this.isActive = false
                    this.removeActiveItem(this.item)
                },
                onResize(x, y, w, h) {
                    this.dragInfo.w = w
                    this.dragInfo.h = h
                    this.dragInfo.x = x
                    this.dragInfo.y = y
                },
                onDrag(x, y) {
                    this.dragInfo.x = x
                    this.dragInfo.y = y
                },
                onRotate(e) {
                    this.dragInfo.rotateZ = (e > 0 ? e : 360 + e) % 360
                }

            }
        }
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

// 背景Widget
export class BackgroundWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'background',
            typeLabel: '背景',
            componentName: 'background-widget',
            icon: 'icon-background',
            lock: false,
            visible: true
        }, config)
        super(config)
        this.src = config.src
        this.isSolid = !!config.isSolid // 是否是纯色背景
        this.backgroundColor = config.backgroundColor || '#fff'
    }
}

// 绘制矩形
export class DrawRectWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, {
            type: 'rect',
            typeLabel: '矩形',
            componentName: 'draw-rect-widget',
            icon: 'icon-rect',
            lock: false,
            visible: true,
            layerPanelVisible: false
        }, config)
        super(config)
        this.drawing = true
    }
}

// 矩形
export class RectWidget extends Widget {
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
        this.drawing = true
    }
}

// 文本Widget
export class TextWidget extends Widget {
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
