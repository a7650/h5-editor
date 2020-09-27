import DbService from './indexDB'
import { getRandomStr } from 'poster/utils'

let dbInstance = null

const MAX_BACKUP_COUNT = 10

const VERSION = 1

export default class BackupService {
    static async init() {
        try {
            dbInstance = await DbService.open('posterEditor', VERSION, db => {
                if (!db.objectStoreNames.contains('backup')) {
                    db.createObjectStore('backup', { keyPath: 'id' })
                }
            })
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
    static async saveBackupData(backupData) {
        const transaction = dbInstance.transaction('backup', 'readwrite')
        const store = transaction.objectStore('backup')
        store.add({
            backupData: JSON.parse(JSON.stringify(backupData)),
            id: getRandomStr(),
            createTime: Date.now()
        })
        store.getAll().onsuccess = e => {
            const allData = e.target.result
            if (allData && allData.length > MAX_BACKUP_COUNT) {
                allData
                    .sort((a, b) => (a.createTime - b.createTime))
                    .splice(0, allData.length - MAX_BACKUP_COUNT)
                    .forEach(({ id }) => {
                        store.delete(id)
                    })
            }
        }
        return true
    }
    static getBackupData(id) {
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction('backup', 'readonly')
            const store = transaction.objectStore('backup')
            const request = store.get(id)
            request.onsuccess = () => {
                console.log(request.result)
                resolve(request.result)
            }
            request.onerror = () => {
                reject()
            }
        })
    }
    static getLastBackup() {
        return new Promise((resolve, reject) => {
            const transaction = dbInstance.transaction('backup', 'readonly')
            const store = transaction.objectStore('backup')
            store.getAll().onsuccess = e => {
                const result = e.target.result
                if (result && result.length > 0) {
                    const lastData = result.sort((a, b) => (b.createTime - a.createTime))[0]
                    resolve(lastData)
                } else {
                    reject()
                }
            }
        })
    }
}
