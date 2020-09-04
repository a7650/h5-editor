
export default class DbService {
  static open(name, version, onupgradeneededCb) {
    return new Promise((resolve, reject) => {
      const dbRequest = window.indexedDB.open(name, version)
      dbRequest.onsuccess = () => {
        const dbInstance = dbRequest.result
        resolve(dbInstance)
      }
      dbRequest.onupgradeneeded = e => {
        const dbInstance = e.target.result
        onupgradeneededCb && onupgradeneededCb(dbInstance)
        resolve(dbInstance)
      }
      dbRequest.onerror = e => {
        reject()
      }
    })
  }
}
