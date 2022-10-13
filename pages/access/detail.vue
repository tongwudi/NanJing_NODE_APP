<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<m-nav left-icon="left" right-icon="scan" title="进出机房申请"></m-nav>

		<view class="content">
			<m-card :padding="25">
				<view class="card-content__body">
					<view>
						<text>行政区域</text>
						<text class="bold">{{ info.roomCounty }}</text>
					</view>
					<view>
						<text>机房名称</text>
						<text class="bold">{{ info.roomName }}</text>
					</view>
					<view>
						<text>申请单位</text>
						<text class="bold">{{ info.applyCompany }}</text>
					</view>
					<view>
						<text>项目经理</text>
						<text class="bold">{{ info.proManagerName }}</text>
					</view>
					<view>
						<text>申请时间</text>
						<text class="bold">{{ info.applyTime }}</text>
					</view>
					<view>
						<text>实施时间</text>
						<text class="bold">{{ info.workTime }}</text>
					</view>
					<view>
						<text>所属项目</text>
						<text class="bold">{{ info.belongProject }}</text>
					</view>
					<view>
						<text>所属专业</text>
						<text class="bold">{{ info.belongMajor }}</text>
					</view>
					<view>
						<text>施工单位</text>
						<text class="bold">{{ info.workCompany }}</text>
					</view>
					<view>
						<text>进出类型</text>
						<text class="bold">{{ info.applyTypeName }}</text>
					</view>
					<view>
						<text>施工内容</text>
						<text class="wrap bold">{{ info.workNote }}</text>
					</view>
					<view>
						<text>附件</text>
						<text>XXX</text>
					</view>
				</view>
			</m-card>

			<view class="staff-list">
				<m-card
					class="staff"
					v-for="(item, index) in staffList"
					:key="index"
					:title="'进出人员' + index"
					:padding="25"
				>
					<view class="card-content__body">
						<view>
							<text>姓名</text>
							<text class="bold">{{ item.applyName }}</text>
						</view>
						<view>
							<text>联系电话</text>
							<text class="bold">{{ item.applyContract }}</text>
						</view>
						<view>
							<text>身份号码</text>
							<text class="bold">{{ item.applyIdCard }}</text>
						</view>
					</view>
				</m-card>
			</view>

			<m-card class="timeline" title="流程" :padding="25">
				<view class="card-content__body">
					<view
						class="timeline-item"
						v-for="(item, index) in processList"
						:key="index"
					>
						<view class="item-info">
							<view class="applicant-name">
								<image src="/static/logo.png"></image>
								<view class="flx-clm">
									<text>{{ item.nodeName }}</text>
									<text>{{ item.assigneeName }}</text>
								</view>
							</view>
							<view class="applicant-status flx-clm">
								<template v-if="item.approveTime">
									<!-- <text :class="[renderStatusColor(index)]">
										{{ index | filterStatusText }}
									</text> -->
									<text>{{ item.nodeName }}</text>
									<uni-dateformat :date="item.approveTime"></uni-dateformat>
									<!-- <text>{{ item.approveTime }}</text> -->
								</template>
								<text v-else class="unapproved">未开始</text>
							</view>
						</view>
						<view class="item-line"></view>
					</view>
				</view>
			</m-card>

			<m-card class="code" title="验证码" :padding="25" v-if="JSON.stringify(authCode) != '{}'">
				<view class="card-content__body">
					<view class="code-item">
						<text>验证码</text>
						<text class="bold">{{ authCode.authCode }}</text>
					</view>
					<view class="code-item">
						<text>验证码状态</text>
						<text
							class="code-status"
							:class="[renderCodeStatusBgColor(authCode.value)]"
						>
							{{ authCode.status }}
						</text>
					</view>
				</view>
			</m-card>
			<!-- 访客离开 -->
			<view class="btn-row" v-if="roles.includes('admin') && processStatus === '访客离开'">
				<button type="primary" @click="clockOut">离开打卡</button>
			</view>
			<!-- 项目经理/网格员审核 -->
			<view class="btn-row" v-else-if="(processStatus === '项目经理审批' || processStatus === '网络员审批') && !roles.includes('admin')">
				<button type="warn" @click="rejectClick">驳回</button>
				<button type="primary" @click="passClick">通过</button>
			</view>
			<!-- 代维已办/代维已确认 -->
			<view class="btn-row" v-else-if="(processStatus === '代维已办' || processStatus === '代维已确认') && !roles.includes('admin')">
				<button type="primary" @click="passClick">确认</button>
			</view>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				:content="popupText"
				@confirm="dialogConfirm"
			></uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog
				mode="input"
				title="驳回原因"
				placeholder="请填写驳回理由"
				@confirm="dialogInputConfirm"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import { viewTask, completeTask } from '@/api/index.js'
export default {
	data() {
		return {
			processInstanceId: '',
			popupText: '',
			info: {},
			staffList: [],
			processList: [],
			taskId: '',
			processStatus: '',
			authCode: {}
		}
	},
	computed: {
		...mapState(['roles'])
	},
	async onLoad(params) {
		this.processInstanceId = params.id

		uni.showLoading({
			mask: true,
			title: '加载中'
		})
		await this.getDetail()
		uni.hideLoading()
	},
	methods: {
		renderCodeStatusBgColor(index) {
			if (index == 1) {
				return 'status-yjh'
			} else if (index == 2) {
				return 'status-ysx'
			} else {
				return 'status-djh'
			}
		},
		async getDetail() {
			const params = {
				processInstanceId: this.processInstanceId
			}
			const res = await viewTask(params)
			const { data, code } = res
			if (code === 200) {
				this.info = data.applyEnterRoomEntity
				this.staffList = data.jyApplyPeople
				this.processList = data.task.userList
				this.taskId = data.task.taskId
				this.processStatus = data.task.approveProcess
				this.authCode = data.authCode || {}
			}
		},
		passClick() {
			this.popupText = '确认通过审批？'
			this.$refs.popup.open()
		},
		clockOut() {
			this.popupText = '确定打卡离开吗？'
			this.$refs.popup.open()
		},
		async dialogConfirm() {
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			const params = {
				taskId: this.taskId,
				status: 'yes' // 审批状态(yes-通过 no-驳回)
			}
			const res = await completeTask(params)
			if (res.code === 200) {
				this.$refs.popup.close()
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				})
				this.getDetail()
			}
		},
		rejectClick() {
			this.$refs.inputDialog.open()
		},
		async dialogInputConfirm(value) {
			if (value === '') {
				uni.showToast({ title: '驳回原因不能为空' })
				return
			}
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			const params = {
				comment: value,
				taskId: this.taskId,
				status: 'no' // 审批状态(yes-通过 no-驳回)
			}
			const res = await completeTask(params)
			if (res.code === 200) {
				this.$refs.inputDialog.close()
				uni.showToast({
					title: '数据已驳回',
					icon: 'success'
				})
				this.getDetail()
			}
		}
	}
}
</script>

<style lang="scss">
.card-content__body > view:not(:last-child) {
	margin-bottom: 40rpx;
}

.timeline,
.staff:first-child {
	margin-top: 0;
}

.timeline-item {
	flex-direction: column;
	margin-bottom: 0 !important;
	&:last-child .item-line {
		display: none;
	}
	.item-info {
		display: flex;
		justify-content: space-between;
		.applicant-name {
			display: flex;
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
			& > view {
				margin-left: 20rpx;
				text:last-child {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
		.applicant-status {
			align-self: center;
			text-align: right;
			// color: #ff8a00;
		}
		.flx-clm {
			display: flex;
			flex-direction: column;
			color: #666;
			text {
				line-height: 40rpx;
				font-size: 24rpx;
			}
		}
	}
	.item-line {
		width: 2px;
		height: 60rpx;
		margin: 10rpx 0;
		margin-left: 40rpx;
		background-color: #dcdcdc;
	}
}

.code {
	&-item {
		line-height: 48rpx;
		padding: 0 40rpx;
		justify-content: space-between;
		text {
			&:first-child {
				width: 5em;
				text-align: left;
				margin-right: 0;
			}
			&:last-child {
				flex: inherit !important;
				width: auto !important;
			}
		}
	}
	&-status {
		padding: 0 20rpx;
		border-radius: 8rpx;
	}
}

.unapproved {
	color: #ff8a00;
}
</style>
