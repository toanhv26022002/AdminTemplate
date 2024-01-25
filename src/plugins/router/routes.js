import { requiredAuth } from '../middleware/auth'

export const routes = [
  { path: '/', redirect: '/collections' },
  {
    path: "/login-by-token",
    name: "loginByToken",
    component: () => import("@/pages/loginByToken.vue"),
  },
  {
    path: "/403",
    component: () => import("@/pages/[...error].vue"),
    name: "forbidden",
  },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    beforeEnter: requiredAuth(),
    children: [
      {
        path: 'collections',
        component: () => import('@/views/collections/collection-view.vue'),
        children: [
          {
            path: '',
            name: '/',
            component: () => import('@/views/collections/collection-table.vue'),
          },

          {
            path: 'add',
            name: 'add',
            component: () => import('@/views/collections/create-collection.vue'),
          },
          {
            path: ':collection/update',
            name: 'update',
            component: () => import('@/views/collections/update-collection.vue'),
          },
        ],
      },
      {
        path: 'items',
        name: 'items',
        component: () => import('@/views/items/item-view.vue'),
      },
      {
        
          path: 'map',
          name: 'map',
          component: () => import('@/views/map/map-view.vue'),
        
      }
    
     
    ],
  },
 
]
