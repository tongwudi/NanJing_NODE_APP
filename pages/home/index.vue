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
			index: !roles?.includes('admin') ? 2 : 1,
			visible: true
		})
	},
	methods: {}
}
</script>

<style></style>
