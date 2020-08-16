/**
 * 更改组合（activeitems）的位置
 * @sideEffect
 * @param {WidgetItem[]} activeItems
 * @param {String} type 操作的类型
 * @param {CanvasSize} canvasSize
 */
export function changeCompositionPositionHandler(activeItems, type, canvasSize) {
    switch (type) {
        case 'alignLeft':
            activeItems.forEach(item => {
                item.dragInfo.x = 0
            })
            break
        case 'alignCenter':
            activeItems.forEach(item => {
                item.dragInfo.x = (canvasSize.width - item.dragInfo.w) / 2
            })
            break
        case 'alignRight':
            activeItems.forEach(item => {
                item.dragInfo.x = canvasSize.width - item.dragInfo.w
            })
            break
        default: break
    }
}
