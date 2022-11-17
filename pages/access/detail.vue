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
					<view v-if="files.length > 0">
						<text>附件</text>
						<view class="annex-list">
							<text v-for="(item, index) in files" :key="index">
								{{ item.fileName }}
							</text>
						</view>
					</view>
				</view>
			</m-card>

			<view class="staff-list" v-if="staffList.length > 0">
				<m-card
					class="staff"
					v-for="(item, index) in staffList"
					:key="index"
					:title="'进出人员' + (index + 1)"
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

			<m-card
				class="timeline"
				title="流程"
				:padding="25"
				v-if="processList.length > 0"
			>
				<view class="card-content__body">
					<view
						class="timeline-item"
						v-for="(item, index) in processList.filter(v => !(v.approveOperate && !v.approveTime))"
						:key="index"
					>
						<view class="applicant">
							<image :src="item.avatar" v-if="item.avatar"></image>
							<image src="@/static/img/avatar.png" v-else></image>
							<view class="applicant-name">
								<text>{{ item.nodeName }}</text>
								<text>{{ item.assigneeName }}</text>
							</view>
							<view class="applicant-status" v-if="item.approveOperate">
								<text :class="[renderApproveTextColor(item.approveOperate)]">{{ item.approveOperate }}</text>
								<uni-dateformat :date="item.approveTime"></uni-dateformat>
							</view>
							<text v-else class="unapproved">未开始</text>
						</view>
						<view class="item-other">
							<view class="line"></view>
							<view class="comment" v-if="item.approveNote">{{ item.approveNote }}</view>
						</view>
					</view>
				</view>
			</m-card>

			<m-card
				class="code"
				title="验证码"
				:padding="25"
				v-if="JSON.stringify(authCode) != '{}'"
			>
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
			<view
				class="btn-row"
				v-if="isPunch && approveProcess === '访客离开'"
			>
				<button type="primary" @click="clockOut">离开打卡</button>
			</view>
			<!-- 项目经理/网格员审核 -->
			<view
				class="btn-row"
				v-else-if="
					(approveProcess === '项目经理审批' && roles.includes('manager')) ||
					(approveProcess === '网络员审批' && roles.includes('network'))
				"
			>
				<button type="warn" @click="refuseClick">驳回</button>
				<button type="primary" @click="adoptClick">通过</button>
			</view>
			<!-- 代维已办/代维已确认 -->
			<view
				class="btn-row"
				v-else-if="
					(approveProcess === '代维已办' || approveProcess === '代维已确认') &&
					roles.includes('maintaining')
				"
			>
				<button type="primary" @click="adoptClick">确认</button>
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
import { viewTask, viewTaskEnd, completeTask } from '@/api/index.js'
export default {
	data() {
		return {
			processInstanceId: '',
			processType: '',
			approveProcess: '',
			popupText: '',
			info: {},
			files: [],
			staffList: [],
			processList: [],
			taskId: '',
			authCode: {}
		}
	},
	computed: {
		...mapState(['roles']),
		isPunch() {
			return !(
				!this.roles.includes('admin') &&
				(this.roles.includes('manager') ||
					this.roles.includes('network') ||
					this.roles.includes('maintaining'))
			)
		}
	},
	onLoad(params) {
		this.processInstanceId = params.id
		this.processType = params.type

		this.getDetail()
	},
	methods: {
		renderApproveTextColor(text) {
			if (text === '通过') {
				return 'status-adopt'
			} else {
				return 'status-fail'
			}
		},
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
			const params = { processInstanceId: this.processInstanceId }
			let res;
			if (this.processType == 1) {
				res = await viewTask(params)
			} else {
				res = await viewTaskEnd(params)
			}
			const { data, code } = res
			if (code === 200) {
				this.info = data.applyEnterRoomEntity
				this.files = data.jyApplyFiles
				this.staffList = data.jyApplyPeople
				this.authCode = data.authCode || {}

				if (this.processType == 1) {
					const { userList, taskId, approveProcess } = data.task
					this.processList = userList
					this.taskId = taskId
					this.approveProcess = approveProcess // 当前状态
				} else {
					this.processList = data.approveHistoryList
					const approveHistoryList = Array.from(data.approveHistoryList)
					const lastProcess = approveHistoryList.pop()
					if (lastProcess.nodeName === '访客离开') {
						this.approveProcess = '访客离开' // 当前状态
					}
				}
			}
		},
		adoptClick() {
			this.popupText = '确认通过审批？'
			this.$refs.popup.open()
		},
		clockOut() {
			this.popupText = '确定打卡离开吗？'
			this.$refs.popup.open()
		},
		async dialogConfirm() {
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
		refuseClick() {
			this.$refs.inputDialog.open()
		},
		async dialogInputConfirm(value) {
			if (value === '') {
				uni.showToast({ title: '驳回原因不能为空' })
				return
			}
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
	&:last-child .item-other .line {
		display: none;
	}
	.unapproved {
		align-self: center;
		font-size: 24rpx;
		color: #ff8a00;
	}
	.item-other {
		display: flex;
		margin-left: 40rpx;
		.line {
			width: 2px;
			min-height: 60rpx;
			margin: 10rpx 0;
			background-color: #dcdcdc;
		}
		.comment {
			flex: 1;
			margin: 20rpx 60rpx;
			margin-right: 0;
			padding: 20rpx;
			border-radius: 12rpx;
			line-height: 1.5;
			background-color: #ececec;
		}
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

.annex-list {
	display: flex;
	flex-direction: column;
	line-height: 40rpx;
	color: #2391ff;

	text:not(:first-child) {
		margin-top: 18rpx;
	}
}
</style>
