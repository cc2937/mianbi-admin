import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import BaseLayout from '../layouts/Base.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Whiteboard from '../views/Whiteboard.vue'
import NoteList from '../views/NoteList.vue'
import NoteCreate from '../views/NoteCreate.vue'
import NoteEdit from '../views/NoteEdit.vue'
import NoteDetails from '../views/NoteDetails.vue'

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
        {
          path: 'notes',
          name: 'Notes',
          component: NoteList,
        },
        {
          path: 'notes/create',
          name: 'NoteCreate',
          component: NoteCreate,
        },
        {
          path: 'notes/:id/edit',
          name: 'NoteEdit',
          component: NoteEdit,
        },
        {
          path: 'notes/:id',
          name: 'NoteDetails',
          component: NoteDetails,
        },
      ],
    },
  ]
})

export default router
