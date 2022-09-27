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
				validate-trigger="bind"
				:labelWidth="75"
				:model="formData"
				:rules="rules"
			>
				<m-card>
					<view class="card-content__body">
						<uni-forms-item label="行政区域" name="aaa">
							<uni-data-picker
								popup-title="请选择行政区域"
								v-model="formData.aaa"
								:localdata="range"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="机房名称" name="roomId">
							<uni-data-picker
								ref="roomPicker"
								popup-title="请选择机房名称"
								v-model="formData.roomId"
								manual
								:localdata="roomList"
								@change="changeRoom"
							>
								<template #default>
									<uni-easyinput
										v-model="formData.roomName"
										@change="searchRoomList"
										@clear="clearRoom"
										placeholder="请输入"
									/>
								</template>
							</uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="申请单位" name="applyCompany">
							<uni-easyinput
								v-model="formData.applyCompany"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="项目经理" name="proManagerId">
							<uni-data-picker
								v-model="formData.proManagerId"
								:localdata="range"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="申请时间" name="applyTime">
							<uni-datetime-picker
								type="date"
								v-model="formData.applyTime"
								return-type="date"
							/>
						</uni-forms-item>
						<uni-forms-item label="实施时间" name="workTime">
							<uni-datetime-picker
								type="datetimerange"
								v-model="formData.workTime"
								hide-second
								rangeSeparator="至"
							/>
						</uni-forms-item>
						<uni-forms-item label="所属项目" name="belongProject">
							<uni-easyinput
								v-model="formData.belongProject"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="所属专业" name="belongMajor">
							<uni-easyinput
								v-model="formData.belongMajor"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="施工单位" name="workCompany">
							<uni-easyinput
								v-model="formData.workCompany"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="进出类型" name="applyTypeId">
							<uni-data-picker
								v-model="formData.applyTypeId"
								:localdata="applyTypeList"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="施工内容" name="workNote">
							<uni-easyinput
								type="textarea"
								v-model="formData.workNote"
								:maxlength="300"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item class="upload" label="附件" name="files">
							<uni-file-picker
								limit="5"
								file-mediatype="all"
								v-model="formData.files"
								:list-styles="listStyles"
								:auto-upload="false"
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
import { verify } from '@/config/verification.js'
import { startApply } from '@/api/index.js'
export default {
	data() {
		return {
			tabs: [{ name: '发起申请' }, { name: '申请记录' }],
			tabIndex: 0,
			formData: {},
			rules: {
				aaa: verify('行政区域', 'select'),
				roomId: verify('机房名称', 'select'),
				applyCompany: verify('项目经理', 'input'),
				proManagerId: verify('申请单位', 'select'),
				applyTime: verify('申请时间', 'input'),
				workTime: verify('实施时间', 'input'),
				belongProject: verify('所属项目', 'input'),
				belongMajor: verify('所属专业', 'input'),
				workCompany: verify('施工单位', 'input'),
				applyTypeId: verify('进出类型', 'select'),
				workNote: verify('施工内容', 'input'),
				files: {
					rules: [
						{
							required: true,
							format: 'array',
							errorMessage: '附件不能为空'
						}
					]
				}
			},
			range: [
				{ value: 1, text: '篮球' },
				{ value: 2, text: '足球' },
				{ value: 3, text: '游泳' }
			],
			roomList: [],
			applyTypeList: [
				{ text: '巡检', value: 1 },
				{ text: '勘察', value: 2 },
				{ text: '维修', value: 3 },
				{ text: '跳纤', value: 4 },
				{ text: '设备安装', value: 5 },
				{ text: '空调移机', value: 6 },
				{ text: '设备移机', value: 7 },
				{ text: '设备退网', value: 8 },
				{ text: '其他', value: 9 }
			]
		}
	},
	computed: {
		listStyles() {
			return {
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
		searchRoomList(val) {
			if (!val) return

			this.roomList = this.applyTypeList.slice(4)
			this.$delete(this.formData, 'roomName')
			this.$refs.roomPicker.show()
		},
		clearRoom() {
			this.$delete(this.formData, 'roomId')
			this.$delete(this.formData, 'roomName')
		},
		changeRoom(e) {
			const obj = e.detail.value[0]

			this.formData.roomId = obj.value
			this.formData.roomName = obj.text
		},
		selectFile(e) {
			console.log(e)
		},
		submitForm(ref) {
			this.$refs[ref]
				.validate()
				.then(data => {
					console.log(data)
					// const res = await startApply(data)
					// console.log(res)
					// uni.showLoading({
					// 	title: '加载中',
					// 	mask: true
					// })
				})
				.catch(err => {
					console.log('err', err)

					uni.showToast({
						icon: 'error',
						title: '请检查输入'
					})
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
