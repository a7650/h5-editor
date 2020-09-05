import store from '@/store'
import { createHtmlStr } from '@/utils/posterUtils'

/**
 * @returns {WidgetItem[]}
 */
function getAllWidgets() {
    return store.state.poster.posterItems
}

export default class ExportService {
    static exportH5() {
        const allWidgets = getAllWidgets()
        let bodyInnerHtml = ''
        allWidgets.forEach(item => {
            if (!item.visible) {
                return
            }
            if (item._codeGen) {
                bodyInnerHtml += item._codeGen(item) || ''
            } else {
                console.warn(`类型为${item.type}的组件的构造函数未实现"_codeGen"方法`)
            }
        })
        const finalHtmlCode = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <body>
            ${bodyInnerHtml}
          </body>
        </html>
        `
        console.log(finalHtmlCode)
    }
    static exportPoster() {

    }
}
