import uniqueId from 'lodash/uniqueId'
import { mapGetters, mapActions } from 'poster/poster.vuex'
import { baseCommandStrat, baseMenuList } from './helpers/commandStrat'
import store from '@/store'
import _merge from 'lodash/merge'

const defaultWidgetConfig = () => {
  return {
    id: '', // 组件id
    type: '', // 类型
    typeLabel: '', // 类型标签
    componentName: '', // 动态component的name
    icon: '', // 图标class
    wState: {}, // 组件内部状态数据，样式属性等信息
    dragInfo: { w: 100, h: 100, x: 0, y: 0, rotateZ: 0 }, // 组件的位置、大小、旋转角度
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

    /**
     * @property {Int} _copyCount 复制的次数
     * @property {String} _copyFrom 复制来源 command | drag
     * @property {Boolean} _isBackup 是否是通过备份恢复的组件
     * @property {Int} _widgetCountLimit 该组件的数量限制
     * @property {Int} _sort 组件图层排序
     */
  }
}

const dragItemPosition = {}

function getBaseMenuList() {
  return baseMenuList
}

function getReferenceLineMap(canvasSize, canvasPosition, userLine/** 用户定义的referenceLine */, dragItemPosition) {
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

function updateDragInfo(dragInfo, updateSelfOnly = false) {
  this.$store.dispatch('poster/updateDragInfo', { dragInfo, widgetId: this.item.id, updateSelfOnly })
}

// 组件父类
export default class Widget {
  constructor(config) {
    const item = _merge(defaultWidgetConfig(), config, {
      id: uniqueId(config.typeLabel + '-')
    })
    // this._config = item
    Object.keys(item).forEach(key => {
      this[key] = item[key]
    })
  }

  // 组件容器mixin
  static superMixin(options) {
    options = Object.assign({}, {}, options)

    let hasCopiedOnDrag = false // 拖动过程中是否执行过复制
    let canvasSize = null
    let canvasPosition = null
    let referenceLineMap = null // 参考线位置（相对于画布的位置）{col:[],row:[]}
    return {
      data() {
        return {
          isActive: false
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
        ...mapGetters(['activeItemIds']),
        wState() {
          return this.item.wState
        },
        dragInfo: {
          get() {
            return this.item.dragInfo
          },
          set(val) {
            this.updateDragInfo(val)
          }
        }
      },
      beforeDestroy() {
        delete dragItemPosition[this.item.id]
      },
      watch: {
        activeItemIds: {
          handler(newVal) {
            if (this.item.couldAddToActive) {
              this.isActive = newVal.includes(this.item.id)
            }
          },
          immediate: true
        }
      },
      mounted() {
        this.dragRef = this.$refs.drag
        dragItemPosition[this.item.id] = this.dragInfo
      },
      methods: {
        ...mapActions(
          [
            'addActiveItem',
            'replaceActiveItems',
            'removeActiveItem',
            'setMatchedLine',
            'removeMatchedLine'
          ]
        ),
        activated(e) {
          this.isActive = true
          if (e) {
            if (e.ctrlKey) {
              this.addActiveItem(this.item)
            } else {
              this.replaceActiveItems([this.item])
            }
          }
        },
        deactivated() {
          this.isActive = false
          this.removeActiveItem(this.item)
        },
        onResize(x, y, w, h) {
          if (!this.resizing) {
            this.resizing = true
            store.dispatch('poster/history/push')
          }
          this.updateDragInfo({ x, y, w, h })
          dragItemPosition[this.item.id] = this.dragInfo
          // this.onDrag(x, y)
        },
        onResizeStop() {
          this.resizing = false
        },
        onDrag(x, y, e) {
          if (!this.moving) {
            this.moving = true
            store.dispatch('poster/history/push')
          }
          // ctrl快捷键拖动复制
          if (!hasCopiedOnDrag && e && e.ctrlKey) {
            const lastCopiedWidgets = store.state.poster.copiedWidgets
            // const copyData = getCopyData(this.item, this.$refs.widget)
            const copyData = this.item
            copyData._copyFrom = 'drag'
            store.dispatch('poster/copyWidget', copyData)
            store.dispatch('poster/pasteWidget')
            store.dispatch('poster/copyWidget', lastCopiedWidgets) // 恢复之前复制的组件
            hasCopiedOnDrag = true
          }
          // 参考线吸附对齐
          if (!e.altKey) {
            canvasSize = canvasSize || store.state.poster.canvasSize
            canvasPosition = canvasPosition || store.state.poster.canvasPosition
            if (!referenceLineMap) {
              referenceLineMap = getReferenceLineMap(
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
            let finalX, finalY
            if (newX !== null) {
              finalX = newX
              if (this.dragRef) {
                this.dragRef.elmX = newX
                this.dragRef.left = newX
              }
            } else {
              finalX = x
            }
            if (newY !== null) {
              finalY = newY
              if (this.dragRef) {
                this.dragRef.elmY = newY
                this.dragRef.top = newY
              }
            } else {
              finalY = y
            }
            this.updateDragInfo({ x: finalX, y: finalY })
            dragItemPosition[this.item.id] = this.dragInfo
            this.setMatchedLine({
              row: matchedLine.row.map(i => (i + canvasPosition.top)),
              col: matchedLine.col.map(i => (i + canvasPosition.left))
            })
          } else {
            this.updateDragInfo({ x, y })
          }
        },
        onDragStop(e) {
          if (this.moving) {
            this.moving = false
            hasCopiedOnDrag = false
            canvasSize = null
            canvasPosition = null
            referenceLineMap = null
            this.removeMatchedLine()
          } else if (!e.ctrlKey) {
            this.replaceActiveItems([this.item])
          }
        },
        onRotate(e) {
          if (!this.rotating) {
            this.rotating = true
            store.dispatch('poster/history/push')
          }
          this.updateDragInfo({ rotateZ: (e > 0 ? e : 360 + e) % 360 })
        },
        onRotateStop() {
          this.rotating = false
        },
        updateDragInfo: updateDragInfo
      }
    }
  }

  // 组件mixin
  static widgetMixin(options) {
    options = Object.assign({}, {
      baseMenuList: getBaseMenuList(),
      contextmenu: true // 使用右键菜单功能
    }, options)
    return {
      data() {
        return {
          $controlTarget: 'widgetControl'
        }
      },
      props: {
        item: {
          type: Object,
          default() {
            return {}
          }
        },
        isActive: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        wState() {
          return this.item.wState
        },
        dragInfo: {
          get() {
            return this.item.dragInfo
          },
          set(val) {
            this.updateDragInfo(val)
          }
        }
      },
      created() {
        // 执行initHook
        if (this.item.initHook && typeof this.item.initHook === 'function') {
          this.item.initHook(this._self)
        }
        // 初始化菜单
        this._baseMenuList = options.baseMenuList
        // 复制组件初始化数据
        if (this.item.isCopied && (this.item._copyFrom === 'command') && !this.item._isBackup) {
          // Object.assign(this.$data, this.item.componentState())
          // const count = this.item.componentState.count
          const count = this.item._copyCount
          this.updateDragInfo({
            x: this.dragInfo.x + count * 10,
            y: this.dragInfo.y + count * 10
          }, true/** updateSelfOnly */)
        }
      },
      mounted() {
        // 背景是自带drag，其他组件是嵌套在dragContainer里面
        const dragRef = this.$refs.drag || (this.$parent._isHoc ? this.$parent.$parent : this.$parent)
        if (options.contextmenu) {
          dragRef.$el.addEventListener('contextmenu', (e) => {
            const menuList = [...(this.getMenuList() || []), ...this._baseMenuList]
            const isLock = this.item.lock
            if (this.item.type !== 'background') {
              menuList.unshift({ label: isLock ? '解除锁定' : '锁定', command: isLock ? '$unlock' : '$lock' })
            }
            if (menuList.length > 0) {
              console.log('contextmenu')
              this.$emit('openContextmenu', {
                x: e.pageX,
                y: e.pageY,
                menuList,
                vm: this._self
              })
            }
          })
        }
        this.$dragRef = dragRef
      },
      methods: {
        updateDragInfo: updateDragInfo,
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

  static getPositionStyle(dragInfo) {
    if (!dragInfo) {
      return null
    }
    const canvasSize = store.state.poster.canvasSize
    return {
      position: 'absolute',
      width: (dragInfo.w / canvasSize.width) * 100 + '%',
      height: (dragInfo.h / canvasSize.height) * 100 + '%',
      // left: dragInfo.x + 'px',
      left: (dragInfo.x / canvasSize.width) * 100 + '%',
      top: (dragInfo.y / canvasSize.height) * 100 + '%',
      transform: `rotateZ(${dragInfo.rotateZ}deg)`
    }
  }
}
