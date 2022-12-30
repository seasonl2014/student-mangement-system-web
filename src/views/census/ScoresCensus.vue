<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;"><Histogram /></el-icon>班级科目成绩统计
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-select v-model="gradeClassId" placeholder="请选择班级" style="width: 100%;" @change="changeCourse">
                <el-option v-for="item in gradeClassOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select v-model="courseId" placeholder="请选择科目" style="width: 100%;" @change="changeCourse">
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->

      </div>
    </template>
    <!--头部 end-->
    <!--echarts start-->
    <ScoreCensusPie :seriesData="seriesData" :legendData="legendData" height="400px" width="100%" id="pie"/>
    <!--echarts end-->
  </el-card>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
// 定义班级下拉选择项
import {gradeClassListApi} from "../../api/student/student";
import {getAllCourseListApi} from "../../api/teacher/teacher";
import ScoreCensusPie from './components/ScoreCensusPie.vue'
import {getScoreCensusApi} from "../../api/census/census";
// 定义班级ID
const gradeClassId = ref()
const gradeClassOptions = ref<object[]>([])
// 获取所有班级列表
async function gradeClassList() {
  try {
    const { data } = await gradeClassListApi()
    if (data.status === 200) {
      gradeClassOptions.value = data.result
    }
  } catch (e) {
    console.log(e)
  }
}
// 定义科目ID
const courseId = ref()
// 定义课程下拉选择项
const courseOptions = ref<object[]>([])
// 获取所有课程列表
async function getAllCourseList() {
  try {
    const { data } = await getAllCourseListApi()
    if (data.status === 200) {
      courseOptions.value = data.result
    }
  } catch (e) {
    console.log(e)
  }
}

const legendData = ref(["优","良","一般","较差","不及格"])
const seriesData = ref([])

// 统计班级科目成绩
const getScoreCensus = async ()=> {
  const { data } = await getScoreCensusApi(courseId.value,gradeClassId.value)

  if(data.status===200){
    seriesData.value = data.result
    console.log(`data.result is: ${data.result}`)
  }

}

const changeCourse = async ()=> {
  if(gradeClassId.value!==null&&gradeClassId.value!==""&&courseId.value!==null&&courseId.value!==""){
    await getScoreCensus()
  }
}

//挂载后加载数据
onMounted(() => {
  getAllCourseList()
  gradeClassList()
})

</script>

<style scoped>
.card-header {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /*内容对齐方式 */
  align-items: center; /*设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式*/
}
.card-header h3 {
  display: inline-flex; /*行内块元素*/
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #178557;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  border-radius: 0px;
  border: none;
}

</style>
