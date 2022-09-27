<template>
	<view></view>
</template>

<script>
export default {
	data() {
		return {}
	},
	onLoad() {
		let roles = uni.getStorageSync('roles')
		uni.setTabBarItem({
			// index: !roles?.includes('admin') ? 2 : 1,
			index: !roles?.includes('admin') ? 1 : 2,
			visible: true
		})
	},
	methods: {}
}
</script>

<style></style>
