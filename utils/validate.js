const verify = (label, type) => {
	if (type === 'select') {
		return {
			rules: [{
				required: true,
				errorMessage: label + '未选择'
			}]
		}
	} else if (type === 'input') {
		return {
			rules: [{
				required: true,
				errorMessage: label + '不能为空'
			}]
		}
	} else if (type === 'datetime') {
		return {
			rules: [{
					required: true,
					errorMessage: label + '不能为空'
				},
				{
					validateFunction: (rule, value, data, callback) => {
						if (value.length < 12) {
							callback(label + '未选择具体时间')
						}
						return true
					}
				}
			]
		}
	} else {
		return {
			required: true,
			errorMessage: label + '不能为空'
		}
	}
}

module.exports = {
	verify,
	phonenumber: {
		rules: [
			verify('手机号'),
			{
				pattern: /^(13[0-9]|14[1579]|15[0-3,5-9]|16[6]|17[0123456789]|18[0-9]|19[89])\d{8}$/,
				errorMessage: '手机号格式不正确，请重新填写'
			}
		]
	},
	idcard: {
		rules: [
			verify('身份证号'),
			{
				pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
				errorMessage: '身份证号格式不正确，请重新填写'
			}
		]
	},
	email: {
		rules: [
			verify('邮箱'),
			{
				format: 'email',
				errorMessage: '邮箱格式不正确，请重新填写'
			}
		]
	},
	password: {
		rules: [
			verify('密码'),
			{
				validateFunction: (rule, value, data, callback) => {
					const reg =
						/(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/
					if (!reg.test(value)) {
						callback('数字、字母和特殊字符(除空格外)至少包含两种')
					} else if (value.length < 8) {
						callback('密码不能少于8位')
					} else if (value.length > 20) {
						callback('密码不能超过20位')
					}
					return true
				}
			}
		]
	},
	confirmPassword: {
		rules: [
			verify('确认密码'),
			{
				validateFunction: (rule, value, data, callback) => {
					if (value != data.password) {
						callback('两次输入密码不一致')
					}
					return true
				}
			}
		]
	}
}
