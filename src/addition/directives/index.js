import store from '@/store'

const directives = {
    // v-permission='COMPANY_ADMIN'
    // v-permission='ADMIN'
    permission: {
        inserted(el, binding, vnode) {
            try {
                let value = binding.value || []
                const roles = store.getters.user_roles
                if (typeof value === 'string') {
                    value = [value]
                }
                if (value && value instanceof Array && value.length > 0) {
                    const permissionRoles = value
                    const hasPermission = roles.some(role => permissionRoles.includes(role))
                    if (!hasPermission) {
                        el.parentNode && el.parentNode.removeChild(el)
                    }
                } else {
                    throw new Error('need roles!')
                }
            } catch (e) {
                console.log(e)
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    }
}

export default directives
