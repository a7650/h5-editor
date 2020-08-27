
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
