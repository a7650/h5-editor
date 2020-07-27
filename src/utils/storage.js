const flag = 'POSTER_EDITOR_'

function processKey(key) {
    return flag + key
}

function setLocal(key, data) {
    if (!data) {
        localStorage.removeItem(processKey(key))
    }
    localStorage.setItem(processKey(key), JSON.stringify(data))
}

function removeLocal(key) {
    localStorage.removeItem(processKey(key))
}

function getLocal(key) {
    return JSON.parse(localStorage.getItem(processKey(key)))
}

function setSession(key, data) {
    if (!data) {
        sessionStorage.removeItem(processKey(key))
    }
    sessionStorage.setItem(processKey(key), JSON.stringify(data))
}

function removeSession(key) {
    sessionStorage.removeItem(processKey(key))
}

function getSession(key) {
    return JSON.parse(sessionStorage.getItem(processKey(key)))
}

export default {
    setLocal,
    removeLocal,
    getLocal,
    setSession,
    removeSession,
    getSession
}
