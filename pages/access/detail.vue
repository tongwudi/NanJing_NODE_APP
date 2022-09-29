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
						<text class="bold">建邺区</text>
					</view>
					<view>
						<text>机房名称</text>
						<text class="bold">南京建邺区国家广告产业园C座301</text>
					</view>
					<view>
						<text>申请单位</text>
						<text class="bold">建邺分公司</text>
					</view>
					<view>
						<text>项目经理</text>
						<text class="bold">王大</text>
					</view>
					<view>
						<text>申请时间</text>
						<text class="bold">2022/07/19</text>
					</view>
					<view>
						<text>实施时间</text>
						<text class="bold">2022/07/20 08:00~2022/07/2</text>
					</view>
					<view>
						<text>所属项目</text>
						<text class="bold">南京机房智能运维支撑平台</text>
					</view>
					<view>
						<text>所属专业</text>
						<text class="bold">传输</text>
					</view>
					<view>
						<text>施工单位</text>
						<text class="bold">XXX</text>
					</view>
					<view>
						<text>进出类型</text>
						<text class="bold">巡检勘察</text>
					</view>
					<view>
						<text>施工内容</text>
						<text class="wrap bold">
							将空调换个位置将空调换个位
							将空调换个位置将空调换个位
							将空调换个位置将空调换个位 将空调换个位置
						</text>
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
					v-for="index in 3"
					:key="index"
					:title="'进出人员' + index"
					:padding="25"
				>
					<view class="card-content__body">
						<view>
							<text>姓名</text>
							<text class="bold">王五</text>
						</view>
						<view>
							<text>联系电话</text>
							<text class="bold">15005148799</text>
						</view>
						<view>
							<text>身份号码</text>
							<text class="bold">326459458745254568</text>
						</view>
					</view>
				</m-card>
			</view>

			<m-card class="timeline" title="流程" :padding="25">
				<view class="card-content__body">
					<view class="timeline-item" v-for="index in 3" :key="index">
						<view class="item-info">
							<view class="applicant-name">
								<image src="/static/logo.png"></image>
								<view class="flx-clm">
									<text>申请人</text>
									<text>张三</text>
								</view>
							</view>
							<view class="applicant-status flx-clm">
								<text :class="[renderStatusColor(index)]">
									{{ index | filterStatusText }}
								</text>
								<text>2022/07/27 14:00</text>
							</view>
						</view>
						<view class="item-line"></view>
					</view>
				</view>
			</m-card>

			<m-card class="code" title="验证码" :padding="25">
				<view class="card-content__body">
					<view class="code-item">
						<text>验证码</text>
						<text class="bold">234578</text>
					</view>
					<view class="code-item">
						<text>验证码状态</text>
						<text
							class="code-status"
							:class="[renderStatusColor(2)]"
						>
							{{ 2 | filterStatusText }}
						</text>
					</view>
				</view>
			</m-card>

			<view class="btn-row">
				<button type="warn" @click="rejectClick">驳回</button>
				<button type="primary" @click="passClick">通过</button>
			</view>
			<view class="btn-row">
				<button type="info">取消</button>
				<button type="primary">已办</button>
			</view>
			<view class="btn-row">
				<button type="info">取消</button>
				<button type="primary">已确认</button>
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
export default {
	data() {
		return {
			popupText: ''
		}
	},
	filters: {
		filterStatusText(index) {
			if (index % 2 === 0) {
				return '待激活'
			} else if (index % 3 === 0) {
				return '已激活'
			} else if (index % 5 === 0) {
				return '已打卡'
			} else if (index % 7 === 0) {
				return '已失效'
			} else {
				return '待审批'
			}
		}
	},
	methods: {
		renderStatusColor(index) {
			if (index % 2 === 0) {
				return 'status-2'
			} else if (index % 3 === 0) {
				return 'status-3'
			} else if (index % 5 === 0) {
				return 'status-4'
			} else if (index % 7 === 0) {
				return 'status-5'
			} else {
				return 'status-1'
			}
		},
		passClick() {
			this.popupText = '确认通过审批？'
			this.$refs.popup.open()
		},
		dialogConfirm(value) {
			this.$refs.popup.close()
		},
		rejectClick() {
			this.$refs.inputDialog.open()
		},
		dialogInputConfirm(value) {
			this.$refs.inputDialog.close()
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
			text {
				line-height: 40rpx;
				font-size: 24rpx;
				color: #666;
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

.status-1 {
	background-image: linear-gradient(to right, #dbf2ff, #dafdff);
}
.status-2 {
	background-image: linear-gradient(to right, #ffebcd, #feffbb);
}
.status-3 {
	background-image: linear-gradient(to right, #cbffec, #caffc1);
}
.status-4 {
	// background-image: linear-gradient(to right, #dbf2ff, #dafdff);
	color: #fff;
	background-color: forestgreen;
}
.status-5 {
	background-image: linear-gradient(to right, #dfe4e8, #e8f8f9);
}
</style>
