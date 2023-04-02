import { hasToken, logout } from '@/api';
import { PATHS } from '@/types/types';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const NotFound = () => import('../components/NotFound.vue');
const LoginView = () => import('../views/LoginView.vue');
const TopicsView = () => import('../views/TopicsView.vue');
const ChatView = () => import('../views/ChatView.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:path(.*)',
    component: NotFound,
  },
  {
    path: '/',
    redirect: PATHS.Topics,
  },
  {
    path: PATHS.Login,
    name: 'login',
    component: LoginView,
    beforeEnter: () => {
      logout();
    },
  },
  {
    path: PATHS.Topics,
    name: 'topics',
    component: TopicsView,
    children: [
      {
        path: `${PATHS.Chat}/:id`,
        name: 'chat',
        component: ChatView,
      },
      {
        path: `${PATHS.Chat}/:id(.*)*`,
        name: 'NotFound',
        component: NotFound,
      },
    ],
  },
  {
    path: PATHS.Logout,
    redirect: PATHS.Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async to => {
  if (to.name !== 'login' && !hasToken()) {
    return PATHS.Login;
  }
});

export default router;
