<template>
	<view class="container bg-top">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<view class="nav">
			<m-nav title="进出机房申请" right-icon="scan"></m-nav>

			<view class="tabs">
				<view
					class="tab-item"
					v-for="(tab, index) in tabs"
					:key="index"
					@tap="changeTab(index)"
				>
					<text :class="tabIndex == index ? 'tab-item-active' : ''">
						{{ tab.name }}
					</text>
				</view>
			</view>
		</view>

		<view class="content" v-if="tabIndex === 0">
			<uni-forms
				ref="applyForm"
				:labelWidth="75"
				:model="formData"
				:rules="rules"
			>
				<m-card>
					<view class="card-content__body">
						<uni-forms-item label="行政区域">
							<uni-data-select
								v-model="formData.aa"
								:localdata="range"
							></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="机房名称">
							<uni-easyinput v-model="formData.bb" placeholder="请输入" />
						</uni-forms-item>
						<uni-forms-item label="申请单位">
							<uni-easyinput v-model="formData.bb" placeholder="请输入" />
						</uni-forms-item>
						<uni-forms-item label="项目经理">
							<uni-data-select
								v-model="formData.aa"
								:localdata="range"
							></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="申请时间">
							<uni-datetime-picker
								type="date"
								v-model="formData.cc"
								return-type="date"
							/>
						</uni-forms-item>
						<uni-forms-item label="实施时间">
							<uni-datetime-picker
								type="datetimerange"
								v-model="formData.dd"
								hide-second
								rangeSeparator="至"
							/>
						</uni-forms-item>
						<uni-forms-item label="所属项目">
							<uni-easyinput v-model="formData.bb" placeholder="请输入" />
						</uni-forms-item>
						<uni-forms-item label="所属专业">
							<uni-easyinput v-model="formData.bb" placeholder="请输入" />
						</uni-forms-item>
						<uni-forms-item label="施工单位">
							<uni-easyinput v-model="formData.bb" placeholder="请输入" />
						</uni-forms-item>
						<uni-forms-item label="进出类型">
							<uni-data-select
								v-model="formData.qq"
								:localdata="range"
							></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="施工内容">
							<uni-easyinput
								type="textarea"
								v-model="formData.bb"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="附件" class="upload">
							<uni-file-picker
								limit="5"
								file-mediatype="all"
								:list-styles="listStyles"
								:value="formData.ee"
							>
								<button>+ 上传文件</button>
							</uni-file-picker>
						</uni-forms-item>
					</view>
				</m-card>

				<view class="staff-list">
					<m-card
						class="staff"
						v-for="index in 3"
						:key="index"
						:title="'进出人员' + index"
					>
						<view class="card-content__body">
							<uni-forms-item label="姓名">
								<uni-easyinput v-model="formData.bb" placeholder="请输入" />
							</uni-forms-item>
							<uni-forms-item label="联系电话">
								<uni-easyinput v-model="formData.bb" placeholder="请输入" />
							</uni-forms-item>
							<uni-forms-item label="身份号码">
								<uni-easyinput
									type="idcard"
									v-model="formData.bb"
									placeholder="请输入"
								/>
							</uni-forms-item>
						</view>
					</m-card>

					<view class="btn-row">
						<button type="primary" @tap="submitForm('applyForm')">提交</button>
					</view>
				</view>
			</uni-forms>
		</view>

		<view class="content" v-else-if="tabIndex === 1">
			<m-card v-for="index in 8" :key="index" @tapClick="viewDetail(index)">
				<template v-slot:other>
					<view class="card-status" :class="renderStatusBgColor(index)">
						{{ index | filterStatusText }}
					</view>
					<button
						class="cancel-btn"
						v-if="index % 2 === 0 || index % 3 === 0 || index % 7 === 0"
						@tap.stop="revoke"
					>
						撤销
					</button>
				</template>
				<view class="card-content__body">
					<view>
						<text>进出类型</text>
						<text>巡检勘察</text>
					</view>
					<view>
						<text>所属项目</text>
						<text>南京机房智能运维支撑平台</text>
					</view>
					<view v-if="index % 3 === 0">
						<text>验证码</text>
						<text class="bold">245879</text>
					</view>
					<view v-else>
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
				content="确认撤销申请？"
				@confirm="dialogConfirm"
				@close="dialogClose"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabs: [{ name: '发起申请' }, { name: '申请记录' }],
			tabIndex: 0,
			formData: {},
			rules: {
				qq: [
					{
						required: true,
						errorMessage: '进出类型未选择'
					}
				]
			},
			range: [
				{ value: 0, text: '篮球' },
				{ value: 1, text: '足球' },
				{ value: 2, text: '游泳' }
			]
		}
	},
	computed: {
		listStyles() {
			return {
				// dividline: true,
				border: false
			}
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
		submitForm(ref) {
			this.$refs[ref]
				.validate()
				.then(data => {
					console.log(data)
					// uni.showLoading({
					// 	title: '加载中',
					// 	mask: true
					// })
				})
				.catch(err => {
					console.log('err', err)
				})
		},
		renderStatusBgColor(index) {
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
		changeTab(index) {
			this.tabIndex = index
		},
		viewDetail(index) {
			if (index % 3 === 0 || index % 5 === 0) {
				uni.navigateTo({ url: './clock' })
			} else {
				uni.navigateTo({ url: './detail' })
			}
		},
		revoke() {
			this.$refs.popup.open()
		},
		dialogConfirm(value) {
			this.$refs.popup.close()
		},
		dialogClose() {
			this.$refs.popup.close()
		}
	}
}
</script>

<style lang="scss">
.uni-forms-item {
	margin-bottom: 15px;
}
/deep/ {
	.uni-forms-item__label {
		color: #333;
	}
	.files__name {
		color: #2391ff;
	}
}
// .uniui-calendar {
// 	display: none;
// }

.upload button {
	font-size: 14px;
	color: #2391ff;
	background-color: #fff;
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
