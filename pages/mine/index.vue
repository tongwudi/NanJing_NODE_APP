<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="mx10">
			<m-card padding="60px 0 10px 0">
				<image class="avatar" src="@/static/img/avatar.png"></image>
				<view class="h1">Hi, {{ userInfo.nickName }}</view>
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
								size="24"
							></uni-icons>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				content="确定要退出登录吗？"
				@confirm="dialogConfirm"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import mCard from '../../components/m-card.vue'
export default {
	components: { mCard },
	data() {
		return {
			lockedIcon: {
				color: '#6BE2CD',
				size: '24',
				type: 'locked-filled'
			},
			userInfo: {}
		}
	},
	onLoad() {
		const { nickName, phonenumber } = uni.getStorageSync('userInfo')
		this.userInfo = { nickName, phonenumber }
	},
	onShow() {
		this.REVISE_TABBAR()
	},
	methods: {
		...mapMutations(['REVISE_TABBAR']),
		...mapActions(['Logout']),
		logout() {
			this.$refs.popup.open()
		},
		dialogConfirm(value) {
			this.$refs.popup.close()
			this.Logout()
			uni.reLaunch({
				url: '/pages/login/login'
			})
		}
	}
}
</script>

<style lang="scss">
.container {
	padding-top: 128rpx;
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
	width: 120rpx;
	height: 160rpx;
}
.mx10 {
	margin: 0 20rpx;
}
.uni-list {
	margin-top: 30rpx;
}
/deep/ {
	.uni-list-item__container {
		padding: 30rpx 20rpx;
	}
	.uni-list-item__content-title {
		font-size: 32rpx !important;
		color: #333 !important;
	}
	.uni-list-item__icon-img {
		margin-right: 0;
	}
}
.icon-tuichudenglu {
	margin-right: 18rpx;
}
</style>
