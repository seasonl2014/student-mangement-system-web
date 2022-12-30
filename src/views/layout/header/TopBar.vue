<template>
<div class="main">
  <div class="tool-left">
    <CollapseIcon/>
    <Hamburger/>
  </div>
    <div class="linkBox">
      <!--登录用户信息 start-->
      <el-popover
          :width="320"
      >
        <!--用户头像 start-->
        <template #reference>
          <el-link :underline="false">
            <!-- 用户没设置头像的情况下使用系统默认的 -->
            <img v-if="userInfo.userIcon" :src="url+'uploadFile/'+userInfo.userIcon"
                 style="width: 50px;border-radius: 50px;" />
            <img v-else src="../../../assets/default_avatar.png"
                 style="width: 40px;border-radius: 50px;">
            <span>{{userInfo.realname}}</span>
          </el-link>
        </template>
        <!--用户头像 end-->
        <!--用户信息 start-->
        <template #default>
          <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
            <div class="demo-rich-conent-custom">
              <!-- 用户没设置头像的情况下使用系统默认的 -->
              <img v-if="userInfo.userIcon" :src="url+'uploadFile/'+userInfo.userIcon"/>
              <img v-else  src="../../../assets/default_avatar.png">
              <p class="demo-rich-content__name">
                用户名：{{userInfo.username}}
              </p>
              <p class="demo-rich-content__mention">
                Email：{{userInfo.email}}
              </p>
              <p class="demo-rich-content__mention">
                注册时间：{{formatTime(userInfo.createTime,'yyyy-MM-dd HH:mm:ss')}}
              </p>
            </div>
            <p class="demo-rich-content__desc" style="margin: 0">
            <div
                style="float:left;width: 75px;padding:10px;border-right: 1px solid rgb(205, 205, 205);text-align: center;">
              <p>性别</p>
              <p style="font-size: 25px;font-weight:600;">
                {{ userInfo.sex }}
                <span style="font-size: 10px;font-weight:100;margin-left:5px;">孩</span>
              </p>
            </div>
            <div
                style="float:left;width: 80px;padding:10px;border-right: 1px solid rgb(205, 205, 205);text-align: center;">
              <p>注册</p>
              <p style="font-size: 25px;font-weight:600;">
                {{calculateDays(userInfo.createTime)}}
                <span style="font-size: 10px;font-weight:100;margin-left:5px;">天</span>
              </p>
            </div>
            <div style="float:left;width: 75px;padding:10px;text-align: center;">
              <p>类型</p>
              <p style="font-size: 15px;font-weight:600;line-height: 40px;">
                <span >{{userInfo.role.name}}</span>
              </p>
            </div>
            </p>
          </div>
        </template>
        <!--用户信息 end-->
      </el-popover>
      <!--登录用户信息 end-->

      <!--退出系统 start-->
      <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" :icon="SwitchButton" icon-color="#30bcd7"
                     title="确认退出系统吗？" @confirm="exit">
        <template #reference>
          <el-link :underline="false">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出</span>
          </el-link>
        </template>
      </el-popconfirm>
      <!--退出系统 end-->

    </div>
</div>
  <TabsView/>
</template>

<script setup lang="ts">
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../../../store/modules/user'
import {loginOutApi} from '../../../api/login/login'
import CollapseIcon  from './CollapseIcon.vue'
import Hamburger from './Hamburger.vue'
import TabsView from '../tags/Index.vue'
import {calculateDays, formatTime} from "../../../utils/date";
const { userInfo } = useUserStore()
// 退出登录
const exit = async () => {

  const { data } = await loginOutApi();
  if(data.status===200){
    // 清除用户登录信息
    window.localStorage.removeItem("userStore");
    // 返回登录页
    window.location.href = "/";
  }

}
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  height: 70px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 10px;
  background: white;
}

.linkBox {
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  float: right;
}
.linkBox .el-link {
  margin-right: 25px;
  color: #8c8c8c;
}
.linkBox .el-link:hover {
  color: #30bcd7;
}
.linkBox .el-link span {
  margin-left: 8px;
}

/* 鼠标滑过头像的样式 */
.demo-rich-conent-custom img {
  width: 55px;
  margin: 0px 15px 0px 0px;
  border-radius: 50px;
  float: left;
}

.demo-rich-conent-custom p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tool-left{
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
