import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request.js'
import { getInfo } from '@/api/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',
		roles: []
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		SET_ROLES(state, roles) {
			state.roles = roles || []
			uni.setStorageSync('roles', roles)
		}
	},
	actions: {
		async GetInfo(ctx) {
			const res = await getInfo()
			ctx.commit('SET_ROLES', res.roles)
		}
	}
})

export default store
