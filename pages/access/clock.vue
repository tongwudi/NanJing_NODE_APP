<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<m-nav left-icon="left" title="进出机房申请"></m-nav>

		<view class="content">
			<m-card title="机房信息" :padding="25">
				<view class="card-content__body">
					<view>
						<text>行政区域</text>
						<text>{{ roomInfo.roomCounty }}</text>
					</view>
					<view>
						<text>机房名称</text>
						<text>{{ roomInfo.roomName }}</text>
					</view>
					<view>
						<text>业务级别</text>
						<text>{{ roomInfo.roomBusinessLevel }}</text>
					</view>
				</view>
			</m-card>

			<m-card
				title="访问详情"
				:padding="25"
				v-if="JSON.stringify(visitInfo) !== '{}'"
			>
				<view class="card-content__body">
					<view class="applicant">
						<image :src="visitInfo.userAvatar" v-if="visitInfo.userAvatar"></image>
						<image src="@/static/img/avatar.png" v-else></image>
						<view class="applicant-name">
							<text>申请人</text>
							<text>{{ visitInfo.userName }}</text>
						</view>
					</view>
					<view>
						<text>访问时间</text>
						<text>{{ visitInfo.accessTime }}</text>
					</view>
				</view>
			</m-card>

			<view class="staff-list" v-if="staffList.length > 0">
				<m-card
					class="staff"
					v-for="(item, index) in staffList"
					:key="index"
					:title="'进出人员' + (index + 1)"
				>
					<view class="card-content__body">
						<view>
							<text>姓名</text>
							<text>{{ item.applyName }}</text>
						</view>
						<view>
							<text>联系电话</text>
							<text>{{ item.applyContract }}</text>
						</view>
						<view>
							<text>身份号码</text>
							<text>{{ item.applyIdCard }}</text>
						</view>
					</view>
				</m-card>
			</view>

			<m-card
				title="验证码"
				:padding="25"
				v-if="JSON.stringify(visitInfo) === '{}'"
			>
				<view class="card-content__body">
					<view class="code-row">
						<view class="row-label">请输入验证码</view>
						<uni-easyinput v-model="code" />
					</view>

					<view class="btn-row">
						<button type="primary" @click="submitValid">
							提交验证
						</button>
					</view>
				</view>
			</m-card>

			<view class="btn-row" v-if="taskId && !isClock">
				<button type="primary" @click="onClock">到达打卡</button>
			</view>
		</view>
	</view>
</template>

<script>
import { getRoomInfo, verifyCode, getVisitInfo, completeTask } from '@/api/index.js'
export default {
	data() {
		return {
			taskId: '',
			code: '',
			roomInfo: {},
			visitInfo: {},
			staffList: [],
			isClock: false
		}
	},
	onLoad(option) {
		this.roomId = option.roomId
		this.getInfo()
	},
	methods: {
		async getInfo() {
			const res = await getRoomInfo({ roomId: this.roomId })
			if (res.code === 200) {
				this.roomInfo = res.data
			}
		},
		async submitValid() {
			if (this.code == '') {
				uni.showToast({
					title: '验证码不能为空',
					icon: 'none'
				})
				return
			}
			const params = {
				roomId: this.roomId,
				code: this.code
			}
			const res = await verifyCode(params)
			if (res.code === 200) {
				uni.showToast({
					title: '验证成功',
					icon: 'success'
				})
				const { code, data } = await getVisitInfo({ processInstanceId: res.msg })
				if (code === 200) {
					console.log(data);
					this.visitInfo = data.visitInfo
					this.staffList = data.peopleList
					this.taskId = data.taskId
				}
			}
		},
		async onClock() {
			const params = {
				taskId: this.taskId,
				status: 'yes' // 审批状态(yes-通过 no-驳回)
			}
			const res = await completeTask(params)
			if (res.code === 200) {
				this.isClock = true
				uni.showToast({
					title: '打卡成功',
					icon: 'success'
				})
			}
		}
	}
}
</script>

<style lang="scss">
.code-row {
	flex-direction: column;
	margin: 0 50rpx;
	.row-label {
		font-size: 32rpx;
		margin-bottom: 40rpx;
		text-align: center;
		color: #666;
	}
	.uni-easyinput {
		margin-bottom: 48rpx;
	}
}
</style>
