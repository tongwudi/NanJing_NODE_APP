<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="nav">
			<m-nav left-icon="left"></m-nav>

			<view class="title">注册</view>
		</view>

		<m-card>
			<uni-forms
				ref="form"
				:labelWidth="75"
				:model="formData"
				:rules="rules"
			>
				<uni-forms-item label="姓名" name="name">
					<uni-easyinput
						v-model="formData.name"
						placeholder="请输入姓名"
					/>
				</uni-forms-item>
				<uni-forms-item label="手机号" name="phonenumber">
					<uni-easyinput
						type="number"
						v-model="formData.phonenumber"
						placeholder="请输入手机号"
					/>
				</uni-forms-item>
				<uni-forms-item label="身份号码" name="idcard">
					<uni-easyinput
						v-model="formData.idcard"
						placeholder="请输入身份号码"
					/>
				</uni-forms-item>
				<uni-forms-item label="邮箱" name="email">
					<uni-easyinput
						v-model="formData.email"
						placeholder="请输入邮箱"
					/>
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput
						type="password"
						v-model="formData.password"
						placeholder="请输入密码"
					/>
				</uni-forms-item>
				<uni-forms-item label="确认密码" name="confirmPass">
					<uni-easyinput
						type="password"
						v-model="formData.confirmPass"
						placeholder="请再次输入密码"
					/>
				</uni-forms-item>

				<view class="btn-row">
					<button type="primary" @click="changePass('form')">
						确认
					</button>
				</view>
			</uni-forms>
		</m-card>
	</view>
</template>

<script>
import {
	verify,
	phonenumber,
	idcard,
	email,
	password,
	confirmPass
} from '@/utils/verification.js'
export default {
	data() {
		return {
			formData: {
				name: '',
				phonenumber: '',
				idcard: '',
				email: '',
				password: '',
				confirmPass: '',
				uuid: ''
			},
			rules: {
				name: verify('姓名', 'input'),
				phonenumber,
				idcard,
				email,
				password,
				confirmPass
			},
			codeUrl: ''
		}
	},
	methods: {
		changePass(ref) {
			this.$refs[ref]
				.validate()
				.then(async data => {
					uni.switchTab({
						url: '/pages/home/index'
					})
					return
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					const res = await this.$request.post('/appLogin', { data })
					uni.hideLoading()

					if (res.code === 200) {
						uni.showToast({ title: res.msg })
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						})
					}
				})
				.catch(err => {
					console.log('err', err)
				})
		}
	}
}
</script>

<style lang="scss">
.title {
	padding: 20px;
	line-height: 1.5;
	font-size: 32px;
	font-weight: bold;
	color: #1f1f39;
}

.card {
	flex: 1;
	margin: 0 !important;
}

/deep/.uni-forms-item__label {
	color: #333;
}

.btn-row {
	margin: 92rpx 0 0;
}
</style>
