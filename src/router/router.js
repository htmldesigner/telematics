import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home";
import Login from "../components/Login";
import AuthGuard from './Auth-guard'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/map',
      name: 'home',
      component: Home,
      beforeEnter: AuthGuard
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV,
  routes
})

export default router
