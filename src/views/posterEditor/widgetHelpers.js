import uniqueId from 'lodash/uniqueId'
import { mapGetters, mapActions } from 'poster/poster.vuex'
import { baseCommandStrat, baseMenuList } from './commandStrat'
import store from '@/store'
import { getCopyData } from './commandStrat'

const defaultWidgetConfig = {
    id: '', // 组件id
    type: '', // 类型
    typeLabel: '', // 类型标签
    componentName: '', // 动态component的name
    icon: '', // 图标class
    rename: '', // typeLabel重命名
    lock: false, // 是否处于锁定状态
    visible: true, // 是否可见
    initHook: null, // Function 组件初始化时候（created）执行
    layerPanelVisible: true, // 是否在图片面板中可见
    replicable: true, // 是否可复制
    isCopied: false, // 是否是复制的组件(通过复制操作获得的组件)
    removable: true, // 是否可删除
    couldAddToActive: true, // 是否可被添加进activeItems
    componentState: null // Function 复制组件时有效，返回结果为为复制时原组件内部的data；componentState.count为复制的次数
}

const dragItemPosition = {}

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
            baseMenuList: Widget.getBaseMenuList(),
            contextMenu: true // 使用右键菜单功能
        }, options)

        let hasCopiedOnDrag = false // 拖动过程中是否执行过复制
        let canvasSize = null
        let canvasPosition = null
        let referenceLineMap = null // 参考线位置（相对于画布的位置）{col:[],row:[]}

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
                // 复制组件初始化数据
                if (this.item.isCopied) {
                    Object.assign(this.$data, this.item.componentState())
                    const count = this.item.componentState.count
                    this.dragInfo.x = this.dragInfo.x + count * 10
                    this.dragInfo.y = this.dragInfo.y + count * 10
                    this.isActive = false
                }
            },
            mounted() {
                if (options.contextMenu) {
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
                }
                this.dragRef = this.$refs.drag
            },
            beforeDestroy() {
                delete dragItemPosition[this.item.id]
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
                    dragItemPosition[this.item.id] = this.dragInfo
                    // this.onDrag(x, y)
                },
                onDrag(x, y, e) {
                    // ctrl快捷键拖动复制
                    if (!hasCopiedOnDrag && e && e.ctrlKey) {
                        const lastCopiedWidgets = store.state.poster.copiedWidgets
                        const copyData = getCopyData(this.item, this._self)
                        copyData.componentState.count = -1 // 粘贴的时候计算得出count为0，使粘贴的组件的位置和原先位置重合
                        store.commit('poster/COPY_WIDGET', copyData)
                        store.commit('poster/PASTE_WIDGET')
                        store.commit('poster/COPY_WIDGET', lastCopiedWidgets) // 恢复之前复制的组件
                        hasCopiedOnDrag = true
                    }
                    // 参考线吸附对齐
                    if (!e.altKey) {
                        canvasSize = canvasSize || store.state.poster.canvasSize
                        canvasPosition = canvasPosition || store.state.poster.canvasPosition
                        if (!referenceLineMap) {
                            referenceLineMap = Widget.getReferenceLineMap(
                                canvasSize,
                                canvasPosition,
                                store.state.poster.referenceLine,
                                Object.assign({}, dragItemPosition, { [this.item.id]: null })
                            )
                        }
                        const maxX = x + this.dragInfo.w
                        const maxY = y + this.dragInfo.h
                        const widgetSelfLine = {
                            row: [y, parseInt((y + maxY) / 2), maxY], // left - center - right
                            col: [x, parseInt((x + maxX) / 2), maxX]
                        }
                        let newX = null
                        let newY = null
                        const matchedLine = {
                            row: widgetSelfLine.row
                                .map((i, index) => {
                                    let match = null
                                    Object.values(referenceLineMap.row).forEach(referItem => {
                                        if (i >= referItem.min && i <= referItem.max) {
                                            match = referItem.value
                                        }
                                    })
                                    if (match !== null) {
                                        if (index === 0) {
                                            newY = match
                                        } else if (index === 1) {
                                            newY = parseInt(match - this.dragInfo.h / 2)
                                        } else if (index === 2) {
                                            newY = parseInt(match - this.dragInfo.h)
                                        }
                                    }
                                    return match
                                })
                                .filter(i => i !== null),
                            col: widgetSelfLine.col
                                .map((i, index) => {
                                    let match = null
                                    Object.values(referenceLineMap.col).forEach(referItem => {
                                        if (i >= referItem.min && i <= referItem.max) {
                                            match = referItem.value
                                        }
                                    })
                                    if (match !== null) {
                                        if (index === 0) {
                                            newX = match
                                        } else if (index === 1) {
                                            newX = parseInt(match - this.dragInfo.w / 2)
                                        } else if (index === 2) {
                                            newX = parseInt(match - this.dragInfo.w)
                                        }
                                    }
                                    return match
                                })
                                .filter(i => i !== null)
                        }
                        if (newX !== null) {
                            this.dragInfo.x = newX
                            if (this.dragRef) {
                                this.dragRef.elmX = newX
                                this.dragRef.left = newX
                            }
                        } else {
                            this.dragInfo.x = x
                        }
                        if (newY !== null) {
                            this.dragInfo.y = newY
                            if (this.dragRef) {
                                this.dragRef.elmY = newY
                                this.dragRef.top = newY
                            }
                        } else {
                            this.dragInfo.y = y
                        }
                        dragItemPosition[this.item.id] = this.dragInfo
                        store.commit('poster/SET_MATCHED_LINE', {
                            row: matchedLine.row.map(i => (i + canvasPosition.top)),
                            col: matchedLine.col.map(i => (i + canvasPosition.left))
                        })
                    } else {
                        this.dragInfo.x = x
                        this.dragInfo.y = y
                    }
                },
                onDragStop() {
                    hasCopiedOnDrag = false
                    canvasSize = null
                    canvasPosition = null
                    referenceLineMap = null
                    store.commit('poster/REMOVE_MATCHED_LINE')
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

    static getReferenceLineMap(canvasSize, canvasPosition, userLine/** 用户定义的referenceLine */, dragItemPosition) {
        const { width, height } = canvasSize
        const { top, left } = canvasPosition
        if (!store.state.poster.referenceLineOpened) {
            userLine = { row: [], col: [] }
        }
        // 用户定义的参考线和画布参考线
        const referenceLine = {
            row: [...userLine.row, top, top + height, top + parseInt(height / 2)],
            col: [...userLine.col, left, left + width, left + parseInt(width / 2)]
        }
        // 组件参考线
        const widgetLine = {
            row: [],
            col: []
        }
        Object.values(dragItemPosition).forEach(dragInfo => {
            if (dragInfo) {
                const { x, y, w, h } = dragInfo
                widgetLine.row.push(y, parseInt(y + h / 2), y + h)
                widgetLine.col.push(x, parseInt(x + w / 2), x + w)
            }
        })
        const finalReferenceLine = {
            row: [
                ...referenceLine.row.map(i => (i - top)),
                ...widgetLine.row
            ],
            col: [
                ...referenceLine.col.map(i => (i - left)),
                ...widgetLine.col
            ]
        }
        const referenceLineMap = {
            row: finalReferenceLine.row.reduce((pre, cur) => {
                return Object.assign(pre, { [cur]: { min: cur - 5, max: cur + 5, value: cur }})
            }, {}),
            col: finalReferenceLine.col.reduce((pre, cur) => {
                return Object.assign(pre, { [cur]: { min: cur - 5, max: cur + 5, value: cur }})
            }, {})
        }
        return referenceLineMap
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
            visible: true,
            couldAddToActive: false,
            replicable: false
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
            layerPanelVisible: false,
            replicable: false,
            couldAddToActive: false
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

