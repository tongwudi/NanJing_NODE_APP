import http from '@/config/request.js'

// 验证码
export const captchaImage = () => http.get('/captchaImage')
// 登录
export const appLogin = data => http.post('/appLogin', data)
// 获取个人信息
export const getInfo = () => http.get('/getInfo')
// 发起申请
export const startApply = data => http.post('/enter/room/start', data)
// 查询我的代办
export const searchTodo = data => http.get('/enter/room/searchTodo', data)
// 任务审批
export const completeTask = data => http.post('/enter/room/completeTask', data)
// 获取行政区域
export const getCounty = () => http.get('/room/info/getCounty')
// 根据区域获取机房
export const getRoomByCounty = county => http.get('/room/info/getRoomByCounty?county=' + county)
// 获取项目经理
export const getLeader = () => http.get('/enter/room/getLeader')
// 获取进出类型
export const getApplyType = () => http.get('/apply/type/list')
