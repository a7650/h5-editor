import store from '@/store'

export const pluginHelpers = {
  addWidget(widget) {
    store.dispatch('poster/addItem', widget)
  },
  removeWidget(widget) {
    store.dispatch('poster/removeItem', widget)
  },
  updateWidgetState(agrs) {
    // { keyPath, value, widgetId, pushHistory = true }
    store.dispatch('poster/updateWidgetState', agrs)
  },
  updateDragInfo(agrs) {
    store.dispatch('poster/updateDragInfo', agrs)
  },
  getCanvasSize() {
    return store.getters['poster/canvasSize']
  },
  setCanvasSize(agrs) {
    // {width, height}
    store.dispatch('poster/setCanvasSize', agrs)
  },
  recoverEditorData(agrs /** initialBackupData */) {
    store.dispatch('poster/backup/recover', agrs)
  }
}
