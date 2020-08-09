const ruler = {
    /**
     * @el 容器 String
     * @height 刻度尺高度 Number
     * @maxScale 最大刻度 Number
     * @startValue 开始的值 Number
     * @region 区间 Array
     * @background 刻度尺背景颜色 String
     * @color 刻度线和字体的颜色 String
     * @markColor  中心刻度标记颜色 String
     * @isConstant 是否不断地获取值 Boolean
     * @success(res) 滑动结束后的回调 Function
     * */
    initRow: function(params) {
        const initParams = {
            el: params.el, // id or node
            height: params.height || 60,
            maxScale: params.maxScale || 200,
            startValue: params.startValue || 0,
            region: params.region || false,
            background: params.background || false,
            color: params.color || false,
            markColor: params.markColor || '#FFCC33',
            isConstant: params.isConstant || false
        }
        const elNode = initParams.el instanceof HTMLElement ? initParams.el : document.querySelector(initParams.el)
        if (!elNode) {
            console.warn('缺少容器')
            return false
        }
        const rulerWrap = elNode // 获取容器
        rulerWrap.style.height = initParams.height + 'px'
        // 最大刻度的小值是50
        initParams.maxScale = initParams.maxScale < 50 ? 50 : initParams.maxScale

        if (initParams.startValue > initParams.maxScale) {
            initParams.startValue = initParams.maxScale
        }
        const count = initParams.startValue // 初始值
        const winWidth = rulerWrap.offsetWidth // 容器宽度
        const division = 10 // 每个刻度的距离 分割线
        let canvas = rulerWrap.getElementsByTagName('canvas')[0] // 获取容器下的canvas标签
        // 没有canvas就创建一个
        if (!canvas) {
            canvas = document.createElement('canvas') // 创建canvas标签
            canvas.width = winWidth
            canvas.height = initParams.height
            rulerWrap.appendChild(canvas)
        }
        const cxt = canvas.getContext('2d')

        if (window.devicePixelRatio) {
            canvas.width = window.devicePixelRatio * winWidth
            canvas.height = window.devicePixelRatio * initParams.height
            cxt.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        // 画刻度尺
        function drawRuler(count) {
            // count = count - 25
            // 清空画布
            cxt.clearRect(0, 0, winWidth, initParams.height)
            // 刻度尺背景
            if (initParams.background) {
                cxt.fillStyle = initParams.background
                cxt.fillRect(0, 0, canvas.width, initParams.height)
            }
            // 画刻度线
            for (let i = 0; i < initParams.maxScale; i++) {
                cxt.beginPath()
                cxt.save()
                cxt.strokeStyle = initParams.color ? initParams.color : '#bbb'
                cxt.lineWidth = 1
                cxt.lineCap = 'round'
                const x = division * i - count * division
                cxt.moveTo(x, initParams.height)
                cxt.lineTo(x, Math.floor(initParams.height * 0.8))
                if (i % 5 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : '#666'
                    cxt.lineTo(x, Math.floor(initParams.height * 0.5))
                }
                if (i % 10 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : '#666'
                    cxt.font = '10px Arial'
                    cxt.fillStyle = initParams.color ? initParams.color : '#333'
                    cxt.textAlign = 'left'
                    cxt.textBaseline = 'middle'
                    cxt.lineTo(x, 0)
                    cxt.fillText(String(i * division), x + 2, Math.floor(initParams.height * 0.5))
                }
                cxt.stroke()
                cxt.restore()
                cxt.closePath()
            }
        }
        if (window.devicePixelRatio) {
            canvas.style.transform = 'scale(' + 1 / window.devicePixelRatio + ')'
            canvas.style.transformOrigin = 'left top'
        }
        drawRuler(count)
    },
    initColumn: function(params) {
        const initParams = {
            el: params.el, // id or node
            width: params.width || 60,
            maxScale: params.maxScale || 200,
            startValue: params.startValue || 0,
            region: params.region || false,
            background: params.background || false,
            color: params.color || false,
            markColor: params.markColor || '#FFCC33',
            isConstant: params.isConstant || false,
            startGap: params.startGap || 0
        }
        const elNode = initParams.el instanceof HTMLElement ? initParams.el : document.querySelector(initParams.el)
        if (!elNode) {
            console.warn('缺少容器')
            return false
        }
        const rulerWrap = elNode // 获取容器
        rulerWrap.style.width = initParams.height + 'px'
        // 最大刻度的小值是50
        initParams.maxScale = initParams.maxScale < 50 ? 50 : initParams.maxScale

        if (initParams.startValue > initParams.maxScale) {
            initParams.startValue = initParams.maxScale
        }
        const count = initParams.startValue // 初始值
        const winHeight = rulerWrap.offsetHeight // 容器宽度
        const division = 10 // 每个刻度的距离 分割线
        let canvas = rulerWrap.getElementsByTagName('canvas')[0] // 获取容器下的canvas标签
        // 没有canvas就创建一个
        if (!canvas) {
            canvas = document.createElement('canvas') // 创建canvas标签
            canvas.height = winHeight
            canvas.width = initParams.width
            rulerWrap.appendChild(canvas)
        }
        const cxt = canvas.getContext('2d')

        if (window.devicePixelRatio) {
            canvas.height = window.devicePixelRatio * winHeight
            canvas.width = window.devicePixelRatio * initParams.width
            cxt.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        // 画刻度尺
        function drawRuler(count) {
            // count = count - 25
            // 清空画布
            cxt.clearRect(0, 0, initParams.width, winHeight)
            // 刻度尺背景
            if (initParams.background) {
                cxt.fillStyle = initParams.background
                cxt.fillRect(0, 0, canvas.width, winHeight)
            }
            // 画刻度线
            for (let i = 0; i < initParams.maxScale; i++) {
                cxt.beginPath()
                cxt.save()
                cxt.strokeStyle = initParams.color ? initParams.color : '#bbb'
                cxt.lineWidth = 1
                cxt.lineCap = 'round'
                const y = division * i - count * division + initParams.startGap
                cxt.moveTo(initParams.width, y)
                cxt.lineTo(Math.floor(initParams.width * 0.8), y)
                if (i % 5 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : '#666'
                    cxt.lineTo(Math.floor(initParams.width * 0.5), y)
                }
                if (i % 10 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : '#666'
                    cxt.font = '10px Arial'
                    cxt.fillStyle = initParams.color ? initParams.color : '#333'
                    cxt.textAlign = 'left'
                    cxt.textBaseline = 'middle'
                    cxt.lineTo(0, y)
                    cxt.fillText(String(i * division), 0, y + 8)
                }
                cxt.stroke()
                cxt.restore()
                cxt.closePath()
            }
        }
        if (window.devicePixelRatio) {
            canvas.style.transform = 'scale(' + 1 / window.devicePixelRatio + ')'
            canvas.style.transformOrigin = 'left top'
        }
        drawRuler(count)
    }
}

export default ruler
