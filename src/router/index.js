import Vue from 'vue'
import Router from 'vue-router'
import Authorize from '../module/authorize/views/Authorize'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/authorize'
    },
    {
      path: '/authorize',
      name: 'authorize',
      component: Authorize
    }
  ],
  // mode 设置为history ，去掉地址栏上的 # 号
  mode: "history"
})
