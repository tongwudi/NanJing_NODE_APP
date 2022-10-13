import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request.js'
import {
	getInfo
} from '@/api/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('token'),
		roles: uni.getStorageSync('roles') || [],
		userInfo: uni.getStorageSync('userInfo') || {}
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		SET_ROLES(state, roles) {
			state.roles = roles || []
			uni.setStorageSync('roles', roles)
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo || {}
			uni.setStorageSync('userInfo', userInfo)
		},
		CLEAR_TOKEN(state) {
			state.token = ''
			uni.removeStorageSync('token')
		},
		CLEAR_ROLES(state) {
			state.roles = []
			uni.removeStorageSync('roles')
		},
		CLEAR_USERINFO(state) {
			state.userInfo = {}
			uni.removeStorageSync('userInfo')
		}
	},
	actions: {
		async GetInfo(ctx) {
			const { code, roles, user } = await getInfo()
			if (code === 200) {
				ctx.commit('SET_ROLES', roles)
				ctx.commit('SET_USERINFO', user)
			}
		},
		Logout(ctx) {
			ctx.commit('CLEAR_TOKEN')
			ctx.commit('CLEAR_ROLES')
			ctx.commit('CLEAR_USERINFO')
		}
	}
})

export default store
