import { Message } from 'element-ui'
import Clipboard from 'clipboard'

function clipboardSuccess(successMessage) {
    Message.success(successMessage || '复制成功')
}

function clipboardError() {
    Message.error('复制失败')
}

export default function handleClipboard(text, event, successMessage) {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess(successMessage)
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardError()
        clipboard.destroy()
    })
    clipboard.onClick(event)
}
