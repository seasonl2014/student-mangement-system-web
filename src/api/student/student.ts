import request from '../request'
export function getStudentListApi(data:object) {
    return request({
        url: 'student',
        method: 'get',
        params: data
    })
}
// 添加学生信息
export function addStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'post',
        data
    })
}
// 获取所有班级列表
export function gradeClassListApi() {
    return request({
        url: 'gradeclass/all',
        method: 'get'
    })
}
// 根据ID获取学生信息
export function getStudentApi(id:number) {
    return request({
        url: `student/${id}`,
        method: 'get'
    })
}
// 更新学生信息
export function editStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'put',
        data
    })
}
// 根据ID删除学生信息
export function deleteStudentApi(id:number) {
    return request({
        url: `student/${id}`,
        method: 'delete'
    })
}
