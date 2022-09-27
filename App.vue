<script>
export default {
	onLaunch: function() {
		console.log('App Launch')

		let token = uni.getStorageSync('token')
		uni.redirectTo({
			url: token ? 'pages/home/index' : 'pages/login/login'
		})
	},
	onShow: function() {
		console.log('App Show')
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
	font-size: 14px;
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
	background-image: url(/static/img/bg-top.png);
	background-size: 100% 160px;
	background-repeat: no-repeat;
}
</style>
