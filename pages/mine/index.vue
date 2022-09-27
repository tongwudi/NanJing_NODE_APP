<template>
	<view class="container bg-top">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<m-card padding="60px 0 10px 0">
			<image src="../../static/img/avatar.png"></image>
			<view class="h1">Hi, 张三</view>
			<uni-title
				type="h3"
				align="center"
				color="#666"
				title="15005148799"
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
				<template v-slot:header>
					<uni-icons
						custom-prefix="iconfont"
						type="icon-tuichudenglu"
						color="#78D7F5"
						size="24"
					></uni-icons>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
import mCard from '../../components/m-card.vue'
export default {
	components: { mCard },
	data() {
		return {
			lockedIcon: {
				color: '#6BE2CD',
				size: '24',
				type: 'locked-filled'
			}
		}
	},
	methods: {
		logout() {
			uni.clearStorageSync()
			console.log(112)
		}
	}
}
</script>

<style lang="scss">
.container {
	padding: 10px;
	padding-top: 64px;
}
.h1 {
	margin-bottom: 8px;
	font-size: 24px;
	font-weight: bold;
	text-align: center;
}
image {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60px;
	height: 80px;
}
.uni-list {
	margin-top: 15px;
}
/deep/ {
	.uni-list-item__container {
		padding: 15px 10px;
	}
	.uni-list-item__content-title {
		font-size: 16px;
		color: #333;
	}
	.uni-list-item__icon-img {
		margin-right: 0;
	}
}
.icon-tuichudenglu {
	margin-right: 9px;
}
</style>
