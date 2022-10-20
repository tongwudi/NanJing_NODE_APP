import store from '@/store/index.js'

class Request {
	constructor(config = {}) {
		this.config = {};
		this.config.baseUrl = config.baseUrl ? config.baseUrl : '';
		this.config.dataType = config.dataType ? config.dataType : 'json';
		this.config.responseType = config.responseType ? config.responseType : 'text';
		this.config.header = config.header ? config.header : {};
		this.reqInterceptors = null;
		this.resInterceptors = null;
		this.interceptors = {
			request: fn => {
				this.reqInterceptors = fn;
			},
			response: fn => {
				this.resInterceptors = fn;
			}
		}
	}
	/**
	 * @param showLoading 是否开启全局 loading 效果，引用了 uni-load-more 组件的不必要开启
	 * */
	async get(url, data = {}, showLoading = true) {
		const config = { data, showLoading }
		return this._request('get', url, config);
	}
	async post(url, data = {}, showLoading = true) {
		const config = { data }
		return this._request('post', url, config);
	}
	async put(url, config = {}) {
		return this._request('put', url, config);
	}
	async delete(url, config = {}) {
		return this._request('delete', url, config);
	}
	/**
	 * 上传文件到服务器
	 * @param tempFile 文件临时地址
	 * */
	upload(url, tempFile, config = {}) {
		const _this = this;
		let newConfig = this._deepCopy(this._merge(this.config, config));
		let lastConfig = {};
		if (this.reqInterceptors && typeof this.reqInterceptors === 'function') {
			let reqInterceptors = this.reqInterceptors(newConfig);
			if (!reqInterceptors && process.env.NODE_ENV === "development") {
				console.warn('请求被拦截，此消息仅在开发环境显示。')
				return false;
			} else if (Object.prototype.toString.call(reqInterceptors) === "[object Promise]") {
				return reqInterceptors;
			}
			lastConfig = this._deepCopy(reqInterceptors);
		} else {
			lastConfig = this._deepCopy(newConfig);
		}
		let fullUrl = this._formatUrl(lastConfig.baseUrl, url);

		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: fullUrl,
				header: lastConfig.header,
				filePath: tempFile,
				name: 'files',
				timeout: 20000, // 超时时间 20s
				async complete(response) {
					response.data = JSON.parse(response.data)
					let res = response
					if (_this.resInterceptors && typeof _this.resInterceptors === 'function') {
						let resInterceptors = _this.resInterceptors(res);
						if (!resInterceptors) {
							reject('返回值已被您拦截！');
							return;
						} else if (Object.prototype.toString.call(resInterceptors) ===
							"[object Promise]") {
							try {
								let promiseRes = await resInterceptors;
								resolve(promiseRes)
							} catch (error) {
								reject(error)
							}
						} else {
							res = resInterceptors;
						}
					}
					resolve(res)
				}
			})
		})
	}
	setConfig(config = {}) {
		this.config = this._deepCopy(this._merge(this.config, config));
	}
	getConfig() {
		return this.config;
	}
	_request(method, url, config) {
		this.setConfig(config)

		const _this = this;
		let newConfig = this._deepCopy(this._merge(this.config, config));
		let lastConfig = {};
		if (this.reqInterceptors && typeof this.reqInterceptors === 'function') {
			let reqInterceptors = this.reqInterceptors(newConfig);
			if (!reqInterceptors && process.env.NODE_ENV === "development") {
				console.warn('请求被拦截，此消息仅在开发环境显示。')
				return false;
			} else if (Object.prototype.toString.call(reqInterceptors) === "[object Promise]") {
				return reqInterceptors;
			}
			lastConfig = this._deepCopy(reqInterceptors);
		} else {
			lastConfig = this._deepCopy(newConfig);
		}
		let fullUrl = this._formatUrl(lastConfig.baseUrl, url);

		return new Promise((resolve, reject) => {
			uni.request({
				url: fullUrl,
				method,
				data: lastConfig.data ? lastConfig.data : {},
				header: lastConfig.header,
				dataType: lastConfig.dataType,
				responseType: lastConfig.responseType,
				timeout: 20000, // 超时时间 20s
				async complete(response) {
					let res = response;
					res.showLoading = config.showLoading
					if (_this.resInterceptors && typeof _this.resInterceptors === 'function') {
						let resInterceptors = _this.resInterceptors(res);
						if (!resInterceptors) {
							reject('返回值已被您拦截！');
							return;
						} else if (Object.prototype.toString.call(resInterceptors) ===
							"[object Promise]") {
							try {
								let promiseRes = await resInterceptors;
								resolve(promiseRes)
							} catch (error) {
								reject(error)
							}
						} else {
							res = resInterceptors;
						}
					}
					resolve(res);
				}
			});
		})
	}
	_formatUrl(baseUrl, url) {
		if (!baseUrl) return url;
		let formatUrl = '';
		const baseUrlEndsWithSlash = baseUrl.endsWith('/');
		const urlStartsWithSlash = url.startsWith('/');
		if (baseUrlEndsWithSlash && urlStartsWithSlash) {
			formatUrl = baseUrl + url.substring(1);
		} else if (baseUrlEndsWithSlash || urlStartsWithSlash) {
			formatUrl = baseUrl + url;
		} else {
			formatUrl = baseUrl + '/' + url;
		}
		return formatUrl;
	}
	_merge(oldConfig, newConfig) {
		let mergeConfig = this._deepCopy(oldConfig);
		if (!newConfig || !Object.keys(newConfig).length) return mergeConfig;
		for (let key in newConfig) {
			if (key !== 'header') {
				mergeConfig[key] = newConfig[key];
			} else {
				if (Object.prototype.toString.call(newConfig[key]) === '[object Object]') {
					for (let headerKey in newConfig[key]) {
						mergeConfig[key][headerKey] = newConfig[key][headerKey];
					}
				}
			}
		}
		return mergeConfig;
	}
	_deepCopy(obj) {
		let result = Array.isArray(obj) ? [] : {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === 'object') {
					result[key] = this._deepCopy(obj[key]);
				} else {
					result[key] = obj[key];
				}
			}
		}
		return result;
	}
}

if (!global.$request) {
	global.$request = new Request();
}

// app不支持 api 代理，要写完整地址
global.$request.setConfig({
	baseUrl: 'http://2c7255v996.51vip.biz'
})

// 避免出现 "请注意 showLoading 与 hideLoading 必须配对使用" 警告
let count = 0

// 设置请求拦截器
global.$request.interceptors.request(config => {
	// 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数

	// 追加请求头，推荐
	// config.header['content-type'] = 'application/json';
	// 覆盖请求头
	// config.header = {
	// 'content-type': 'application/json',
	// 'token': 'token from interceptors'
	// }
	const token = store.state.token;
	!!token && (config.header['Authorization'] = 'Bearer ' + token)

	// showLoading 与 showToast 共用提示框，使用 showToast 与 hideLoading 效果相同
	if (config.showLoading) {
		count++
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
	}

	// return false; // 终止请求
	// return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获
	return config; // 返回修改后的配置，如未修改也需添加这行
})

// 设置响应拦截器
global.$request.interceptors.response(res => {
	// 接收请求，执行响应操作
	if (res.statusCode == 200) {
		const { code, msg } = res.data

		// 一般情况页面不需要再次判断code值，除非逻辑需要非200判断，比如登录时验证码错误会返回500
		if (code === 200) {
			if (res.showLoading) {
				count--
				uni.hideLoading()
			}
			return res.data
		} else if (code === 401) {
			uni.showToast({
				title: '请重新登录',
				icon: 'error'
			})
		} else {
			uni.showToast({
				title: msg,
				icon: 'error'
			})
			return res.data
		}
	} else {
		uni.showToast({
			title: '请求失败',
			icon: 'error'
		})
		uni.stopPullDownRefresh()
	}
	// 您的逻辑......
	// return false;    // 阻止返回,页面不会接收返回值
	// return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值
	// return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获
	// return res.data; // 原样返回
})


export default global.$request;
