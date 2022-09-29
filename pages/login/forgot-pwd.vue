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
					<uni-easyinput
						v-model="formData.code"
						placeholder="请输入验证码"
					/>
				</uni-forms-item>
				<uni-forms-item label="新密码" name="password">
					<uni-easyinput
						type="password"
						v-model="formData.password"
						placeholder="请输入新密码"
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
					<button type="primary" @click="submitForm('registerForm')">
						提交
					</button>
				</view>
			</uni-forms>
		</m-card>
	</view>
</template>

<script>
import { email, verify, password, confirmPass } from '@/utils/verification.js'
export default {
	data() {
		return {
			formData: {
				email: '',
				code: '',
				password: '',
				confirmPass: '',
				uuid: ''
			},
			rules: {
				email,
				code: verify('验证码', 'input'),
				password,
				confirmPass
			},
			codeUrl: ''
		}
	},
	methods: {
		submitForm(ref) {
			this.$refs[ref]
				.validate()
				.then(data => {
					// if (res.code === 200) {
					// 	uni.showToast({ title: res.msg })
					// } else {
					// 	uni.showToast({
					// 		title: res.msg,
					// 		icon: 'error'
					// 	})
					// }
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

.btn-row {
	margin: 92rpx 0 0;
}
</style>
