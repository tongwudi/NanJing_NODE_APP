<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="navbar-placeholder"></view>

		<m-card padding="120rpx 40rpx 20rpx">
			<view class="avatar" @click="uploadAvatar">
				<image :src="userInfo.avatar" v-if="userInfo.avatar"></image>
				<image src="@/static/img/avatar.png" v-else></image>
			</view>
			<view class="h1">Hi~ {{ userInfo.nickName }}</view>
			<uni-title
				type="h3"
				align="center"
				color="#666"
				:title="userInfo.phonenumber"
			></uni-title>
		</m-card>

		<uni-list :border="false">
			<uni-list-item
				showExtraIcon
				showArrow
				clickable
				title="修改密码"
				to="../login/forgot-pwd"
				:border="false"
				:extraIcon="lockedIcon"
			/>
			<uni-list-item
				showExtraIcon
				showArrow
				clickable
				title="隐私政策"
				to="./privacy-policy"
				:border="false"
				:extraIcon="lockedIcon"
			/>
			<uni-list-item
				showExtraIcon
				showArrow
				clickable
				title="退出登录"
				:border="false"
				@click="logout"
			>
				<template #header>
					<view class="uni-list-item__header">
						<uni-icons
							custom-prefix="iconfont"
							type="icon-tuichudenglu"
							color="#78D7F5"
							size="22"
						></uni-icons>
					</view>
				</template>
			</uni-list-item>
		</uni-list>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				content="确定要退出登录吗？"
				@confirm="dialogConfirm"
			></uni-popup-dialog>
		</uni-popup>

		<m-tabbar />
	</view>
</template>

<script>
import http from '@/utils/request.js'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
	data() {
		return {
			lockedIcon: {
				color: '#6BE2CD',
				size: '22',
				type: 'locked-filled'
			},
			userInfo: {}
		}
	},
	onLoad() {
		uni.hideTabBar()

		const userInfo = uni.getStorageSync('userInfo')
		this.userInfo = userInfo
	},
	computed: {
		...mapState(['token'])
	},
	methods: {
		...mapMutations(['SET_USERINFO']),
		...mapActions(['Logout']),
		uploadAvatar() {
			uni.chooseImage({
				count: 1,
				success: chooseImageRes => {
					const { baseUrl } = http.getConfig()
					const { tempFilePaths } = chooseImageRes

					uni.uploadFile({
						url: baseUrl + '/system/user/profile/avatar',
						header: {
							Authorization: this.token
						},
						filePath: tempFilePaths[0],
						name: 'avatarfile',
						timeout: 20000, // 超时时间 20s
						success: res => {
							const data = JSON.parse(res.data)
							this.userInfo.avatar = data.imgUrl
							this.SET_USERINFO(this.userInfo)
						},
						fail: err => {
							uni.showToast({
								title: '头像上传失败',
								icon: 'error'
							})
						}
					})
				}
			})
		},
		logout() {
			this.$refs.popup.open()
		},
		dialogConfirm(value) {
			this.$refs.popup.close()
			this.Logout()
			uni.reLaunch({ url: '/pages/login/login' })
		}
	}
}
</script>

<style lang="scss">
.card {
	margin: 60rpx 40rpx 0 !important;
}
.h1 {
	margin-bottom: 16rpx;
	font-size: 48rpx;
	font-weight: bold;
	text-align: center;
}
.avatar {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 150rpx;
	height: 150rpx;
	border-radius: 50%;
	box-shadow: 0px 0px 0px 1px #e7edf0; // 0.5px线
	background-color: #fff;
	overflow: hidden;
	image {
		width: 100%;
		height: 100%;
	}
}
.uni-list {
	margin-top: 40rpx;
}
/deep/ {
	.uni-list-item__container {
		padding: 30rpx 40rpx;
	}
	.uni-list-item__content-title {
		font-size: 30rpx !important;
		color: #333 !important;
	}
	.uni-list-item__icon-img {
		margin-right: 0;
	}
	.uni-icon-wrapper {
		font-size: 36rpx !important;
		padding: 0 40rpx;
	}
}
.icon-tuichudenglu {
	margin-right: 18rpx;
}
</style>
