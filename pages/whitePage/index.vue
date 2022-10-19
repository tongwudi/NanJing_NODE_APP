<template>
	<view></view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	onLoad() {
		const token = uni.getStorageSync('token')
		if (!token) {
			this.Logout()
		} else {
			this.GetInfo()
		}
	},
	methods: {
		...mapActions(['GetInfo', 'Logout'])
	}
}
</script>

<style lang="scss"></style>
