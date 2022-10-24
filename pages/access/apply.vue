<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="nav">
			<m-nav title="进出机房申请" right-icon="scan"></m-nav>

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
			<uni-forms
				ref="applyForm"
				err-show-type="toast"
				:label-width="75"
				:model="formData"
				:rules="rules"
			>
				<m-card>
					<view class="card-content__body">
						<uni-forms-item label="行政区域" name="county">
							<uni-data-picker
								popup-title="请选择行政区域"
								v-model="formData.county"
								:clear-icon="false"
								:localdata="countyList"
								@change="getRoomList"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="机房名称" name="roomId">
							<uni-data-picker
								popup-title="请选择机房名称"
								v-model="formData.roomId"
								:clear-icon="false"
								:localdata="roomList"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="申请单位" name="applyCompany">
							<uni-easyinput
								v-model="formData.applyCompany"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item label="项目经理" name="proManagerId">
							<uni-data-picker
								popup-title="请选择项目经理"
								v-model="formData.proManagerId"
								:clear-icon="false"
								:localdata="leaderList"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="申请时间" name="applyTime">
							<uni-datetime-picker
								type="date"
								v-model="formData.applyTime"
							/>
						</uni-forms-item>
						<uni-forms-item label="实施时间" name="workTime">
							<uni-datetime-picker
								type="datetime"
								v-model="formData.workTime"
							/>
							<!-- <uni-datetime-picker
								type="datetimerange"
								v-model="formData.workTime"
								range-separator="至"
								hide-second
							/> -->
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
						<uni-forms-item label="进出类型" name="applyType">
							<uni-data-picker
								popup-title="请选择进出类型"
								v-model="formData.applyType"
								:clear-icon="false"
								:localdata="applyTypeList"
							></uni-data-picker>
						</uni-forms-item>
						<uni-forms-item label="施工内容">
							<uni-easyinput
								type="textarea"
								v-model="formData.workNote"
								:maxlength="300"
								placeholder="请输入"
							/>
						</uni-forms-item>
						<uni-forms-item class="upload" label="附件">
							<uni-file-picker
								mode="list"
								:value="files"
								:auto-upload="false"
								@select="selFile"
								@delete="delFile"
							>
								<button>+ 上传</button>
							</uni-file-picker>
						</uni-forms-item>
					</view>
				</m-card>

				<view class="staff-list">
					<m-card
						class="staff"
						v-for="(item, index) in staffList"
						:key="index"
						:title="'进出人员' + (index + 1)"
					>
						<template #icon>
							<uni-icons
								class="fr"
								size="20"
								:type="index === staffList.length - 1 ? 'plus' : 'minus'"
								@click="changeStaff(index)"
							></uni-icons>
						</template>
						<view class="card-content__body">
							<uni-forms-item label="姓名">
								<uni-easyinput
									v-model="item.applyName"
									placeholder="请输入"
								/>
							</uni-forms-item>
							<uni-forms-item label="联系电话">
								<uni-easyinput
									v-model="item.applyContract"
									placeholder="请输入"
								/>
							</uni-forms-item>
							<uni-forms-item label="身份号码">
								<uni-easyinput
									type="idcard"
									v-model="item.applyIdCard"
									placeholder="请输入"
								/>
							</uni-forms-item>
						</view>
					</m-card>
				</view>

				<view class="btn-row">
					<button type="primary" @click="submitForm('applyForm')">
						提交
					</button>
				</view>
			</uni-forms>
		</view>

		<view class="content" v-show="tabIndex === 1">
			<view class="apply-list">
				<m-card
					v-for="(item, index) in applyList"
					:key="index"
					@tapClick="viewDetail(item.processInstanceId)"
				>
					<template v-slot:other>
						<view class="card-status" :class="[renderStatus(item)]">
							{{
								item.authCodeDto
									? item.authCodeDto.status
									: renderStatusText(item.processStatus)
							}}
						</view>
						<button
							class="cancel-btn"
							v-if="
								item.authCodeDto
									? item.authCodeDto.status == '0'
									: item.processStatus == '0'
							"
							@click.stop="revoke(item.processInstanceId, index)"
						>
							撤销
						</button>
					</template>
					<view class="card-content__body">
						<view>
							<text>进出类型</text>
							<text>{{ item.applyTypeName }}</text>
						</view>
						<view>
							<text>所属项目</text>
							<text>{{ item.belongProject }}</text>
						</view>
						<view v-if="item.authCodeDto">
							<text>验证码</text>
							<text class="bold">{{ item.authCodeDto.authCode }}</text>
						</view>
						<view v-else>
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
						(loadStatus === 'nomore' && !applyList.length)
				}"
			/>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				content="确认撤销申请？"
				@confirm="dialogConfirm"
			></uni-popup-dialog>
		</uni-popup>

		<m-tabbar />
	</view>
</template>

<script>
import { verify } from '@/utils/validate.js'
import {
	getCounty,
	getRoomByCounty,
	getLeader,
	uploadFiles,
	startApply,
	getApplyType,
	getApplyList,
	recallTask
} from '@/api/index.js'
export default {
	data() {
		return {
			tabs: [{ name: '发起申请' }, { name: '申请记录' }],
			tabIndex: 0,
			formData: {},
			rules: {
				county: verify('行政区域', 'select'),
				roomId: verify('机房名称', 'select'),
				applyCompany: verify('申请单位', 'input'),
				proManagerId: verify('项目经理', 'select'),
				applyTime: verify('申请时间', 'input'),
				workTime: verify('实施时间', 'input'),
				belongProject: verify('所属项目', 'input'),
				belongMajor: verify('所属专业', 'input'),
				workCompany: verify('施工单位', 'input'),
				applyType: verify('进出类型', 'select')
			},
			files: [],
			countyList: [],
			roomList: [],
			leaderList: [],
			applyTypeList: [],
			staffList: [{}],
			loadStatus: '',
			isLoadMore: false,
			pageNum: 1,
			pageSize: 10,
			applyList: [],
			processInstanceId: '',
			curIdx: 0
		}
	},
	onLoad() {
		this.getCountyList()
		this.getLeaderList()
		this.getApplyTypeList()
		this.getApplyRecord()
	},
	methods: {
		renderStatusText(index) {
			if (index == 1) {
				return '已通过'
			} else if (index == 2) {
				return '已驳回'
			} else if (index == 3) {
				return '已撤销'
			} else {
				return '审核中'
			}
		},
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
		renderCodeStatusBgColor(index) {
			if (index == 1) {
				return 'status-yjh'
			} else if (index == 2) {
				return 'status-ysx'
			} else {
				return 'status-djh'
			}
		},
		renderStatus(item) {
			if (item.processStatus == 3) {
				return this.renderStatusBgColor(item.processStatus)
			} else if (item.authCodeDto) {
				return this.renderCodeStatusBgColor(item.authCodeDto.value)
			} else {
				return this.renderStatusBgColor(item.processStatus)
			}
		},
		onPullDownRefresh() {
			if (this.tabIndex === 1) {
				this.pageNum = 1
				this.applyList = []
				this.getApplyRecord()
			} else { // 下拉重置表单
				this.formData = {}
				this.files = []
				this.staffList = [{}]
			}
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (this.tabIndex === 0) return
			if (this.isLoadMore) return

			this.pageNum += 1
			this.getApplyRecord()
		},
		changeTab(index) {
			if (this.tabIndex === index) return
			this.tabIndex = index
		},
		async getCountyList() {
			const { code, data } = await getCounty()
			if (code === 200) {
				this.countyList = data.map(item => {
					return {
						text: item,
						value: item
					}
				})
			}
		},
		async getRoomList(e) {
			this.roomList = []
			this.$delete(this.formData, 'roomId')

			const { value: county } = e.detail.value[0]
			const res = await getRoomByCounty({ county })
			if (res.code === 200) {
				this.roomList = res.data.map(item => {
					return {
						text: item.roomName,
						value: item.roomId
					}
				})
			}
		},
		async getLeaderList() {
			const { code, data } = await getLeader()
			if (code === 200) {
				this.leaderList = data.map(item => {
					return {
						text: item.nickName,
						value: item.userId
					}
				})
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
		// 选择文件
		selFile(file) {
			// console.log(file)
			if (!file.tempFilePaths.length) return
			const promises = file.tempFilePaths.map(item => {
				return uploadFiles(item)
			})
			Promise.all(promises).then(reslut => {
				reslut.forEach((res, index) => {
					if (res.code === 200) {
						const { fileName, fileUrl } = res.data[0]
						this.files.push({ name: fileName, url: fileUrl, fileName, fileUrl })
					} else {
						this.files.splice(index, 1)
					}
				})
				// console.log(this.files)
			})
		},
		// 删除文件
		delFile(err) {
			// console.log(err)
			const num = this.files.findIndex(v => v.url === err.tempFilePath)
			this.files.splice(num, 1)
			// console.log(this.files)
		},
		changeStaff(idx) {
			if (idx === this.staffList.length - 1) {
				this.staffList.push({})
			} else {
				this.staffList.splice(idx, 1)
			}
		},
		submitForm(ref) {
			this.$refs[ref].validate().then(async data => {
				const verifyStaff = this.staffList.some(item => !item.applyName || !item.applyContract || !item.applyIdCard)
				if (verifyStaff) {
					uni.showToast({
						title: '请完善进出人员信息',
						icon: 'none'
					})
					return
				}
				const files = this.files?.map(item => {
					const { fileName, fileUrl } = item
					return { fileName, fileUrl }
				}) || []
				const params = {
					jyApplyEnterRoom: this.formData,
					jyApplyFiles: files,
					jyApplyPeople: this.staffList
				}
				const res = await startApply(params)
				if (res.code === 200) {
					// 重置表单
					this.formData = {}
					this.files = []
					this.staffList = [{}]
					uni.showToast({
						title: '发起成功',
						icon: 'success'
					})
					
				}
			})
		},
		async getApplyRecord() {
			this.loadStatus = 'loading'
			const params = { pageNum: this.pageNum, pageSize: this.pageSize }
			const res = await getApplyList(params)
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
		viewDetail(id) {
			uni.navigateTo({ url: `./detail?id=${id}&type=2` })
		},
		revoke(processInstanceId, index) {
			this.processInstanceId = processInstanceId
			this.curIdx = index
			this.$refs.popup.open()
		},
		async dialogConfirm() {
			const res = await recallTask({ processInstanceId: this.processInstanceId })
			if (res.code === 200) {
				this.$refs.popup.close()
				uni.showToast({
					title: '撤销成功',
					icon: 'success'
				})
				this.applyList[this.curIdx].processStatus = 3
			}
		}
	}
}
</script>

<style lang="scss">
/deep/ {
	.uni-forms-item__label {
		color: #333;
		height: 72rpx !important;
	}
	.uni-easyinput__content-input,
	.uni-date__x-input,
	.input-value {
		height: 70rpx !important;
	}
	.uni-forms-item__content {
		width: 0;
	}
	.selected-item {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.files__name {
		color: #2391ff;
	}
	.files-button {
		button {
			line-height: 72rpx !important;
		}
	}
}
// .uniui-calendar {
// 	display: none;
// }

.upload button {
	font-size: 28rpx;
	color: #2391ff;
	background-color: #fff;
}

.apply-list .card:last-child {
	margin-bottom: 0;
}
</style>
