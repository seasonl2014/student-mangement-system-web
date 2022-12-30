<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;"><Money /></el-icon>班级科目成绩
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="12">
            <el-col :span="5">
              <el-select v-model="gradeClassId" placeholder="请选择班级" style="width: 100%;">
                <el-option v-for="item in gradeClassOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="5">
            <el-select v-model="courseId" placeholder="请选择科目" style="width: 100%;">
              <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            </el-col>
            <el-col :span="6">
              <el-button plain  color="#2fa7b9" @click="registerScores">登记成绩</el-button>
              <el-button plain @click="exportExcelAction" type="primary">
                <el-icon style="margin-right: 1px"><Download /></el-icon>导出 Excel
              </el-button>
            </el-col>
            <el-col :span="3">
              <el-input :prefix-icon="Search" v-model="stuno" @keyup.enter.native="search"
                        placeholder="学号搜索（回车）"/>
            </el-col>
            <el-col :span="3">
              <el-input :prefix-icon="Search" v-model="name" @keyup.enter.native="search"
                        placeholder="姓名搜索（回车）"/>
            </el-col>
            <el-col :span="2" style="display: inline-flex;justify-content: center;align-items: center; cursor: pointer;">
              <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh">
                <Refresh />
              </el-icon>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->

      </div>
    </template>
    <!--头部 end-->
    <!--表格区域 start-->
    <div class="table-box">
      <el-table row-key="id"  element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
                style="width: 100%;text-align: center" :cell-style="{textAlign: 'center'}"
                :header-cell-style="{fontSize: '15px', background: '#178557',color: 'white',textAlign: 'center'}"
                @cell-dblclick="celldblclick">

        <el-table-column label="序号" width="100" type="index" :index="Nindex"/>
        <el-table-column label="学号" prop="student.stuno">
          <template #default="scope">
            <span>{{scope.row.student.stuno}}</span>
          </template>
        </el-table-column>

        <el-table-column label="学生姓名" prop="name">
          <template #default="scope">
            <span>{{scope.row.student.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="coursename" label="学科">
          <template #default="scope">
            <span>{{scope.row.course.coursename}}</span>
          </template>
        </el-table-column>

        <el-table-column>
          <!-- 自定义表头 -->
          <template #header>
            <span>
              成绩
            </span>
            <el-icon>
              <Edit />
            </el-icon>
          </template>

          <!-- 自定义单元格内容 -->
          <template #default="scope">
            <div class="edit-score" v-if="scope.row.edit">
              <el-input
                  clearable
                  placeholder="请输入"
                  v-model="scope.row.score"
              ></el-input>
              <el-button type="success" size="small" @click="editScores(scope.row)"
                         style="margin: 0 0 10px 10px;">保存</el-button>
              <el-button type="warning" size="small" @click="cancel(scope.row)"
                         style="margin: 0 0 10px 10px;">取消</el-button>
            </div>

            <span  v-else>
              {{scope.row.score}}
               <el-tooltip content="双击编辑" placement="top" effect="light">
               <el-icon style="cursor:pointer;">
                  <Edit />
               </el-icon>
               </el-tooltip>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="type">
          <template #default="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <el-tooltip :content="scope.row.createTime" placement="top" effect="light">
              <span class="highlight">{{formatTime(scope.row.createTime, 'yyyy-MM-dd')}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                           icon-color="#626AEF" :title="'确定删除学生名为“'+scope.row.student.name+'”的成绩吗？'"
                           @confirm="delScores(scope.row.id)">
              <template #reference>
                <el-button size="small" type="danger" style="margin-bottom: 10px;">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!--表格区域 end-->
    <!--分页 start-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                   v-model:page-size="pageSize"
                   @current-change="changePage"
                   :page-sizes="[10, 20, 30, 40]"/>
    <!--分页 end-->
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive,toRefs, onMounted  } from 'vue'
// 定义班级下拉选择项
import {gradeClassListApi} from "../../api/student/student";
import {getAllCourseListApi} from "../../api/teacher/teacher";
import {deleteScoresApi, editScoresApi, getScoresListApi, registerScoresApi} from "../../api/scores/scores";
import { formatTime } from "../../utils/date"
import {ElMessage} from 'element-plus'
import {exportExcel} from "../../utils/exprotExcel";
// 定义班级ID
const gradeClassId = ref(null)
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
const courseId = ref(null)
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

const state = reactive({
  // 学号
  stuno: "",
  // 姓名搜索
  name: "",
  // 表格全部信息
  tableData: [],
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
})
// 获取成绩列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空数据
  state.tableData=[]
  const params = {
    'pageIndex':state.pageIndex,
    'pageSize': state.pageSize,
    'name': state.name,
    'stuno': state.stuno,
    'courseId': courseId.value,
    'gradeClassId': gradeClassId.value
  }
  const { data } = await getScoresListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false

}
const Nindex = (index) => {
  // 当前页数 - 1 * 每页数据条数 + 1
  const page = state.pageIndex // 当前页码
  const pagesize = state.pageSize // 每页条数
  return index + 1 + (page - 1) * pagesize
}
// 刷新按钮
const refresh = () => {
  // 根据姓名搜索
  state.name = ""
  // 根据学号搜索
  state.stuno = ""
  // 课程ID
  courseId.value = ""
  // 班级id
  gradeClassId.value = ""
  // 更新数据
  loadData(state);
}
// 搜索
const search = () => {
  if (state.name !== null&&state.name !== "") {
    ElMessage({
      type: 'success',
      message: `学生姓名“${state.name}”搜索内容如下`,
    })
    loadData(state)
  }

  if (state.stuno !== null&&state.stuno !== "") {
    ElMessage({
      type: 'success',
      message: `学号“${state.stuno}”搜索内容如下`,
    })
    loadData(state)
  }
}
// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val
  loadData(state)
}

// 登记班级学科成绩
const registerScores = async () => {
  if(gradeClassId.value < 1){
    ElMessage.success('请选择班级')
    console.log('gradeClassId.value:',gradeClassId.value)
    return false
  }
  if(courseId.value < 1){
    ElMessage.success('请选择学科')
    return false
  }
  const { data } =  await registerScoresApi(gradeClassId.value,courseId.value)
  if(data.status===200){
    await loadData(state)
    ElMessage.success(data.message)
  }else {
    ElMessage.error(data.message)
  }

}

// 定义单元格是否可编辑
const edit = ref(false)
// 双击单元格函数
const celldblclick = (row, column, cell, event)=> {
  const scoreTarget: any = state.tableData.find(item => {
    return item.id === row.id
  })
  if (scoreTarget !== undefined) {
    scoreTarget._originalData = { ...scoreTarget }
    scoreTarget.edit = !scoreTarget.edit
  }
}
// 取消编辑
const cancel = (key: any) => {
  key._originalData = { ...key }
  key.edit = !key.edit
}
// 保存编辑成绩
const editScores = async (record: { id: any; score: any; })=> {
  loading.value = true
  const { id,score } = record
  if(!score){
    loading.value = false
    ElMessage.error('提交失败，请更改成绩！')
    return
  }
  const { data } = await editScoresApi(id,score)
  if(data.status===200){
    ElMessage.success(data.message)
    await loadData(state)
  }else {
    ElMessage.error(data.message)
  }
  loading.value = false
}

// 删除成绩信息
const delScores = async (id:number)=> {
  const { data } = await deleteScoresApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state);
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: '成绩id'},
  {name: 'stuno',label: '学号'},
  {name: 'name',label: '学生姓名'},
  {name: 'coursename',label: '学科'},
  {name: 'score',label: '成绩'},
  {name: 'type',label: '类型'}
]
const exportExcelAction = () => {
  // 处理表格数据
  const newTableData = state.tableData.flatMap((item: any)=> {
    return {...item,...item.course,...item.student}
  })
  exportExcel({
    column,
    data:newTableData,
    filename: '班级学科成绩数据',
    format: 'xlsx',
    autoWidth: true,
  })
}

//挂载后加载数据
onMounted(() => {
  loadData(state)
  getAllCourseList()
  gradeClassList()
})
const {tableData,pageIndex,pageSize,loading,total,name,stuno} = toRefs(state)
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
/*分页样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #178557;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}
.edit-score {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

/*修改v-loading样式*/
:deep(.el-loading-spinner .el-loading-text){
  color: #178557;
}
:deep(.el-loading-spinner .path){
  stroke: #178557;
}

</style>
