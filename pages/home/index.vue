<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<view class="map" v-if="showMap">
			<view class="fixed-nav" @tap="showMap = false">
				<uni-icons type="back" size="20"></uni-icons>
			</view>

			<map
				:latitude="gmapObj.latitude"
				:longitude="gmapObj.longitude"
				:scale="gmapObj.scale"
				:markers="gmapObj.markers"
			/>
		</view>

		<view class="chart" v-if="!showMap">
			<image class="bg-top" src="@/static/img/bg-top.png"></image>

			<qiun-data-charts
				type="map"
				:opts="opts"
				:chartData="chartData"
				@getIndex="getIndex"
			/>

			<view class="fixed-box">
				<view class="node">
					<text>{{ countObj.first || 0 }}</text>
					<text>一类节点</text>
				</view>
				<view class="node">
					<text>{{ countObj.second || 0 }}</text>
					<text>二类节点</text>
				</view>
				<view class="node">
					<text>{{ countObj.third || 0 }}</text>
					<text>三类节点</text>
				</view>
			</view>
		</view>

		<m-tabbar v-if="!showMap" />
	</view>
</template>

<script>
const njData = require('@/mockdata/NanJing.json')
import { getRoomMap, getTypeCount } from '@/api/index.js'
export default {
	data() {
		return {
			showMap: false,
			countObj: {},
			chartData: null,
			colorArr: [
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
			opts: {
				color: [],
				extra: {
					map: {
						mercator: true,
						borderColor: '#bababa',
						fillOpacity: 1
					},
					tooltip: {
						showBox: false
					}
				}
			},
			currentIdx: -1,
			gmapObj: {
				// 经度 范围 -180 ~ 180
				longitude: 0,
				// 纬度 范围 -90 ~ 90
				latitude: 0,
				// 缩放级别
				scale: 14,
				// 标记点
				markers: []
			}
		}
	},
	onLoad() {
		uni.hideTabBar()
	},
	onReady() {
		this.chartData = { series: njData.features }
		// 获取全部分类节点数
		this.getNodeCount()
	},
	watch: {
		showMap: {
			handler(val) {
				if (!val) {
					const colorArr = Array.from(this.colorArr)
					this.currentIdx !== -1 && (colorArr[this.currentIdx] = '#FACC14')
					this.opts.color = colorArr
				}
			},
			immediate: true
		}
	},
	methods: {
		getIndex(e) {
			if (e.currentIndex === this.currentIdx) {
				return
			}

			this.currentIdx = e.currentIndex
			const { series } = this.chartData
			const name = series[this.currentIdx]?.properties.name || ''

			if (this.currentIdx === -1) {
				const colorArr = Array.from(this.colorArr)
				this.opts.color = colorArr
			}

			Promise.all([
				this.getNodeCount(name),
				this.currentIdx !== -1 && this.getRoomInfo(name)
			]).then(() => {
				this.currentIdx !== -1 && (this.showMap = true)
			})
		},
		async getRoomInfo(county) {
			const { data } = await getRoomMap({ county })
			this.gmapObj.longitude = data[0].roomLon
			this.gmapObj.latitude = data[0].roomLat
			this.gmapObj.markers = data.map(item => {
				return {
					id: +item.roomId,
					longitude: +item.roomLon,
					latitude: +item.roomLat,
					iconPath: '/static/img/location.png',
					width: 40,
					height: 40,
					callout: {
						display: 'ALWAYS',
						content: item.roomName
					}
				}
			})
		},
		async getNodeCount(county) {
			const { data } = await getTypeCount({ county })
			const { first, second, third } = data
			this.countObj = { first, second, third }
		}
	}
}
</script>

<style lang="scss">
.fixed-nav {
	width: 60rpx;
	height: 60rpx;
	line-height: 60rpx;
	position: fixed;
	left: 20rpx;
	top: 20rpx;
	font-weight: bold;
	border: 4rpx solid;
	border-radius: 50%;
	text-align: center;
	z-index: 2;
}
.map,
map {
	width: 100%;
	height: 100%;
}
.chart {
	flex: 1;
	padding: 40rpx 0;
}
.fixed-box {
	width: 100%;
	position: fixed;
	top: 40rpx;
	display: flex;
	justify-content: space-evenly;
	.node {
		width: 140rpx;
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
