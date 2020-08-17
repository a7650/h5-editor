import settingContent from '../ui/settingContent'
import settingItem from '../ui/settingItem'
import settingRow from '../ui/settingRow'
import radioGroup from '../ui/radioGroup'
import { mapActions } from 'poster/poster.vuex'
export const commonMixin = {
    components: { settingContent, settingItem, settingRow, radioGroup },
    props: {
        item: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        dragInfo() {
            return this.item.dragInfo
        },
        wState() {
            return this.item.wState
        },
        style() {
            return this.wState.style
        }
    },
    methods: {
        ...mapActions(['updateWidgetState']),
        ...mapActions({
            'pushHistory': 'history/push'
        }),
        updateStyle(styleKey, value, pushHistory = true) {
            this.updateWidgetState({
                keyPath: 'style.' + styleKey,
                value,
                widgetId: this.item.id,
                pushHistory
            })
        }
    }
}
