import {defineStore} from 'pinia'
export const useSettingStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id:'settingState',
    // state: 返回对象的函数
    state: ()=>({
        // menu 是否收缩
        isCollapse:true,
        // tagsView 是否展示 默认展示
        showTag:true,
    }),
    getters: {},
    actions:{
        // 切换 Collapse
        setCollapse(value: boolean){
            this.isCollapse = value
        }
    }
})
