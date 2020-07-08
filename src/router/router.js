import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './Auth-guard'
import Home from "../views/Home";
import Profile from "../views/Profile";


Vue.use(VueRouter)

  const routes = [
    {
      path: '/admin/map',
      name: 'home',
      // meta: {layout: 'start'},
      component: Home,
      // beforeEnter: AuthGuard
    },
    {
      path: '/profile',
      name: 'profile',
      // meta: {layout: 'empty'},
      component: Profile,
      // beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      // meta: {layout: 'empty'},
      component: () => import('../views/Auth/Login')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/Auth/Registration')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
