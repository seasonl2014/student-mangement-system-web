import request from '../request'
export function getCourseListApi(data:object) {
    return request({
        url: 'course',
        method: 'get',
        params: data
    })
}
// 添加课程信息
export function addCourseApi(data:object) {
    return request({
        url: 'course',
        method: 'post',
        data
    })
}

// 根据ID获取课程信息
export function getCourseApi(id:number) {
    return request({
        url: `course/${id}`,
        method: 'get'
    })
}
// 更新课程信息
export function editCourseApi(data:object) {
    return request({
        url: 'course',
        method: 'put',
        data
    })
}
// 根据ID删除课程信息
export function deleteCourseApi(id:number) {
    return request({
        url: `course/${id}`,
        method: 'delete'
    })
}
