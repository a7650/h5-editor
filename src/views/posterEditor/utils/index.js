// import html2canvas from 'html2canvas'
import html2canvas from './html2canvas.min'

/**
 * 获取随机字符串
 * @returns {String}
 */
export function getRandomStr() {
    return Math.random().toString(32).substr(2)
}

// style属性片段
const styleFragment = {
    button: {
        height: '36px',
        boxSizing: 'border-box',
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        border: 'none'
    },
    noWrap: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingTop: '1px'
    },
    _defaultStyle: {
        boxSizing: 'border-box'
    }
}

/**
 * 根据nodeObj生成dom结构
 * @param {ComponentDomNode} obj
 * @returns {HTMLDivElement}
 */
export function createDom(obj) {
    let dom = null
    try {
        let { style = {}} = obj
        const { tag = 'div', styleFragment: domStyleFragment, attrs = {}, children, text } = obj
        dom = document.createElement(tag)
        if (domStyleFragment && domStyleFragment.length > 0) {
            const _style = {}
            domStyleFragment.forEach(item => {
                Object.assign(_style, styleFragment[item] || null)
            })
            style = Object.assign({}, _style, style)
        }
        Object.keys(style).forEach(key => {
            dom.style[key] = style[key]
        })
        Object.keys(styleFragment._defaultStyle).forEach(key => {
            dom.style[key] = styleFragment._defaultStyle[key]
        })
        Object.keys(attrs).forEach(key => {
            dom.setAttribute(key, attrs[key])
        })
        if (text) {
            dom.innerText = text
        }
        if (children && children.length > 0) {
            children.forEach(item => {
                dom.appendChild(createDom(item))
            })
        }
    } catch (e) {
        console.error(e)
    }
    return dom
}

/**
 * 生成html字符串
 * @param {ComponentDomNode} nodeObj
 * @returns {ComponentHtml}
 */
export function createHtmlStr(nodeObj) {
    const result = document.createElement('div')
    result.appendChild(createDom(nodeObj))
    return result.innerHTML
}

/**
 * 把style字符串转换为style对象
 * @param {String} styleStr style字符串
 * @returns {Object} styleObj
 */
export function parseStyle(styleStr) {
    if (!styleStr) {
        return {}
    }
    const styleArr = styleStr.split(';') || []
    const styleObj = {}
    styleArr.forEach(item => {
        const [attr, val] = item.split(':')
        if (attr && val && val !== 'undefined') { // 判断"undefined"是因为某些style字符串解析出来的属性为"undefined"字符串，所以要去除这种情况
            styleObj[toCamel(attr)] = val || ''
        }
    })
    return styleObj
}

/**
 * 把style对象转换为字符串
 * @param {Object} styleObj
 * @returns {String} styleStr style字符串
 */
export function stringifyStyle(styleObj) {
    let styleStr = ''
    const styleArr = []
    Object.keys(styleObj).forEach(key => {
        styleArr.push(`${toLine(key)}:${styleObj[key] || ''}`)
    })
    styleStr = styleArr.join(';')
    return styleStr
}

/**
 * 驼峰转横线
 * @param {String} str
 */
export function toLine(str) {
    let temp = str.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase()
    })
    if (temp.slice(0, 1) === '-') { // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
        temp = temp.slice(1)
    }
    return temp
}

/**
 *
 * @param {String} str 横线转驼峰
 */
export function toCamel(str) {
    const [fir, ...arr] = str.split('-')
    const result = fir + arr.map(item => {
        return item.substr(0, 1).toUpperCase() + item.substr(1)
    }).join('')
    return result
}

export function domToImg(dom, options = {}) {
    return new Promise((resolve, reject) => {
        const baseOptions = {
            width: 0,
            height: 0
        }
        options = Object.assign({}, baseOptions, options)
        const { width, height } = options
        try {
            document.body.appendChild(dom)
            html2canvas(dom, {
                width: width,
                height: height,
                // dpi: 192,
                scale: 2
            })
                .then(canvas => {
                    const url = canvas.toDataURL()
                    console.log(url)
                    const _img = document.createElement('img')
                    _img.width = width
                    _img.height = height
                    _img.src = url
                    document.body.removeChild(dom)
                    resolve(_img)
                })
                .catch(err => {
                    console.log(err)
                    document.body.removeChild(dom)
                    reject()
                })
        } catch (e) {
            console.log(e)
            reject()
        }
    })
}

/**
 * 将数组中某元素移动到0位置
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveTop(arr, index) {
    if (index !== 0) {
        const _arr = [...arr]
        const moveItem = _arr.splice(index, 1)
        _arr.unshift(...moveItem)
        return _arr
    } else {
        return arr
    }
}

/**
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveUpper(arr, index) {
    if (index !== 0) {
        const _arr = [...arr]
        const curIdx = index
        const preIdx = index - 1;
        [_arr[curIdx], _arr[preIdx]] = [_arr[preIdx], _arr[curIdx]]
        return _arr
    } else {
        return arr
    }
}

/**
 * 将数组中某元素向下移动一个位置
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveLower(arr, index) {
    if (index !== arr.length - 1) {
        const _arr = [...arr]
        const curIdx = index
        const nextIdx = index + 1;
        [_arr[curIdx], _arr[nextIdx]] = [_arr[nextIdx], _arr[curIdx]]
        return _arr
    } else {
        return arr
    }
}

/**
 * 将数组中某元素移动到末尾
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveBottom(arr, index) {
    const len = arr.length - 1
    if (index !== len) {
        const _arr = [...arr]
        const moveItem = _arr.splice(index, 1)
        _arr.push(...moveItem)
        return _arr
    } else {
        return arr
    }
}

export const HoC = (WrappedComponent, options) => ({
    ...options,
    props: typeof WrappedComponent === 'function'
        ? WrappedComponent.options.props
        : WrappedComponent.props,
    created() {
        this._isHoc = true
    },
    render(h) {
        const slots = this.$slots
        const scopedSlots = {}
        Object.keys(slots).map(key => (scopedSlots[key] = () => slots[key]))
        const props = options.props
        return h(WrappedComponent, {
            attrs: this.$attrs,
            props: Object.assign({}, this.$props, props),
            on: this.$listeners,
            scopedSlots
        })
    }
})

export function parseHtmlStr(originText) {
    const startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
    const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/
    const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g // Empty Elements - HTML 5

    const empty = makeMap(
        'area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr'
    ) // Block Elements - HTML 5
    // fixed by xxx 将 ins 标签从块级名单中移除

    const block = makeMap(
        'a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'
    ) // Inline Elements - HTML 5

    const inline = makeMap(
        'abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,let'
    ) // Elements that you can, intentionally, leave open
    // (and which close themselves)

    const closeSelf = makeMap(
        'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'
    ) // Attributes that have their values filled in disabled="disabled"

    const fillAttrs = makeMap(
        'checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'
    ) // Special Elements (can contain anything)

    const special = makeMap('script,style')
    function HTMLParser(html, handler) {
        let index
        let chars
        let match
        const stack = []
        let last = html

        stack.last = function() {
            return this[this.length - 1]
        }
        while (html) {
            chars = true
            if (!stack.last() || !special[stack.last()]) {
                if (html.indexOf('<!--') === 0) {
                    index = html.indexOf('-->')

                    if (index >= 0) {
                        if (handler.comment) {
                            handler.comment(html.substring(4, index))
                        }

                        html = html.substring(index + 3)
                        chars = false
                    } // end tag
                } else if (html.indexOf('</') === 0) {
                    match = html.match(endTag)

                    if (match) {
                        html = html.substring(match[0].length)
                        match[0].replace(endTag, parseEndTag)
                        chars = false
                    } // start tag
                } else if (html.indexOf('<') === 0) {
                    match = html.match(startTag)

                    if (match) {
                        html = html.substring(match[0].length)
                        match[0].replace(startTag, parseStartTag)
                        chars = false
                    }
                }

                if (chars) {
                    index = html.indexOf('<')
                    const text = index < 0 ? html : html.substring(0, index)
                    html = index < 0 ? '' : html.substring(index)

                    if (handler.chars) {
                        handler.chars(text)
                    }
                }
            } else {
                html = html.replace(
                    new RegExp('([\\s\\S]*?)<\/' + stack.last() + '[^>]*>'),
                    function(all, text) {
                        text = text.replace(
                            /<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g,
                            '$1$2'
                        )

                        if (handler.chars) {
                            handler.chars(text)
                        }

                        return ''
                    }
                )
                parseEndTag('', stack.last())
            }

            if (html === last) {
                throw new Error('Parse Error: ' + html)
            }

            last = html
        } // Clean up any remaining tags

        parseEndTag()

        function parseStartTag(tag, tagName, rest, unary) {
            tagName = tagName.toLowerCase()

            if (block[tagName]) {
                while (stack.last() && inline[stack.last()]) {
                    parseEndTag('', stack.last())
                }
            }

            if (closeSelf[tagName] && stack.last() === tagName) {
                parseEndTag('', tagName)
            }

            unary = empty[tagName] || !!unary

            if (!unary) {
                stack.push(tagName)
            }

            if (handler.start) {
                const attrs = []
                rest.replace(attr, function(match, name) {
                    const value = arguments[2]
                        ? arguments[2]
                        : arguments[3]
                            ? arguments[3]
                            : arguments[4]
                                ? arguments[4]
                                : fillAttrs[name]
                                    ? name
                                    : ''
                    attrs.push({
                        name: name,
                        value: value,
                        escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
                    })
                })

                if (handler.start) {
                    handler.start(tagName, attrs, unary)
                }
            }
        }

        function parseEndTag(tag, tagName) {
            // If no tag name is provided, clean shop
            let pos
            if (!tagName) {
                pos = 0
            } else {
                for (let pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] === tagName) {
                        break
                    }
                }
            }
            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (let i = stack.length - 1; i >= pos; i--) {
                    if (handler.end) {
                        handler.end(stack[i])
                    }
                } // Remove the open elements from the stack
                stack.length = pos
            }
        }
    }

    function makeMap(str) {
        const obj = {}
        const items = str.split(',')

        for (let i = 0; i < items.length; i++) {
            obj[items[i]] = true
        }

        return obj
    }

    function removeDOCTYPE(html) {
        return html
            .replace(/<\?xml.*\?>\n/, '')
            .replace(/<!doctype.*>\n/, '')
            .replace(/<!DOCTYPE.*>\n/, '')
    }

    function parseAttrs(attrs) {
        return attrs.reduce(function(pre, attr) {
            const value = attr.value
            const name = attr.name

            if (pre[name]) {
                pre[name] = pre[name] + ' ' + value
            } else {
                pre[name] = value
            }

            return pre
        }, {})
    }

    function parseHtml(html) {
        html = removeDOCTYPE(html)
        const stacks = []
        const results = {
            node: 'root',
            children: []
        }
        HTMLParser(html, {
            start: function start(tag, attrs, unary) {
                const node = {
                    name: tag
                }

                if (attrs.length !== 0) {
                    node.attrs = parseAttrs(attrs)
                }

                if (unary) {
                    const parent = stacks[0] || results

                    if (!parent.children) {
                        parent.children = []
                    }

                    parent.children.push(node)
                } else {
                    stacks.unshift(node)
                }
            },
            end: function end(tag) {
                const node = stacks.shift()
                if (node.name !== tag) {
                    console.error('invalid state: mismatch end tag')
                }

                if (stacks.length === 0) {
                    results.children.push(node)
                } else {
                    const parent = stacks[0]

                    if (!parent.children) {
                        parent.children = []
                    }

                    parent.children.push(node)
                }
            },
            chars: function chars(text) {
                const node = {
                    type: 'text',
                    text: text
                }

                if (stacks.length === 0) {
                    results.children.push(node)
                } else {
                    const parent = stacks[0]

                    if (!parent.children) {
                        parent.children = []
                    }

                    parent.children.push(node)
                }
            },
            comment: function comment(text) {
                const node = {
                    node: 'comment',
                    text: text
                }
                const parent = stacks[0]

                if (!parent.children) {
                    parent.children = []
                }

                parent.children.push(node)
            }
        })
        return results.children
    }
    return parseHtml(originText)
}

export function base64ToBlob(base64Str) {
    var arr = base64Str.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

