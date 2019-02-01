// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(VueLazyLoad,{
	loading:"/static/loading-svg/loading-bars.svg"
});

Vue.use(infiniteScroll)
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		nickName:'',
		cartCount:0
	},
	mutations:{
		// update user info
		updateUserInfo(state,nickName){
			state.nickName = nickName;
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount;
		}
	}
});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
