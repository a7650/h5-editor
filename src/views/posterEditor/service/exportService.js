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
        const canvasSize = store.state.poster.canvasSize
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
            <style>
                *{
                    padding:0;
                    margin:0;
                }
            </style>
          </head>
          <body>
            <div style="overflow:hidden;width:100%;height:0;position:absolute;padding-top:${canvasSize.height * 100 / canvasSize.width}%">
            ${bodyInnerHtml}
            </div>
          </body>
        </html>
        `
        console.log(finalHtmlCode)
    }
    static exportPoster() {

    }
}
