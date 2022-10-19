<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
		uni.hideTabBar()
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
@import '/static/style/common.scss';
@import '/static/style/iconfont.css';

/*每个页面公共css */
page {
	min-height: 100%;
	height: auto;
	display: flex;
	font-size: 28rpx;
	color: #333;
}

.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}

.container {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.bg-top {
	position: fixed;
	top: 0%;
	width: 100%;
	height: 160px;
	z-index: -1;
}
</style>
