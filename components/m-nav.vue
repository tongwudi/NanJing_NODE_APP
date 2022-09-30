<template>
	<uni-nav-bar
		color="#1F1F39"
		backgroundColor="transparent"
		:leftIcon="leftIcon"
		:rightIcon="rightIcon"
		:title="title"
		:border="false"
		@clickLeft="back"
		@clickRight="scanCode"
	/>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		leftIcon: {
			type: String,
			default: ''
		},
		rightIcon: {
			type: String,
			default: ''
		}
	},
	methods: {
		back() {
			if (!this.leftIcon) return
			uni.navigateBack({ delta: 1 })
		},
		scanCode() {
			if (!this.rightIcon) return
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
	font-size: 36rpx !important;
	font-weight: 700;
}
</style>
