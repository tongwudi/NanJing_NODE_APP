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
				<view class="readonly-selct" v-if="isChecked"></view>
				<uni-data-picker
					placeholder="请选择进出类型"
					v-else
					v-model="applyType"
					:clear-icon="false"
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
				<view
					class="slide-box"
					v-for="(item, index) in applyList"
					:key="index"
				>
					<view class="slide-box_left">
						<m-card @tapClick="viewDetail(item.processInstanceId, 1)">
							<view class="card-content__body">
								<view class="applicant">
									<image :src="item.applyUserAvatar" v-if="item.applyUserAvatar"></image>
									<image src="@/static/img/avatar.png" v-else></image>
									<view class="applicant-name">
										<text>申请人</text>
										<text>{{ item.applyUserName }}</text>
									</view>
								</view>
								<view>
									<text>进出类型</text>
									<text>{{ item.applyTypeName }}</text>
								</view>
								<view>
									<text>申请时间</text>
									<text>{{ item.applyTime }}</text>
								</view>
							</view>
						</m-card>
					</view>
					<view class="slide-box_right" :style="{ width: isChecked ? '15%' : 0 }">
						<checkbox :value="index + ''" />
					</view>
				</view>
			</checkbox-group>
			<uni-load-more
				:status="loadStatus"
				:class="{
					'no-data':
						loadStatus === 'loading' ||
						(loadStatus === 'nomore' && !applyList.length)
				}"
			/>
		</view>

		<view class="content" v-show="tabIndex === 1">
			<view class="approved-list">
				<m-card
					v-for="(item, index) in approvedList"
					:key="index"
					@tapClick="viewDetail(item.processInstanceId, 2)"
				>
					<template v-slot:other>
						<view
							class="card-status"
							:class="[renderStatusBgColor(item.processStatus)]"
						>
							{{ item.processStatus | filterStatusText }}
						</view>
					</template>

					<view class="card-content__body">
						<view class="applicant">
							<image :src="item.applyUserAvatar" v-if="item.applyUserAvatar"></image>
							<image src="@/static/img/avatar.png" v-else></image>
							<view class="applicant-name">
								<text>申请人</text>
								<text>{{ item.applyUserName }}</text>
							</view>
						</view>
						<view>
							<text>进出类型</text>
							<text>{{ item.applyTypeName }}</text>
						</view>
						<view>
							<text>申请时间</text>
							<text>{{ item.applyTime }}</text>
						</view>
					</view>
				</m-card>
			</view>
			<uni-load-more
				:status="loadStatus"
				:class="{
					'no-data':
						loadStatus === 'loading' ||
						(loadStatus === 'nomore' && !approvedList.length)
				}"
			/>
		</view>

		<m-tabbar />
	</view>
</template>

<script>
import { getApplyType, searchTodo, doneList } from '@/api/index.js'
export default {
	data() {
		return {
			tabs: [{ name: '待审批' }, { name: '审批记录' }],
			tabIndex: 0,
			applyType: '',
			applyTypeList: [],
			isChecked: false,
			batchIds: [],
			loadStatus: '',
			isLoadMore: false,
			applyPagination: {
				pageNum: 1
			},
			approvedPagination: {
				pageNum: 1
			},
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
			} else if (index == 3) {
				return '已撤销'
			} else {
				return '审核中'
			}
		}
	},
	onLoad() {
		this.getApplyTypeList()
		this.getApplyList()
		this.getApprovedRecord()
	},
	methods: {
		renderStatusBgColor(index) {
			if (index == 1) {
				return 'status-resolve'
			} else if (index == 2) {
				return 'status-reject'
			} else if (index == 3) {
				return 'status-ycx'
			} else {
				return 'status-pending'
			}
		},
		// 下拉刷新
		async onPullDownRefresh() {
			if (this.tabIndex === 0) {
				this.applyPagination.pageNum = 1
				this.applyType = ''
				this.applyList = []
				await this.getApplyList()
			} else {
				this.approvedPagination.pageNum = 1
				this.approvedList = []
				await this.getApprovedRecord()
			}
			uni.stopPullDownRefresh()
		},
		// 上拉加载
		async onReachBottom() {
			if (this.isLoadMore) return

			if (this.tabIndex === 0) {
				this.applyPagination.pageNum += 1
				await this.getApplyList()
			} else {
				this.approvedPagination.pageNum += 1
				await this.getApprovedRecord()
			}
		},
		async changeTab(index) {
			if (this.tabIndex === index) return
			this.tabIndex = index
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
			this.applyList = []
			this.getApplyList()
		},
		async getApplyList() {
			this.isChecked = false
			this.batchIds = []
			this.loadStatus = 'loading'
			const params = {
				applyType: this.applyType,
				pageNum: this.applyPagination.pageNum
			}
			const res = await searchTodo(params)
			if (res.code === 200) {
				const rows = res.rows.map(item => {
					return item.jyApplyEnterRoom
				})
				this.applyList = this.applyList.concat(rows)
				if (this.applyList.length === res.total) {
					this.isLoadMore = true
					this.loadStatus = 'nomore'
				} else {
					this.isLoadMore = false
					this.loadStatus = 'more'
				}
			}
		},
		async getApprovedRecord() {
			const params = {
				pageNum: this.approvedPagination.pageNum
			}
			const res = await doneList(params)
			if (res.code === 200) {
				const rows = res.rows.map(item => {
					return item.jyApplyEnterRoom
				})
				this.approvedList = this.approvedList.concat(rows)
				if (this.approvedList.length === res.total) {
					this.isLoadMore = true
					this.loadStatus = 'nomore'
				} else {
					this.isLoadMore = false
					this.loadStatus = 'more'
				}
			}
		},
		batchClick() {
			if (this.applyList.length === 0) {
				uni.showToast({
					title: '没有可操作数据'
				})
				return
			}
			if (this.isChecked && this.batchIds.length > 0) {
				// 提交批量审批，重新加载数据列表，清空已选中
				// for(let key of Approved) {
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
		viewDetail(id, type) {
			uni.navigateTo({ url: `./detail?id=${id}&type=${type}` })
		}
	}
}
</script>

<style lang="scss">
$input-height: 80rpx;
.select-row {
	display: flex;
	margin: 20rpx;
	margin-bottom: 0;
	.readonly-selct {
		flex: 1;
		height: $input-height;
		border: 1px solid #b1daff;
		border-radius: 12rpx;
		box-sizing: border-box;
		background: #fff;
	}
	/deep/ {
		.input-value-border {
			border: 1px solid #b1daff;
			background: #fff;
		}
		.placeholder {
			font-size: 24rpx !important;
		}
		.input-value {
			height: $input-height;
		}
	}
	button {
		margin-left: 30rpx;
		line-height: $input-height;
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

.slide-box {
	display: flex;
	align-items: center;
	&_left {
		flex: 1;
	}
	&_right {
		transition: width 0.3s;
		text-align: center;
	}
}

.slide-box,
.approved-list {
	.card:last-child {
		margin-bottom: 0;
	}
}
</style>
