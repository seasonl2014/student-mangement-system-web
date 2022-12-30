import request from '../request'
export function getGradeClassListApi(data:object) {
    return request({
        url: 'gradeclass',
        method: 'get',
        params: data
    })
}
// 添加班级信息
export function addGradeClassApi(data:object) {
    return request({
        url: 'gradeclass',
        method: 'post',
        data
    })
}
// 根据ID获取班级信息
export function getGradeClassApi(id:number) {
    return request({
        url: `gradeclass/${id}`,
        method: 'get'
    })
}
// 更新班级信息
export function editGradeClassApi(data:object) {
    return request({
        url: 'gradeclass',
        method: 'put',
        data
    })
}
// 根据ID删除班级信息
export function deleteGradeClassApi(id:number) {
    return request({
        url: `gradeclass/${id}`,
        method: 'delete'
    })
}
