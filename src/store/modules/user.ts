import {defineStore} from 'pinia'
export const useUserStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id:'userStore',
    // state: 返回对象的函数
    state: ()=>{
        return {
            // 登录token
            token: '',
            // 登录用户信息
            userInfo:{},
            // 角色
            roles:[]
        }
    },
    getters: {},
    // 可以同步 也可以异步
    actions:{
        // 设置登录token
        setToken(token:string){
            this.token = token;
        },
        // 设置登录用户信息
        setUserInfo(userInfo:any){
            this.userInfo = userInfo
        }
    },
    persist: true
})
