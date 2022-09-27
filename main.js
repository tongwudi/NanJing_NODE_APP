import Vue from 'vue'
import App from './App'

import store from './store'
Vue.prototype.$store = store

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
