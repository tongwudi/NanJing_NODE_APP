<template>
	<uni-nav-bar
		v-bind="$attrs"
		color="#1F1F39"
		backgroundColor="transparent"
		:border="false"
		@clickLeft="back"
		@clickRight="scanCode"
	/>
</template>

<script>
export default {
	inheritAttrs: false, // 不在组件根元素 dom 上显示属性
	methods: {
		back() {
			uni.navigateBack({ delta: 1 })
		},
		scanCode() {
			// 允许从相机和相册扫码
			uni.scanCode({
				success: res => {
					uni.navigateTo({ url: '' })
					console.log('条码类型：' + res.scanType)
					console.log('条码内容：' + res.result)
				}
			})
		}
	}
}
</script>

<style lang="scss">
/deep/ .uni-navbar__content_view,
/deep/ .uni-nav-bar-text {
	font-size: 18px !important;
	font-weight: 700;
}
</style>
