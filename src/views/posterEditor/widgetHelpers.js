import uniqueId from 'lodash/uniqueId'
import { mapGetters, mapActions } from 'poster/poster.vuex'
import { baseCommandStrat, baseMenuList } from './commandStrat'

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
    layerPanelVisible: true, // 是否在图片面板中可见
    isCopied: false, // 是否是复制的组件
    componentState: null // Function 复制组件时有效，返回结果为为复制时原组件内部的data
}

// 组件父类
export class Widget {
    constructor(config = defaultWidgetConfig) {
        const item = Object.assign({}, defaultWidgetConfig, config, {
            id: uniqueId(config.typeLabel + '-')
        })
        this._config = item
        Object.keys(item).forEach(key => {
            this[key] = item[key]
        })
    }
    /**
     * 各个子组件继承的mixin
     */
    static mixin(options) {
        options = Object.assign({}, {
            invokeFunctionMap: {
                getMenuList: 'getMenuList',
                executeContextCommand: 'executeContextCommand'
            },
            baseMenuList: Widget.getBaseMenuList()
        }, options)
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
                /**
                 * widgetConfig
                 */
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
                // 执行initHook
                if (this.item.initHook && typeof this.item.initHook === 'function') {
                    this.item.initHook(this._self)
                }
                // 初始化菜单
                this._baseMenuList = options.baseMenuList
                // 复制组件
                if (this.item.isCopied) {
                    Object.assign(this.$data, this.item.componentState())
                    const count = this.item.componentState.count
                    this.dragInfo.x = this.dragInfo.x + count * 10
                    this.dragInfo.y = this.dragInfo.y + count * 10
                }
            },
            mounted() {
                this._self.$el.addEventListener('contextmenu', (e) => {
                    const menuList = [...(this.getMenuList() || []), ...this._baseMenuList]
                    const isLock = this.item.lock
                    if (!(this.item instanceof BackgroundWidget)) {
                        menuList.unshift({ label: isLock ? '解除锁定' : '锁定', command: isLock ? '$unlock' : '$lock' })
                    }
                    if (menuList.length > 0) {
                        this.$emit('openContextmenu', {
                            x: e.pageX,
                            y: e.pageY,
                            menuList,
                            vm: this._self
                        })
                    }
                })
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
                },
                // 获取菜单列表
                getMenuList() {
                    console.warn(`${this.item.type}-${this.item.id}: "getMenuList" is null`)
                    return null
                },
                // 执行命令
                executeContextCommand(command) {
                    console.warn(`${this.item.type}-${this.item.id}: "executeContextCommand" is null`)
                    return null
                },
                _executeBaseContextCommand(command) {
                    if (baseCommandStrat[command]) {
                        baseCommandStrat[command](this.item, this._self)
                        return true
                    }
                    return false
                },
                // 执行命令
                _executeContextCommand(commandItem) {
                    const { command } = commandItem
                    if (!command) {
                        return
                    }
                    if (this._executeBaseContextCommand(command)) {
                        return
                    }
                    this.executeContextCommand(command)
                }
            }
        }
    }
    static getBaseMenuList() {
        return baseMenuList
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

// 绘制矩形（矩形前置组件）
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

// 矩形Widget
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

// 复制Widget
export class CopiedWidget extends Widget {
    constructor(config) {
        config = Object.assign({}, config,
            {
                typeLabel: config.typeLabel + '-copy',
                isCopied: true
            }
        )
        super(config)
        config.componentState.count = (config.componentState.count || 0) + 1
    }
}

