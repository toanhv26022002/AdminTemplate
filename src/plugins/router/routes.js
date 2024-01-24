import { requiredAuth } from '../middleware/auth'

export const routes = [
  { path: '/', redirect: '/dashboard' },
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

          // {
          //   path: 'add',
          //   name: 'add',
          //   component: () => import('@/views/collections/create-collection.vue'),
          // },
          // {
          //   path: ':collection/update',
          //   name: 'update',
          //   component: () => import('@/views/collections/update-collection.vue'),
          // },
        ],
      },
      {
        path: 'items',
        name: 'items',
        component: () => import('@/views/items/item-view.vue'),
      },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
 
]
