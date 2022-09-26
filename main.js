import Vue from 'vue'
import App from './App'

import store from './store'
Vue.prototype.$store = store

import request from './config/request.js'
// // 挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法
Vue.prototype.$request = request;

import mNav from '@/components/m-nav.vue'
Vue.component('m-nav', mNav)
import mCard from '@/components/m-card.vue'
Vue.component('m-card', mCard)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
