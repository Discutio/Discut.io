import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login', 
      component: () => import('./views/Login.vue')
    },
    {
      path: '/logout',
      name: 'logout', 
      component: () => import('./views/Logout.vue')
    },
    {
      path: '/meet',
      name: 'meet', 
      component: () => import('./views/Meet.vue')
    },
    {
      path: '/add',
      name: 'add', 
      component: () => import('./views/Add.vue')
    }, 
    {
      path: '/topic/:user/:slug',
      name: 'discussion', 
      component: () => import('./views/Discussion.vue')
    },
      {
          path: '/poll/:user/:slug',
          name: 'poll',
          component: () => import('./views/Poll2.vue')
      },
    {
      path: '/tag/:tag',
      name: 'tag', 
      component: () => import('./views/Tag.vue')
    },
    {
      path: '/tags', 
      name: 'tags',    
      component: () => import('./views/Tags.vue')
    } 
  ]
})
