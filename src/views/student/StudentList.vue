<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px;"><UserFilled /></el-icon>学生管理
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search"
                        placeholder="关键字搜索（回车）"/>
            </el-col>
            <el-col :span="11">
              <div class="my-button">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="addStudent">添加学生</el-button>
                <el-button @click="exportExcelAction" type="primary">
                  <el-icon style="margin-right: 1px"><Download /></el-icon>导出 Excel
                </el-button>
              </div>
            </el-col>
            <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center; cursor: pointer;">
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
      <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
                style="width: 100%;text-align: center" :cell-style="{textAlign: 'center'}"
                :row-class-name="rowClassName"
                :header-cell-style="{fontSize: '15px', background: '#178557',color: 'white',textAlign: 'center'}">

        <el-table-column label="序号" width="100" type="index" :index="Nindex"/>
        <el-table-column label="学号">
          <template #default="scope">
            <span>{{scope.row.stuno}}</span>
          </template>
        </el-table-column>

        <el-table-column label="姓名">
          <template #default="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="班级">
          <template #default="scope">
            <span>{{scope.row.gradeClass.code}}</span>
          </template>
        </el-table-column>

        <el-table-column label="性别">
          <template #default="scope">
            <span>{{scope.row.sex}}</span>
          </template>
        </el-table-column>

        <el-table-column label="手机号">
          <template #default="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>

        <el-table-column label="QQ号">
          <template #default="scope">
            <span>{{scope.row.qq}}</span>
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
            <el-button size="small" @click="editStudent(scope.row.id)"
                       style="margin: 0 0 10px 10px;">编辑</el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                           icon-color="#626AEF" :title="'确定删除学生名为“'+scope.row.name+'”的学生吗？'"
                           @confirm="delStudent(scope.row.id)">
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
  <!--新增学生弹出框 start-->
  <el-dialog  align-center v-model="addStudentDialogFormVisible"  width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{addTitle}}</h1>
      </div>

    </template>
    <!--添加学生组件 start-->
    <AddStudent @closeAddStudentForm="closeAddStudentForm" @success="success"/>
    <!--添加学生组件 end-->
  </el-dialog>
  <!--新增学生弹出框 end-->

  <!--编辑学生弹出框 start-->
  <el-dialog  align-center v-model="editStudentDialogFormVisible"  width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{editTitle}}</h1>
      </div>

    </template>
    <!--编辑学生组件 start-->
    <EditStudent :studentInfo="studentInfo" @closeEditStudentForm="closeEditStudentForm" @success="success" />
    <!--编辑学生组件 end-->
  </el-dialog>
  <!--编辑学生弹出框 end-->

</template>

<script setup lang="ts">
import { reactive,toRefs, onMounted, ref  } from 'vue'
import {deleteStudentApi, getStudentApi, getStudentListApi} from "../../api/student/student"
import { formatTime } from "../../utils/date"
import {ElMessage} from 'element-plus'
import AddStudent from "./components/AddStudent.vue"
import EditStudent from "./components/EditStudent.vue";
import {exportExcel} from "../../utils/exprotExcel";
// 新增学生弹窗状态
const addStudentDialogFormVisible = ref(false)
const addTitle = ref('新增学生')
// 编辑学生弹窗状态
const editStudentDialogFormVisible = ref(false)
const editTitle = ref('编辑学生')
const state = reactive({
  // 搜索表单内容
  searchValue: "",
  // 表格全部信息
  tableData: [],
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
})
// 获取学生列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空数据
  state.tableData=[]
  const params = {
    'pageIndex':state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getStudentListApi(params)
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
  // 搜索表单内容
  state.searchValue = ""
  // 更新数据
  loadData(state);
}
// 搜索
const search = () => {
  if (state.searchValue !== null) {
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`,
    })
    loadData(state)
  }
}
// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val;
  loadData(state);
}
// 添加学生
const addStudent = ()=> {
  addStudentDialogFormVisible.value = true
}
// 关闭新增学生弹出框
const closeAddStudentForm = ()=> {
  addStudentDialogFormVisible.value = false
}
// 提交表单回调函数
const success = ()=> {
  loadData(state);
  addStudentDialogFormVisible.value = false
  editStudentDialogFormVisible.value = false
}

// 编辑学生信息
const studentInfo = ref()
const editStudent = async (id:number)=> {
  const { data } = await getStudentApi(id)
  studentInfo.value = data.result
  editStudentDialogFormVisible.value = true
}
// 关闭编辑学生弹出框
const closeEditStudentForm = ()=> {
  editStudentDialogFormVisible.value = false
}
// 删除学生信息
const delStudent = async (id:number)=> {
  const { data } = await deleteStudentApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state);
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: '学生id'},
  {name: 'name',label: '学生姓名'},
  {name: 'stuno',label: '学号'},
  {name: 'sex',label: '性别'},
  {name: 'phone',label: '手机号'},
  {name: 'qq',label: 'QQ'}
]
const exportExcelAction = () => {
  exportExcel({
    column,
    data:state.tableData,
    filename: '学生信息数据',
    format: 'xlsx',
    autoWidth: true,
  })
}
//挂载后加载数据
onMounted(() => {
  loadData(state);
})
const {tableData,pageIndex,pageSize,loading,total,searchValue} = toRefs(state)
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
/*新增学生弹出框自定义头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
}
/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content:space-between;
}
/*修改v-loading样式*/
:deep(.el-loading-spinner .el-loading-text){
  color: #178557;
}
:deep(.el-loading-spinner .path){
  stroke: #178557;
}
</style>
