import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList.vue'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

export let router = new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'GoodsList', 
      }
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/OrderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/OrderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    }
  ]
})
