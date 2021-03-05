import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '@/store/index.js'
import Main from '@/components/Board'
import BoardList from '@/views/BoardList'
import BoardForm from '@/views/BoardForm'
import BoardDetail from '@/views/BoardDetail'
import Login from '@/views/Login'
import PageNotFound from '@/views/PageNotFound'
import Chart from '@/views/Chart'
import Review from '@/views/Review'

Vue.use(VueRouter)

const requireAuth = () => (to, from, next) => {

  // 토큰이 없는지 여부와 role도 확인을 해야할듯..
  const currentUser = store.state.account

  if (currentUser.token !== '' && currentUser.role=='ROLE_ADMIN') { 
    return next();
  } else if (currentUser.token !== '' && currentUser.role=='ROLE_USER') {
    return next();
  }
  next('/login');
};

const routes = [
  {
    path: '/',
    alias: ['/login'], // path 두개 사용
    name: 'Login',
    component: Login
  },
  {
    path: '/board',
    name: 'Board',
    component: Main,
    beforeEnter: requireAuth(),
    children: [
      {
        path: '/board',
        name: 'BoardList',
        component: BoardList,
      },
      {
        path: 'form',
        name: 'BoardForm',
        component: BoardForm, 
        props: true
      },
      {
        path: ':boardNo',
        name: 'BoardDetail',
        component: BoardDetail
      },
      {
        path: '/chart',
        name: 'Chart',
        component: Chart
      },
      {
        path: '/review',
        name: 'Review',
        component: Review
      },
    ] 
  },
  {
    path:'*',
    redirect:'/404'
  },
  {
    path:'/404',
    component: PageNotFound
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
