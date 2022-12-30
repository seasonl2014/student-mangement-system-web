import {defineStore} from 'pinia'
import {asyncRoutes, staticRouter} from "../../router";
export const useMenuStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id:'menuState',
    // state: 返回对象的函数
    state: ()=>({
        // menu 静态路由
        routers:[],
        // 动态路由
        addRouters: [],
        // 用户角色
        roles: []
    }),
    getters: {},
    actions: {
        // 设置角色
        generateRoutes: function ({roles}: { roles: any }) {
            let accessedRoutes = filterAsyncRoutes({routes: asyncRoutes, roles: roles})
            this.addRouters = accessedRoutes
            this.routers = staticRouter.concat(accessedRoutes)
            return accessedRoutes
        },
        // 动态生成访问路由
        setRoles({roles}: { roles: any }) {
            this.roles = roles
        }
    }
})
// 通过递归过滤asyncRoutes
export function filterAsyncRoutes ({routes, roles}: { routes: any, roles: any }) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes({routes: tmp.children, roles: roles})
            }
            res.push(tmp)
        }
    })
    return res
}
function hasPermission (roles, route) {
    if (route.meta && route.meta.role) {
        // some() 方法用于检测数组中的元素是否满足指定条件（函数提供）
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}
