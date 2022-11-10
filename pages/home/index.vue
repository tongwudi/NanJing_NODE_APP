<template>
	<view class="container">
		<view class="map">
			<view class="charts-box">
				<qiun-data-charts
					type="map"
					:opts="opts"
					:chartData="chartData"
				/>
			</view>
		</view>

		<view class="fixed-box">
			<view class="node">
				<text>5</text>
				<text>一类节点</text>
			</view>
			<view class="node">
				<text>5</text>
				<text>二类节点</text>
			</view>
			<view class="node">
				<text>5</text>
				<text>三类节点</text>
			</view>
			<view class="node">
				<text>5</text>
				<text>四类节点</text>
			</view>
		</view>
		<m-tabbar />
	</view>
</template>

<script>
const njData = require('@/mockdata/NanJing.json')
export default {
	data() {
		return {
			chartData: {},
			opts: {
				color: [
					'#e4f2b6', // 玄武
					'#bdfff4', // 秦淮
					'#cbd4d4', // 建邺
					'#bdeaf4', // 鼓楼
					'#faffdd', // 浦口
					'#f1e4cd', // 栖霞
					'#f5dcec', // 雨花
					'#e3f2e8', // 江宁
					'#E3F7FF', // 六合
					'#edeae4', // 溧水
					'#fff5c3' // 高淳
				],
				extra: {
					map: {
						mercator: true,
						borderColor: '#bababa',
						fillOpacity: 1
					}
				}
			}
		}
	},
	onLoad() {
		uni.hideTabBar()
	},
	onReady() {
		this.chartData = { series: njData.features }
	}
}
</script>

<style lang="scss">
.map {
	flex: 1;
	padding: 40rpx 0;
	.charts-box {
		width: 100%;
		height: 100%;
	}
}
.fixed-box {
	width: 100%;
	position: fixed;
	top: 40rpx;
	display: flex;
	justify-content: space-evenly;
	.node {
		width: 130rpx;
		height: 120rpx;
		padding: 10rpx;
		text-align: center;
		color: #999999;
		border: 1px solid #c1daf1;
		border-radius: 12rpx;
		background-color: #fafff4;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&:first-child text:first-child {
			color: #f58686;
		}
		&:nth-child(2) text:first-child {
			color: #daa2ee;
		}
		&:nth-child(3) text:first-child {
			color: #aeda50;
		}
		&:last-child text:first-child {
			color: #39a0ff;
		}
		text:first-child {
			margin-bottom: 8rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
}
</style>
