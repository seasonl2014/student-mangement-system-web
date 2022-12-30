<template>
<div class="home">
  <!--顶部背景图和内容 start-->
  <div class="top_bg">
    <h1>好好学习，天天向上</h1>
    <p>学生信息管理系统·欢迎您，admin</p>
  </div>
  <!--顶部背景图和内容 end-->
  <!--本站数据统计 start-->
  <p style="margin-bottom:15px;color: #144b9f;">
  <div style="width: 12px;height:12px;background-color:#f9a332;border-radius: 50%;float: left;margin-top: 5px;
            margin-right: 8px;"></div>本站数据统计
  </p>
  <el-row :gutter="40" class="data_row">
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
      <div style="background: linear-gradient(to right, #6D80FE, #23D2FD);">
        <div class="data_left">
          <el-icon>
            <Avatar />
          </el-icon>
        </div>
        <div class="data_right">
          <h1>{{studentNums}}<span>人</span></h1>
          <p>学生人数</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
      <div style="background: linear-gradient(to right, #FF988B, #FF6B88);">
        <div class="data_left">
          <el-icon>
            <Reading />
          </el-icon>
        </div>
        <div class="data_right">
          <h1>{{classNums}}<span>个</span></h1>
          <p>班级个数</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
      <div style="background: linear-gradient(to right, #09B0E8, #29F49A);">
        <div class="data_left">
          <el-icon>
            <ChatDotSquare />
          </el-icon>
        </div>
        <div class="data_right">
          <h1>{{ teacherNums }}<span>人</span></h1>
          <p>教师人数</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
      <div style="background: linear-gradient(to right, #717CFE, #FC83EC);">
        <div class="data_left">
          <el-icon>
            <Clock />
          </el-icon>
        </div>
        <div class="data_right">
          <h1>{{courseNums}}<span>门</span></h1>
          <p>课程数量</p>
        </div>
      </div>
    </el-col>
  </el-row>
  <!--本站数据统计 end-->
  <!--学科成绩对比统计 start-->
  <p style="margin-bottom:15px;color: #144b9f;">
  <div style="width: 12px;height:12px;background-color:#f9a332;border-radius: 50%;float: left;margin-top: 5px;
            margin-right: 8px;"></div>学科成绩对比统计
  </p>
  <el-row>
    <el-col>
      <AllSubjectScoreContrast :legendData="legendData" :seriesData="seriesData" :categoryData="categoryData"  height="400px" width="100%" id="bar"/>
    </el-col>
  </el-row>
  <!--学科成绩对比统计 end-->
</div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {getIndexTotalApi} from "../../api/home/home";
import AllSubjectScoreContrast from './components/AllSubjectScoreContrast.vue'

const studentNums = ref(0)
const classNums = ref(0)
const teacherNums = ref(0)
const courseNums = ref(0)
const legendData = ref(['总人数','平均成绩', '最高成绩', '最低成绩'])
const seriesData = ref([])
const categoryData = ref([])

const getIndexTotal = async ()=> {
  const { data } = await getIndexTotalApi()
  if(data.status===200){
    studentNums.value = data.result.studentNums
    classNums.value = data.result.classNums
    teacherNums.value = data.result.teacherNums
    courseNums.value = data.result.courseNums
    categoryData.value = data.result.scores.categoryList
    seriesData.value = data.result.scores.barEchartsSeriesList
  }
}



//挂载后加载数据
onMounted(() => {
  getIndexTotal();
})
</script>

<style scoped>
.home {
  width: 100%;
}
.top_bg {
  width: 100%;
  height: 200px;
  background-image: url(../../assets/banner01.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  line-height: 60px;
  text-align: center;
  margin: 0 auto 10px;
}

.top_bg h1 {
  font-size: 60px;
  text-shadow: 3px 3px 0px #515151;
  padding-top: 50px;
}

.top_bg p {
  font-weight: lighter;
  font-size: 18px;
}

.data_row .el-col {
  height: 100px;
  margin-bottom: 20px;
  overflow: hidden;
}

.data_row .el-col>div {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  color: white;
}
.data_left {
  float: left;
  width: 40%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.data_left .el-icon {
  font-size: 60px;
}
.data_right {
  width: 60%;
  float: right;
  margin-top: 10px;
}

.data_right h1 {
  font-size: 40px;
}

.data_right h1 span {
  font-size: 15px;
  margin-left: 10px;
}

.data_right p {
  font-size: 14px;
  font-weight: 600;
  margin-left: 3px;
}
</style>
