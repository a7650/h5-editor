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
                formName: '活动表单',
                submitButtonText: '提交',
                submitButtonStyle: {
                    color: '#000',
                    fontSize: '14px', // px
                    borderRadius: '4px', // px
                    backgroundColor: '#e6e6e6'
                }
            }
        }, config)
        super(config)
    }
}
