<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<m-nav left-icon="left" right-icon="scan" title="进出机房申请"></m-nav>

		<view class="content">
			<m-card title="机房信息" :padding="25">
				<view class="card-content__body">
					<view>
						<text>行政区域</text>
						<text>建邺区</text>
					</view>
					<view>
						<text>机房名称</text>
						<text>南京建邺区国家广告产业园CS机房</text>
					</view>
					<view>
						<text>业务级别</text>
						<text>本地汇聚(区域骨干节点)</text>
					</view>
				</view>
			</m-card>

			<m-card title="访问详情" :padding="25">
				<view class="card-content__body">
					<view class="applicant">
						<image src="/static/logo.png"></image>
						<view>
							<text>申请人</text>
							<text>张三</text>
						</view>
					</view>
					<view>
						<text>访问时间</text>
						<text>2022/07/20 15:20</text>
					</view>
				</view>
			</m-card>

			<m-card title="离开详情" :padding="25">
				<view class="card-content__body">
					<view class="applicant">
						<image src="/static/logo.png"></image>
						<view>
							<text>申请人</text>
							<text>张三</text>
						</view>
					</view>
					<view>
						<text>离开时间</text>
						<text>2022/07/20 15:20</text>
					</view>
				</view>
			</m-card>

			<m-card title="验证码" :padding="25">
				<view class="card-content__body">
					<view class="code-row">
						<view class="row-label">请输入验证码</view>
						<uni-easyinput v-model="code" />
					</view>

					<view class="btn-row">
						<button type="primary" @click="submitValid">
							提交验证
						</button>
					</view>
				</view>
			</m-card>

			<view class="btn-row">
				<button type="primary">访客打卡</button>
			</view>

			<view class="btn-row">
				<button type="primary">访客离开打卡</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			code: ''
		}
	},
	methods: {
		submitValid() {
			if (this.code === '222') {
				uni.showToast({
					icon: 'error',
					title: '重复扫码！'
				})
				return
			}
			if (this.code) {
				uni.showToast({
					title: '验证成功'
				})
			} else {
				uni.showToast({
					icon: 'error',
					title: '验证失败'
				})
			}
		}
	}
}
</script>

<style lang="scss">
.code-row {
	flex-direction: column;
	margin: 0 25px;
	.row-label {
		font-size: 16px;
		margin-bottom: 20px;
		text-align: center;
		color: #666;
	}
	.uni-easyinput {
		margin-bottom: 24px;
	}
}
</style>
