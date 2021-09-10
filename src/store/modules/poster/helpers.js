
/**
 * 更改组合（activeitems）的位置
 * @sideEffect
 * @param {WidgetItem[]} activeItems
 * @param {String} type 操作的类型
 * @param {CanvasSize} canvasSize
 */
export function changeCompositionPositionHandler(activeItems, type, canvasSize) {
    let minX = activeItems[0].dragInfo.x
    let maxX = activeItems[0].dragInfo.x
    activeItems.forEach(item => {
        minX = Math.min(minX, item.dragInfo.x)
        maxX = Math.max(maxX, item.dragInfo.x)
    })
    switch (type) {
        case 'alignLeft':
            activeItems.forEach(item => {
                item.dragInfo.x = minX
            })
            break
        case 'alignCenter':
            activeItems.forEach(item => {
                item.dragInfo.x = (canvasSize.width - item.dragInfo.w) / 2
            })
            break
        case 'alignRight':
            activeItems.forEach(item => {
                item.dragInfo.x = maxX
            })
            break
        default: return false
    }
    return true
}

/**
 * 获取编辑器配置
 */
export function getEditorConfig() {
    const defaultConfig = {
        'history.maxHistoryStackLength': 30, // 撤销最大步数
        'backup.autoSave': true, // 自动备份
        'backup.autoSaveDivision': 1000 * 60 * 10 // 自动备份的间隔
    }
    try {
        const config = JSON.parse(localStorage.getItem('editorConfig')) || null
        return Object.assign(defaultConfig, config)
    } catch (e) {
        localStorage.removeItem('editorConfig')
        console.error(e)
        return defaultConfig
    }
}

/**
 * 保存编辑器配置
 */
export function saveEditorConfig(config) {
    const oldConfig = getEditorConfig()
    const newConfig = Object.assign(oldConfig, config)
    localStorage.setItem('editorConfig', JSON.stringify(newConfig))
    return newConfig
}
