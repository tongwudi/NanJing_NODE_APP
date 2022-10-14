<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="nav">
			<m-nav title="进出机房审批"></m-nav>

			<view class="tabs">
				<view
					class="tab-item"
					v-for="(tab, index) in tabs"
					:key="index"
					@click="changeTab(index)"
				>
					<text :class="tabIndex == index ? 'tab-item-active' : ''">
						{{ tab.name }}
					</text>
				</view>
			</view>
		</view>

		<view class="content" v-show="tabIndex === 0">
			<view class="select-row">
				<uni-data-picker
					placeholder="请选择进出类型"
					v-model="applyType"
					:clear-icon="false"
					:readonly="applyList.length === 0 || isChecked"
					:localdata="applyTypeList"
					@change="changeApplyType"
				></uni-data-picker>
				<button
					:type="isChecked ? 'primary' : 'default'"
					@click="batchClick"
				>
					{{ isChecked ? '批量通过' : '批量操作' }}
				</button>
			</view>

			<checkbox-group @change="checkedChange">
				<template v-if="applyList.length > 0">
					<uni-row
						class="swipe-box"
						v-for="(item, index) in applyList"
						:key="index"
					>
						<uni-col :span="isChecked ? 21 : 24">
							<m-card
								@tapClick="
									viewDetail(
										item.jyApplyEnterRoom.processInstanceId
									)
								"
							>
								<view class="card-content__body">
									<view class="applicant">
										<image src="@/static/logo.png"></image>
										<view>
											<text>申请人</text>
											<text>{{ item.jyApplyEnterRoom.applyUserName }}</text>
										</view>
									</view>
									<view>
										<text>进出类型</text>
										<text>{{ item.jyApplyEnterRoom.applyTypeName }}</text>
									</view>
									<view>
										<text>申请时间</text>
										<text>{{ item.jyApplyEnterRoom.applyTime }}</text>
									</view>
								</view>
							</m-card>
						</uni-col>
						<uni-col
							class="swipe-box_right"
							:span="isChecked ? 3 : 0"
						>
							<checkbox :value="index + ''" />
						</uni-col>
					</uni-row>
					<uni-load-more :status="loadStatus"></uni-load-more>
				</template>
				<view v-else class="no-data">暂无数据</view>
			</checkbox-group>
		</view>

		<view class="content" v-show="tabIndex === 1">
			<m-card
				v-for="(item, index) in approvedList"
				:key="index"
				@tapClick="viewDetail(item.jyApplyEnterRoom.processInstanceId)"
			>
				<template v-slot:other>
					<view
						class="card-status"
						:class="[renderStatusBgColor(item.jyApplyEnterRoom.processStatus)]"
					>
						{{ item.jyApplyEnterRoom.processStatus | filterStatusText }}
					</view>
					<button
						class="cancel-btn"
						v-if="item.jyApplyEnterRoom.processStatus === '0'"
						@click.stop="revoke"
					>
						撤销
					</button>
				</template>

				<view class="card-content__body">
					<view class="applicant">
						<image src="../../static/logo.png"></image>
						<view class="">
							<text>申请人</text>
							<text>{{ item.jyApplyEnterRoom.applyUserName }}</text>
						</view>
					</view>
					<view>
						<text>进出类型</text>
						<text>{{ item.jyApplyEnterRoom.applyTypeName }}</text>
					</view>
					<view>
						<text>申请时间</text>
						<text>{{ item.jyApplyEnterRoom.applyTime }}</text>
					</view>
				</view>
			</m-card>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				content="确认撤销审批？"
				@confirm="dialogConfirm"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { mapMutations } from 'vuex'
import { getApplyType, searchTodo, getApprovedRecord } from '@/api/index.js'
export default {
	data() {
		return {
			tabs: [{ name: '待审批' }, { name: '审批记录' }],
			tabIndex: 0,
			applyTypeList: [],
			applyType: '',
			isChecked: false,
			batchIds: [],
			loadStatus: '',
			isLoadMore: false,
			pageNum: 1,
			pageSize: 10,
			applyList: [],
			approvedList: []
		}
	},
	filters: {
		filterStatusText(index) {
			if (index == 1) {
				return '已通过'
			} else if (index == 2) {
				return '已驳回'
			} else {
				return '审核中'
			}
		}
	},
	onLoad() {
		uni.showLoading({
			mask: true,
			title: '加载中'
		})
		Promise.all([this.getList(), this.getApplyTypeList()]).then(() => {
			uni.hideLoading()
		})
	},
	onShow() {
		this.REVISE_TABBAR()
	},
	methods: {
		...mapMutations(['REVISE_TABBAR']),
		renderStatusBgColor(index) {
			if (index == 1) {
				return 'status-resolve'
			} else if (index == 2) {
				return 'status-reject'
			} else {
				return 'status-pending'
			}
		},
		async onPullDownRefresh() {
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			this.pageNum = 1
			if (this.tabIndex === 0) {
				this.applyType = ''
				this.applyList = []
				await this.getList()
			} else {
				await this.getApprovedList()
			}
			uni.hideLoading()
			uni.stopPullDownRefresh()
		},
		async onReachBottom() {
			if (this.tabIndex === 1) return
			if (this.isLoadMore) return
			uni.showLoading({
				mask: true,
				title: '加载中'
			})

			this.pageNum += 1
			await this.getList()
			uni.hideLoading()
		},
		async changeTab(index) {
			if (this.tabIndex === index) return
			this.tabIndex = index

			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			this.pageNum = 1
			if (index === 0) {
				this.applyType = ''
				this.applyList = []
				await this.getList()
			} else {
				await this.getApprovedList()
			}
			uni.hideLoading()
		},
		async getApplyTypeList() {
			const { code, data } = await getApplyType()
			if (code === 200) {
				this.applyTypeList = data.map(item => {
					return {
						text: item.applyTypeName,
						value: item.applyTypeId
					}
				})
			}
		},
		changeApplyType(e) {
			const { value } = e.detail.value[0]
			this.applyType = value
			this.getList()
		},
		async getList() {
			this.loadStatus = 'loading'
			this.isChecked = false
			this.batchIds = []
			const params = {
				applyType: this.applyType,
				pageNum: this.pageNum
			}
			const res = await searchTodo(params)
			if (res.code === 200) {
				this.applyList = this.applyList.concat(res.rows)
				if (this.applyList.length === res.total) {
					this.isLoadMore = true
					this.loadStatus = 'nomore'
				} else {
					this.isLoadMore = false
					this.loadStatus = 'more'
				}
			}
		},
		async getApprovedList() {
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			const res = await getApprovedRecord()
			if (res.code === 200) {
				uni.hideLoading()
				this.approvedList = res.rows
			}
		},
		batchClick() {
			if (this.applyList.length === 0) return
			if (this.isChecked && this.batchIds.length > 0) {
				// 提交批量审批，重新加载数据列表，清空已选中
				// for(let key of approval) {
				// 	key.checked = false
				// }
				// this.batchIds = []
			}
			this.isChecked = !this.isChecked
		},
		checkedChange(e) {
			const values = e.detail.value
			this.batchIds = values
		},
		viewDetail(id) {
			uni.navigateTo({ url: './detail?id=' + id })
		},
		revoke() {
			this.$refs.popup.open()
		},
		dialogConfirm(value) {
			this.$refs.popup.close()
		}
	}
}
</script>

<style lang="scss">
.select-row {
	display: flex;
	margin: 20rpx;
	/deep/ {
		.input-value-border {
			border: 1px solid #b1daff;
			background: #fff;
		}
		.placeholder {
			font-size: 24rpx !important;
		}
		.input-value {
			height: 72rpx;
		}
	}
	button {
		margin-left: 30rpx;
		line-height: 72rpx;
		font-size: 24rpx;
		border-radius: 12rpx;
	}
	button[type='primary'] {
		background-image: linear-gradient(to right, #12aaff, #14e3f0);
	}
	button[type='default'] {
		background-color: #fff;
		color: #585858;
		&::after {
			border: 2px solid #b1daff;
			border-radius: 24rpx;
		}
	}
}
.swipe-box {
	display: flex;
	align-items: center;
	&_right {
		text-align: center;
	}
	.card {
		margin-top: 0;
	}
}
</style>
