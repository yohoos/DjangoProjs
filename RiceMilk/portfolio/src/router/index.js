import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import WifiMap from '@/components/WifiMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/map',
      name: 'WifiMap',
      component: WifiMap
    }
  ]
})
