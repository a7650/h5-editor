import store from '@/store'

/**
 * $开头表示是内部指令，以便和组件自定义指令区分
 */
export const baseCommandStrat = {
    $moveToTop(item) {
        store.dispatch('poster/widgetMoveToTop', item)
    },
    $moveToUpper(item) {
        store.dispatch('poster/widgetMoveToUpper', item)
    },
    $moveToLower(item) {
        store.dispatch('poster/widgetMoveToLower', item)
    },
    $moveToBottom(item) {
        store.dispatch('poster/widgetMoveToBottom', item)
    },
    $remove(item) {
        store.dispatch('poster/removeItem', item)
    },
    $lock(item) {
        store.dispatch('poster/lockItem', item)
    },
    $unlock(item) {
        store.dispatch('poster/unlockItem', item)
    }
}

export const baseMenuList = [
    {
        label: '置于顶层',
        command: '$moveToTop'
    },
    {
        label: '上移一层',
        command: '$moveToUpper'
    },
    {
        label: '下移一层',
        command: '$moveToLower'
    },
    {
        label: '置于底层',
        command: '$moveToBottom'
    },
    {
        label: '删除',
        command: '$remove'
    }
]
