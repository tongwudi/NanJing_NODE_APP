<template>
	<view class="tabbar-bottom">
		<view class="tabbar">
			<view class="border-top"></view>
			<view
				class="tabbar_item"
				v-for="(item, index) in list"
				:key="index"
				@click="switchTab(item.pagePath, index)"
			>
				<view class="tabbar-item__icon">
					<img
						:src="item.selectedIconPath"
						v-if="tabbarIdx === index"
					/>
					<img :src="item.iconPath" v-else />
				</view>
				<text
					:class="[
						'tabbar-item__text',
						{ active: tabbarIdx === index }
					]"
				>
					{{ item.text }}
				</text>
			</view>
		</view>
		<view class="tabbar_placeholder"></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
	computed: {
		...mapState(['roles', 'tabbarIdx']),
		list() {
			/**
			 * @admin 管理员
			 * @common 访客/申请人
			 * @manager 项目经理
			 * @network 网格员
			 * @maintaining 代维
			 * @director 经理
			 **/
			const pagePath =
				!this.roles.includes('admin') &&
				(this.roles.includes('manager') ||
				this.roles.includes('network') ||
				this.roles.includes('maintaining'))
					? 'pages/access/approval'
					: 'pages/access/apply'

			return [
				{
					pagePath: 'pages/home/index',
					iconPath: 'static/img/home.png',
					selectedIconPath: 'static/img/homeHL.png',
					text: '首页'
				},
				{
					pagePath,
					iconPath: 'static/img/access.png',
					selectedIconPath: 'static/img/accessHL.png',
					text: '进出机房'
				},
				{
					pagePath: 'pages/mine/index',
					iconPath: 'static/img/mine.png',
					selectedIconPath: 'static/img/mineHL.png',
					text: '我的'
				}
			]
		}
	},
	methods: {
		...mapMutations(['SET_TABBARIDX']),
		switchTab(path, index) {
			if (index === this.tabbarIdx) return
			const url = '/' + path
			this.SET_TABBARIDX(index)
			uni.switchTab({ url })
		}
	}
}
</script>

<style lang="scss">
$bar-height: 50px;

.tabbar {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: $bar-height;
	background-color: #fff;
	display: flex;
	.border-top {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 1px;
		transform: scaleY(0.5);
		background-color: rgba(0, 0, 0, 0.33);
	}
	.tabbar_item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.tabbar-item__icon {
		width: 22px;
		height: 22px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.tabbar-item__text {
		color: #869aae;
		margin-top: 3px;
		font-size: 12px;
	}
	.active {
		color: #00d6d6;
	}
}

.tabbar_placeholder {
	height: $bar-height;
}
</style>
