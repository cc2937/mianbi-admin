import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import BaseLayout from '../layouts/Base.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Whiteboard from '../views/Whiteboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: Home,
        },
        {
          path: 'users',
          name: 'User',
          component: User,
        },
        {
          path: 'whiteboards',
          name: 'Whiteboard',
          component: Whiteboard,
        },
      ],
    },
  ]
})

export default router
