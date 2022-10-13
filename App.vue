<script>
export default {
	globalData: {
		reviseTabbar() {
			const roles = uni.getStorageSync('roles') || []
			if (roles.includes('admin')) {
				uni.setTabBarItem({
					index: 2,
					visible: false
				})
			} else {
				uni.setTabBarItem({
					index: 1,
					visible: false
				})
			}
		}
	},
	onLaunch: function() {
		console.log('App Launch')
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
	position: fixed;
	top: 0%;
	width: 100%;
	height: 160px;
	z-index: -1;
}
</style>
