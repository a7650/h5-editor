import { Widget } from 'poster/widgetConstructor'
import _merge from 'lodash/merge'

export default class ActivityFormWidget extends Widget {
    constructor(config) {
        config = _merge({
            type: 'form',
            typeLabel: '活动表单',
            componentName: 'plugin-activity-form',
            icon: 'el-icon-s-order',
            replicable: false, // 表单只能有一个 不可复制
            wState: {
                formName: '活动表单'
            }
        }, config)
        super(config)
    }
}
