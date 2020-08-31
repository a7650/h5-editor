
let dbInstance = null

export class dbService {
  open() {
    return new Promise((resolve, reject) => {
      if (!dbInstance) {
        const dbRequest = window.indexedDB.open('editorBackup', 1)
        dbRequest.onsuccess = e => {
          dbInstance = dbRequest.result
          resolve(dbInstance)
        }
        dbRequest.onupgradeneeded = e => {
          dbInstance = e.target.result
          if (!dbInstance.objectStoreNames.contains('config')) {
            dbInstance.createObjectStore('config', { keyPath: 'pageConfigId' })
          }
          if (!dbInstance.objectStoreNames.contains('activity_config')) {
            dbInstance.createObjectStore('activity_config', { keyPath: 'activityId' })
          }
          resolve(dbInstance)
        }
        dbRequest.onerror = e => {
          reject()
        }
      } else {
        resolve(dbInstance)
      }
    })
  }
}
