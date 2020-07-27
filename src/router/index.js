import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/posterEditor'
  },
  {
    path: '/posterEditor',
    name: 'posterEditor',
    component: () => import('@/views/posterEditor')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
