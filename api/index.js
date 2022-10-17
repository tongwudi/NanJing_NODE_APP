import http from '@/utils/request.js'

// 获取验证码
export const captchaImage = () => http.get('/captchaImage')
// 登录
export const appLogin = data => http.post('/appLogin', data)
// 注册
export const appRegister = data => http.post('/appRegister', data)
// 获取邮箱验证码
export const sendEmail = data => http.get('/sendEmail', data)
// 修改密码
export const forgetCode = data => http.post('/forgetCode', data)
// 获取个人信息
export const getInfo = () => http.get('/getInfo')
// 发起申请
export const startApply = data => http.post('/enter/room/start', data)
// 申请列表
export const getApplyList = data => http.get('/enter/room/applyList', data)
// 待审批列表（我的待办）
export const searchTodo = data => http.get('/enter/room/searchTodo', data)
// 详情
export const viewTask = data => http.get('/enter/room/viewTask', data)
// 扫码详情
export const getRoomInfo = data => http.get('/enter/room/roomInfo', data)
// 验证打卡
export const verifyCode = data => http.get('/enter/room/enterVerify', data)
// 访问详情
export const getVisitInfo = data => http.get('/enter/room/visitInfo', data)
// 任务审批
export const completeTask = data => http.post('/enter/room/completeTask', data)
// 撤销
export const recallTask = data => http.get('/enter/room/recallTask', data)
// 审批记录列表
export const getApprovedRecord = data => http.post('/enter/room/doneList', data)
// 获取行政区域
export const getCounty = () => http.get('/room/info/getCounty')
// 根据区域获取机房
export const getRoomByCounty = data => http.get('/room/info/getRoomByCounty', data)
// 获取项目经理
export const getLeader = () => http.get('/enter/room/getLeader')
// 获取进出类型
export const getApplyType = () => http.get('/apply/type/list')
// 文件上传
export const uploadFiles = data => http.upload('/enter/room/uploadFiles', data)

