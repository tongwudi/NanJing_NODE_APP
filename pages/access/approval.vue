<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="nav">
			<m-nav title="进出机房审批" right-icon="scan"></m-nav>

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
					:readonly="isChecked"
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
				<uni-row class="swipe-box" v-for="index in 8" :key="index">
					<uni-col :span="isChecked ? 21 : 24">
						<m-card @tapClick="viewDetail">
							<view class="card-content__body">
								<view class="applicant">
									<image src="@/static/logo.png"></image>
									<view>
										<text>申请人</text>
										<text>张三</text>
									</view>
								</view>
								<view>
									<text>进出类型</text>
									<text>巡检勘察</text>
								</view>
								<view>
									<text>申请时间</text>
									<text>2022/09/16 15:20</text>
								</view>
							</view>
						</m-card>
					</uni-col>
					<uni-col class="swipe-box_right" :span="isChecked ? 3 : 0">
						<checkbox :value="index + ''" />
					</uni-col>
				</uni-row>
			</checkbox-group>
		</view>

		<view class="content" v-show="tabIndex === 1">
			<m-card v-for="index in 8" :key="index" @tapClick="viewDetail">
				<template v-slot:other>
					<view
						class="card-status"
						:class="[renderStatusBgColor(index)]"
					>
						{{ index | filterStatusText }}
					</view>
					<button class="cancel-btn" @click.stop="revoke">
						撤销
					</button>
				</template>

				<view class="card-content__body">
					<view class="applicant">
						<image src="../../static/logo.png"></image>
						<view class="">
							<text>申请人</text>
							<text>张三</text>
						</view>
					</view>
					<view>
						<text>进出类型</text>
						<text>巡检勘察</text>
					</view>
					<view>
						<text>申请时间</text>
						<text>2022/09/16 15:20</text>
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
import { getApplyType, searchTodo } from '@/api/index.js'
export default {
	data() {
		return {
			tabs: [{ name: '待审批' }, { name: '审批记录' }],
			tabIndex: 0,
			applyTypeList: [],
			applyType: '',
			isChecked: false,
			batchIds: [],
			pageNum: 1
		}
	},
	filters: {
		filterStatusText(index) {
			if (index % 2 === 0) {
				return '已通过'
			} else {
				return '已驳回'
			}
		}
	},
	onLoad() {
		Promise.all([/*this.getList(), */ this.getApplyTypeList()])
	},
	methods: {
		renderStatusBgColor(index) {
			if (index % 2 === 0) {
				return 'status-pass'
			} else {
				return 'status-reject'
			}
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
			// this.getList()
		},
		async getList() {
			const params = {
				applyType: this.applyType,
				pageNum: this.pageNum
			}
			const res = await searchTodo(params)
			console.log(res)
		},
		changeTab(index) {
			this.tabIndex = index
		},
		batchClick() {
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
		viewDetail() {
			uni.navigateTo({ url: './detail' })
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
.status-pass {
	background-image: linear-gradient(to right, #8ff0f0, #7cd0ff);
}
.status-reject {
	background-image: linear-gradient(to right, #ffcea1, #ffa5a5);
}

.select-row {
	display: flex;
	margin: 20rpx;
	/deep/ {
		.input-value-border {
			border: 1px solid #b1daff;
			background: #fff;
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
