<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<view class="title">
			<view>南京机房智能运维</view>
			<view>支撑平台</view>
		</view>

		<uni-forms
			ref="loginForm"
			label-position="top"
			err-show-type="toast"
			:model="formData"
			:rules="rules"
		>
			<uni-forms-item label="手机号" name="phonenumber">
				<uni-easyinput
					type="number"
					v-model="formData.phonenumber"
					placeholder="请输入手机号"
				/>
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput
					type="password"
					v-model="formData.password"
					placeholder="请输入密码"
				/>
			</uni-forms-item>
			<uni-forms-item label="验证码" name="code">
				<view class="code-row">
					<uni-easyinput v-model="formData.code" />
					<image :src="codeUrl" @click="getCodeUrl"></image>
				</view>
			</uni-forms-item>
			<view class="settings-row">
				<checkbox-group @change="changeRemember">
					<label>
						<checkbox value="1" style="transform: scale(0.75)" />
						<text>记住密码</text>
					</label>
				</checkbox-group>
				<navigator url="./forgot-pwd">忘记密码</navigator>
			</view>
			<view class="btn-row">
				<button type="primary" @click="submitLogin('loginForm')">
					登录
				</button>
			</view>
			<view class="register-row">
				<text>还没有账号？</text>
				<navigator url="./register">点击注册</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { phonenumber, password, verify } from '@/utils/verification.js'
import { captchaImage, appLogin } from '@/api/index.js'
import { encrypt, decrypt } from '@/utils/rsa.js'
export default {
	data() {
		return {
			formData: {
				phonenumber: '15888888888',
				password: 'admin123',
				code: '',
				uuid: ''
			},
			rules: {
				phonenumber,
				password,
				code: verify('验证码', 'input')
			},
			codeUrl: '',
			isRememberPwd: false
		}
	},
	onLoad() {
		this.getCodeUrl()
	},
	methods: {
		...mapMutations(['SET_TOKEN']),
		...mapActions(['GetInfo']),
		async getCodeUrl() {
			const { img, uuid } = await captchaImage()
			this.codeUrl = 'data:image/gif;base64,' + img
			this.formData.uuid = uuid
		},
		changeRemember(e) {
			this.isRememberPwd = e.detail.value.length > 0
		},
		submitLogin(ref) {
			this.$refs[ref].validate().then(async data => {
				const params = {
					...this.formData,
					password: encrypt(this.formData.password)
				}
				const res = await appLogin(params)
				if (res.code === 200) {
					this.SET_TOKEN(res.token)
					this.GetInfo()

					uni.switchTab({ url: '/pages/home/index' })
				} else {
					this.getCodeUrl()
				}
			})
		}
	}
}
</script>

<style lang="scss">
.container {
	padding: 40rpx;
	background-image: linear-gradient(
		to right bottom,
		rgba(250, 255, 217, 0.3),
		rgba(207, 255, 212, 0.4) 30%,
		rgba(208, 241, 255, 0.5) 70%
	);
}

.title {
	padding: 88rpx 0 70rpx;
	line-height: 1.5;
	font-size: 64rpx;
	font-weight: bold;
	color: #1f1f39;
}

/deep/ {
	.is-required {
		display: none;
	}

	.uni-forms-item__label {
		padding: 0 !important;
		height: 60rpx !important;
		line-height: 1 !important;
		color: #858597;
	}

	image,
	.uni-easyinput__content-input {
		height: 80rpx !important;
	}
}

.code-row {
	display: flex;

	image {
		width: 40%;
		margin-left: 40rpx;
	}
}

.settings-row {
	display: flex;
	justify-content: space-between;
	color: #858597;

	/deep/ {
		.uni-checkbox-input {
			background-color: transparent;
		}
	}
}

navigator {
	color: #3d7fff;
}

.btn-row {
	margin: 80rpx 0 0;
}

.register-row {
	margin-top: 40rpx;
	display: flex;
	justify-content: center;

	text {
		color: #858597;
	}
}
</style>
