// import clickoutside from 'element-ui/src/utils/clickoutside'

export { clickoutside } from 'element-ui/src/utils/clickoutside'

let activeViewZidx = 99

// 阻止默认的右键菜单
export const preventRightClick = {
    inserted(el) {
        el.oncontextmenu = function(e) {
            e.preventDefault()
        }
    }
}

export const stick = {
    bind(el) {
        el.style.zIndex = activeViewZidx++
        el.onmousedown = function(e) {
            el.style.zIndex = activeViewZidx++
        }
    }
}

export const drag = {
    bind(el, binding) {
        el.onmousedown = function(e) {
            const parentNode = document.querySelector(String(binding.arg))
            if (!parentNode) return
            // 获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
            const divx = e.clientX - parentNode.offsetLeft
            const divy = e.clientY - parentNode.offsetTop
            const minLeft = 0
            const maxLeft = window.innerWidth - parentNode.clientWidth
            const minTop = 0
            const maxTop = window.innerHeight - parentNode.clientHeight
            function moveHandler(e) {
                // 获取移动后div的位置：鼠标位置-divx/divy
                const l = Math.min(Math.max(e.clientX - divx, minLeft), maxLeft)
                const t = Math.min(Math.max(e.clientY - divy, minTop), maxTop)
                // if (t - minTop <= 20) {
                //     t = minTop
                // }
                // if (l - minLeft <= 20) {
                //     l = minLeft
                // } else if (maxLeft - l <= 20) {
                //     l = maxLeft
                // }
                parentNode.style.left = l + 'px'
                parentNode.style.top = t + 'px'
            }
            document.addEventListener('mousemove', moveHandler)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveHandler)
                document.onmouseup = null
            })
        }
    }
}
