<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<image class="bg-top" src="@/static/img/bg-top.png"></image>

		<view class="nav">
			<m-nav left-icon="left"></m-nav>

			<view class="title">忘记密码</view>
		</view>

		<m-card>
			<uni-forms
				ref="registerForm"
				err-show-type="toast"
				:labelWidth="75"
				:model="formData"
				:rules="rules"
			>
				<uni-forms-item label="邮箱" name="email">
					<uni-easyinput
						type="email"
						v-model="formData.email"
						placeholder="请输入邮箱"
					/>
				</uni-forms-item>
				<uni-forms-item label="验证码" name="code">
					<view class="code-row">
						<uni-easyinput
							v-model="formData.code"
							placeholder="请输入验证码"
						/>
						<button
							:disabled="hasSent"
							:type="!hasSent ? 'primary' : ''"
							@click="sendCode('registerForm')"
						>
							{{
								hasSent
									? timeupSecond + '秒后重试'
									: '获取验证码'
							}}
						</button>
					</view>
				</uni-forms-item>
				<uni-forms-item label="新密码" name="password">
					<uni-easyinput
						type="password"
						v-model="formData.password"
						placeholder="请输入新密码"
					/>
				</uni-forms-item>
				<uni-forms-item label="确认密码" name="confirmPassword">
					<uni-easyinput
						type="password"
						v-model="formData.confirmPassword"
						placeholder="请再次输入密码"
					/>
				</uni-forms-item>

				<view class="btn-row">
					<button type="primary" @click="submitForm('registerForm')">
						提交
					</button>
				</view>
			</uni-forms>
		</m-card>
	</view>
</template>

<script>
import {
	email,
	verify,
	password,
	confirmPassword
} from '@/utils/verification.js'
import { sendEmail, forgetCode } from '@/api/index.js'
export default {
	data() {
		return {
			formData: {
				email: 'tongwudi@yeah.net',
				code: '',
				password: '',
				confirmPassword: '',
				uuid: ''
			},
			rules: {
				email,
				code: verify('验证码', 'input'),
				password,
				confirmPassword
			},
			hasSent: false,
			timeupSecond: 0
		}
	},
	methods: {
		sendCode(ref) {
			this.$refs[ref].validateField(['email']).then(async data => {
				uni.showLoading({
					mask: true,
					title: '加载中'
				})
				const res = await sendEmail({ email: data.email })
				if (res.code === 200) {
					uni.showToast({ title: '验证码已发送' })
					this.formData.uuid = res.msg
					this.hasSent = true
					this.timeupSecond = 60
					const timer = setInterval(() => {
						this.timeupSecond--
						if (this.timeupSecond < 1) {
							this.hasSent = false
							clearInterval(timer)
						}
					}, 1000)
				}
			})
		},
		submitForm(ref) {
			this.$refs[ref].validate().then(async data => {
				uni.showLoading({
					mask: true,
					title: '加载中'
				})
				const params = {
					...this.formData,
					newPassword: this.formData.password
				}
				delete params.password
				const res = await forgetCode(params)
				if (res.code === 200) {
					uni.showToast({ title: '修改成功' })
				}
			})
		}
	}
}
</script>

<style lang="scss">
.title {
	padding: 40rpx;
	line-height: 1.5;
	font-size: 64rpx;
	font-weight: bold;
	color: #1f1f39;
}

.card {
	flex: 1;
	margin: 0 !important;
}

/deep/ .uni-forms-item__label {
	color: #333;
}

.code-row {
	display: flex;

	button {
		height: 70rpx;
		font-size: 28rpx;
		margin-left: 20rpx;
	}
	button[type='primary'] {
		background-image: linear-gradient(to right, #12aaff, #14e3f0);
	}
	button[disabled] {
		color: hsla(0, 0%, 40%, 1);
	}
}

.btn-row {
	margin: 92rpx 0 0;
}
</style>
