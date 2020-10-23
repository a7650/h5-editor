/**
 *
 * @param {any} val
 * @returns {Boolean}
 */
const _toString = Object.prototype.toString
export function isPlainObject(val) {
    return _toString.call(val) === '[object Object]'
}
