import { createRouter, createWebHistory } from 'vue-router'
// import ConfigView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'config',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/documents',
      name: 'list-documents',
      component: () => import('@/views/DocListView.vue'),
    },
    {
      path: '/documents/:id',
      name: 'documents_detail',
      component: () => import('../views/DocDetailView.vue'),
    },
    {
      path: '/upload_documents',
      name: 'upload-documents',
      component: () => import('@/views/DocUploadView.vue'),
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
