<template>
	<view class="container">
		<view class="status_bar"><!-- 这里是状态栏 --></view>

		<view class="navbar-placeholder"></view>
		
		<view class="page-title">
			<view>南京机房智能运维</view>
			<view>支撑平台</view>
		</view>

		<uni-forms
			ref="loginForm"
			err-show-type="toast"
			:model="formData"
			:rules="rules"
		>
			<uni-forms-item name="phonenumber">
				<uni-easyinput
					type="number"
					v-model="formData.phonenumber"
					placeholder="请输入手机号"
				/>
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput
					type="password"
					v-model="formData.password"
					placeholder="请输入密码"
				/>
			</uni-forms-item>
			<uni-forms-item name="code">
				<view class="code-row">
					<uni-easyinput
						v-model="formData.code"
						placeholder="请输入验证码"
					/>
					<image :src="codeUrl" @click="getCodeUrl"></image>
				</view>
			</uni-forms-item>
			<view class="settings-row">
				<checkbox-group @change="changeRemember">
					<label>
						<checkbox
							value="1"
							:checked="isRememberPwd"
							style="transform: scale(0.75)"
						/>
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
import { phonenumber, password, verify } from '@/utils/validate.js'
import { captchaImage, appLogin } from '@/api/index.js'
import { encrypt, decrypt } from '@/utils/rsa.js'
export default {
	data() {
		return {
			formData: {
				phonenumber: '',
				password: '',
				// phonenumber: '15888888888', // 若依-申请人
				// phonenumber: '15065014525', // 若依-申请人
				// phonenumber: '18168935982', // 项目经理1
				// phonenumber: '17766365691', // 阚庆武-网格员
				// password: 'admin123',
				code: '',
				uuid: ''
			},
			rules: {
				phonenumber,
				password,
				code: verify('验证码', 'input')
			},
			codeUrl: '',
			isRememberPwd: true
		}
	},
	onLoad() {
		const phonenumber = uni.getStorageSync('phonenumber')
		const password = uni.getStorageSync('password')
		if (phonenumber && password) {
			this.formData.phonenumber = phonenumber
			this.formData.password = password
			this.isRememberPwd = true
		}
		this.getCodeUrl()
	},
	methods: {
		...mapMutations(['SET_TOKEN']),
		...mapActions(['GetInfo']),
		async getCodeUrl() {
			const { code, img, uuid } = await captchaImage()
			if (code === 200) {
				this.codeUrl = 'data:image/gif;base64,' + img
				this.formData.uuid = uuid
			}
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
				console.log(res);
				if (res.code === 200) {
					if (this.isRememberPwd) {
						const { phonenumber, password } = this.formData
						uni.setStorageSync('phonenumber', phonenumber)
						uni.setStorageSync('password', password)
					} else {
						uni.removeStorageSync('phonenumber')
						uni.removeStorageSync('password')
					}
					this.SET_TOKEN(res.token)

					this.GetInfo()
				} else {
					this.getCodeUrl()
				}
			})
		}
	}
}
</script>

<style lang="scss">
$input-height: 88rpx;
	
.container {
	// padding: 40rpx;
	background-image: linear-gradient(
		to right bottom,
		rgba(250, 255, 217, 0.3),
		rgba(207, 255, 212, 0.4) 30%,
		rgba(208, 241, 255, 0.5) 70%
	);
}

.uni-forms {
	padding: 40rpx;
}

/deep/ {
	.is-required {
		display: none;
	}

	.uni-forms-item__label {
		padding: 0 !important;
	}

	image,
	.uni-easyinput__content-input {
		height: $input-height !important;
	}
}

.code-row {
	display: flex;

	image {
		width: 240rpx;
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
	margin: $input-height 0 0;
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
