import request from '../request'

// 获取用户列表数据
export function getUserListApi(data:object) {
    return request({
        url: 'user',
        method: 'get',
        params: data

    })
}
// 添加用户信息
export function addUserApi(data:object) {
    return request({
        url: 'user',
        method: 'post',
        data
    })
}
// 根据ID获取用户信息
export function getUserApi(id:number) {
    return request({
        url: `user/${id}`,
        method: 'get'
    })
}
// 更新用户信息
export function editUserApi(data:object) {
    return request({
        url: 'user',
        method: 'put',
        data
    })
}
// 根据ID删除用户信息
export function deleteUserApi(id:number) {
    return request({
        url: `user/${id}`,
        method: 'delete'
    })
}
// 更新个人信息
export function updateInfoApi(data:object) {
    return request({
        url: 'user/updateInfo',
        method: 'put',
        data
    })
}
// 发送验证码
export function sendEmailApi(email:string) {
    return request({
        url: 'user/sendEmail',
        method: 'get',
        params: {
            email
        }

    })
}

// 校验用户输入验证码是否正确
export function verifyCodeApi(code:string) {
    return request({
        url: 'user/verifyCode',
        method: 'get',
        params: {
            code
        }

    })
}

// 更改绑定邮箱
export function updateEmailApi(email:string,code:number) {
    return request({
        url: 'user/updateEmail',
        method: 'put',
        params: {
            email,
            code
        }

    })
}
// 更改个人密码
export function updatePwdApi(data:object) {
    return request({
        url: 'user/updatePwd',
        method: 'put',
        data
    })
}

// 获取所有角色列表
export function getAllRoleListApi() {
    return request({
        url: 'role/all',
        method: 'get'
    })
}
