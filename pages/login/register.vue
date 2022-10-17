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
				err-show-type="toast"
				:labelWidth="75"
				:model="formData"
				:rules="rules"
			>
				<uni-forms-item label="姓名" name="nickName">
					<uni-easyinput
						v-model="formData.nickName"
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
				<uni-forms-item label="确认密码" name="confirmPassword">
					<uni-easyinput
						type="password"
						v-model="formData.confirmPassword"
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
	confirmPassword
} from '@/utils/validate.js'
import { appRegister } from '@/api/index.js'
export default {
	data() {
		return {
			formData: {
				nickName: '',
				phonenumber: '',
				idcard: '',
				email: '',
				password: '',
				confirmPassword: ''
			},
			rules: {
				nickName: verify('姓名', 'input'),
				phonenumber,
				idcard,
				email,
				password,
				confirmPassword
			}
		}
	},
	methods: {
		changePass(ref) {
			this.$refs[ref].validate().then(async data => {
				uni.showLoading({
					mask: true,
					title: '加载中'
				})
				const res = await appRegister(data)
				if (res.code === 200) {
					uni.showToast({ title: '注册成功' })
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

/deep/.uni-forms-item__label {
	color: #333;
}

.btn-row {
	margin: 92rpx 0 0;
}
</style>
