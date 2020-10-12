// import { setAuthHeader } from '@/utils/auth'

/**
 * 获取图片尺寸（宽、高、纵横比）
 * @param {String} src 图片地址
 */
export function getImageSize(src = '') {
    const result = {
        width: 0,
        height: 0,
        aspectRatio: 0
    }
    return new Promise((resolve, reject) => {
        if (!src) {
            reject()
            return
        }
        const img = new Image()
        img.onload = () => {
            resolve(Object.assign({}, result, {
                width: img.width,
                height: img.height,
                aspectRatio: parseFloat((img.height / img.width).toFixed(2))
            }))
        }
        img.src = src
    })
}

/**
 * 校验图片文件(类型，格式，文件体积)
 * @param {File} file
 */
export function validateImage(file) {
    const MAX_IMG_SIZE_MB = 5
    const MAX_IMG_SIZE = MAX_IMG_SIZE_MB * 1024 * 1000 // 图片文件最大占用空间
    return new Promise((resolve, reject) => {
        if (!file) {
            reject()
        } else {
            const reader = new FileReader()
            reader.onload = () => {
                resolve({ src: reader.result, file })
            }
            reader.onerror = reject
            if (!/image/.test(file.type)) {
                alert(`请选择图片文件(*.jpg或*.png格式,${MAX_IMG_SIZE_MB}MB以内)`)
            } else if (!['jpg', 'png', 'JPG', 'PNG'].includes(file.name.replace(/.+\./, ''))) {
                alert('请选择正确格式的图片(*.jpg或*.png格式)')
            } else if (file.size > MAX_IMG_SIZE) {
                alert(`图片体积过大,请控制在${MAX_IMG_SIZE_MB}以内`)
            } else {
                reader.readAsDataURL(file)
            }
        }
    })
}

/**
 * 校验图片的纵横比
 * @param {*} param0 图片尺寸信息 { width, height, aspectRatio }
 * @param {Number|Array} expectRange 期望的比例范围
 */
export function validateAspectRatio({ width, height, aspectRatio }, expectRange = 1/** array or number */) {
    if (!aspectRatio) {
        aspectRatio = height / width
    }
    if (typeof expectRange === 'number') {
        expectRange = [expectRange - 0.01, expectRange + 0.01]
    }
    return (aspectRatio >= expectRange[0]) && (aspectRatio <= expectRange[1])
}

/**
 * base64转换为File
 * @param {String} base64
 */
export function transformBase64ToImgFile(base64) {
    function baseToBlob(dataurl) {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }
    function blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date()
        theBlob.name = fileName
        return theBlob
    }
    const blob = baseToBlob(base64)
    const file = blobToFile(blob, 'image.png ')
    return new File([file], 'image.png', {
        lastModified: new Date(),
        type: 'image/png'
    })
}

/**
 * 获取图片的base64
 * @param {String} imgUrl 图片地址
 */
export function getBase64(imgUrl) {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
            imgUrl = imgUrl.replace('http://bbymall.datiannf.com/uploader', '/uploader') + `?v=${Date.now()}`
        } else {
            imgUrl = imgUrl + `?v=${Date.now()}`
        }
        window.URL = window.URL || window.webkitURL
        const xhr = new XMLHttpRequest()
        xhr.open('get', imgUrl, true)
        xhr.responseType = 'blob'
        xhr.onload = function() {
            if (this.status === 200) {
                const blob = this.response
                const oFileReader = new FileReader()
                oFileReader.onloadend = function(e) {
                    const base64 = e.target.result
                    resolve(base64)
                }
                oFileReader.readAsDataURL(blob)
                const img = document.createElement('img')
                img.onload = function(e) {
                    window.URL.revokeObjectURL(img.src)
                }
                const src = window.URL.createObjectURL(blob)
                img.src = src
            } else {
                reject()
            }
        }
        xhr.onerror = function() {
            reject()
        }
        // xhr.setRequestHeader(...Object.entries(setAuthHeader())[0])
        xhr.send()
    })
}

/**
 * 将arrayBuffer转换为base64
 * @param {Buffer} buffer
 */
export function transformArrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return 'data:image/png;base64,' + window.btoa(binary)
}
