const text = '你好<navigator text=点击跳转 path=/pages/store/store style=color:red;>，测试1234'

function parseContent2(originText) {
    const startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
    const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/
    const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g // Empty Elements - HTML 5

    const empty = makeMap('navigator')
    const block = makeMap()
    const inline = makeMap()
    const fillAttrs = makeMap()
    const special = makeMap()

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
                    if (match && empty[match[1]]) {
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
        }

        parseEndTag()

        function parseStartTag(tag, tagName, rest, unary) {
            tagName = tagName.toLowerCase()

            if (block[tagName]) {
                while (stack.last() && inline[stack.last()]) {
                    parseEndTag('', stack.last())
                }
            }

            parseEndTag('', tagName)
            // if (closeSelf[tagName] && stack.last() === tagName) {
            // }

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
            console.log(tagName)
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
        if (!str) {
            return {}
        }
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

console.log(parseContent2(text))
