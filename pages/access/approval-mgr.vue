<template>
	<view class="container bg-top">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<view class="nav">
			<m-nav title="进出机房审批"></m-nav>

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
			<m-card v-for="index in 8" :key="index" @tapClick="view">
				<!-- <template v-slot:other>
					<button class="apply-btn" @tap.stop>审批</button>
				</template> -->
				<view class="applicant">
					<image src="../../static/logo.png"></image>
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
			</m-card>
		</view>

		<view class="content" v-else-if="tabIndex === 1">
			<m-card v-for="index in 8" :key="index" @tapClick="viewDetail">
				<template v-slot:other>
					<view class="card-status" :class="renderStatusBgColor(index)">
						{{ index | filterStatusText }}
					</view>
					<button class="cancel-btn" @tap.stop="revoke">撤销</button>
				</template>
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
			</m-card>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog
				type="info"
				cancelText="取消"
				confirmText="确定"
				content="确认撤销审批？"
				@confirm="dialogConfirm"
				@close="dialogClose"
			></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import mCard from '../../components/m-card.vue'
import mNav from '../../components/m-nav.vue'
export default {
	components: { mCard, mNav },
	data() {
		return {
			tabs: [{ name: '待审批' }, { name: '审批记录' }],
			tabIndex: 0
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
	methods: {
		renderStatusBgColor(index) {
			if (index % 2 === 0) {
				return 'status-pass'
			} else {
				return 'status-reject'
			}
		},
		changeTab(index) {
			this.tabIndex = index
		},
		viewDetail() {
			uni.navigateTo({
				url: './detail'
			})
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
.content {
	flex: 1;
	background-image: linear-gradient(to bottom, transparent, #f8fafc);
}

.card {
	&-content > view {
		text:first-child {
			min-width: auto;
		}
	}

	.applicant {
		image {
			width: 40px;
			height: 40px;
		}
		> view {
			display: flex;
			flex-direction: column;
			margin-left: 10px;
			text {
				line-height: 20px;
				&:first-child {
					font-size: 12px;
					color: #666666;
				}
			}
		}
	}
}

.cancel-btn {
	position: absolute;
	bottom: 20px;
	right: 10px;
	font-size: 14px;
	line-height: 26px;
	padding: 0 12px;
	color: #666666;
	background: #fff;
	&:after {
		border: 1px solid #ffcb9a;
	}
}

.status-pass {
	background-image: linear-gradient(to right, #8ff0f0, #7cd0ff);
}
.status-reject {
	background-image: linear-gradient(to right, #ffcea1, #ffa5a5);
}
</style>
