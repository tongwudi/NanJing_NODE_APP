import http from '@/config/request.js'

// 验证码
export const captchaImage = () => http.get('/captchaImage')
// 登录
export const appLogin = data => http.post('/appLogin', data)
// 获取个人信息
export const getInfo = () => http.get('/getInfo')
// 发起申请
export const startApply = data => http.Post('/enter/room/start', data)
// 查询我的代办
export const searchTodo = data => http.get('/enter/room/searchTodo', { data })