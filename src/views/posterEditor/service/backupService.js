export default class BackupService {
    static saveBackupData(backupData) {
        localStorage.setItem('backupDate', JSON.stringify(backupData))
        return true
    }
    static getBackupData() {
        return JSON.parse(localStorage.getItem('backupDate'))
    }
}
