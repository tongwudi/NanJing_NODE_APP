import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request.js'
import { getInfo } from '@/api/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('token'),
		roles: uni.getStorageSync('roles') || [],
		userInfo: uni.getStorageSync('userInfo') || {},
		tabbarIdx: uni.getStorageSync('tabbarIdx') || 2
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
		SET_TABBARIDX(state, idx) {
			state.tabbarIdx = idx
			uni.setStorageSync('tabbarIdx', idx)
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
		},
		CLEAR_TABBARIDX(state) {
			state.tabbarIdx = 0
			uni.removeStorageSync('tabbarIdx')
		},
	},
	actions: {
		async GetInfo(ctx) {
			const { code, roles, user } = await getInfo()
			if (code === 200) {
				uni.hideTabBar()
				ctx.commit('SET_ROLES', roles)
				ctx.commit('SET_USERINFO', user)
				ctx.commit('SET_TABBARIDX', 2)
				uni.switchTab({ url: '/pages/mine/index' })
			}
		},
		Logout(ctx) {
			ctx.commit('CLEAR_TOKEN')
			ctx.commit('CLEAR_ROLES')
			ctx.commit('CLEAR_USERINFO')
			ctx.commit('CLEAR_TABBARIDX')
			uni.reLaunch({ url: '/pages/login/login' })
		}
	}
})

export default store
