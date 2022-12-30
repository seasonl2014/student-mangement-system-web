<template>
<el-card class="box-card">
  <!--头部 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right: 10px;"><UserFilled /></el-icon>用户管理
      </h3>

      <!--搜索区域 start-->
       <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search"
                        placeholder="关键字搜索（回车）"/>
            </el-col>
            <el-col :span="6">
              <el-select v-model="status" placeholder="请选择状态">
                <el-option label="全部" value="-1"/>
                <el-option label="封禁" value="0"/>
                <el-option label="正常" value="1"/>
              </el-select>
            </el-col>
            <el-col :span="8">
              <div class="my-button">
                <el-button plain style="width: 50%;" color="#2fa7b9" @click="addUser">添加用户</el-button>
                <el-button @click="exportExcelAction" type="primary">
                  <el-icon style="margin-right: 6px"><Download /></el-icon>导出 Excel
                </el-button>
              </div>

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
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center" :cell-style="{textAlign: 'center'}"
    :header-cell-style="{fontSize: '15px', background: '#178557',color: 'white',textAlign: 'center'}">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>
      <el-table-column label="用户名称">
        <template #default="scope">
          <el-tooltip :content="scope.row.username" palacement="top" effect="light">
            <span class="highlight">{{scope.row.username}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="真实姓名">
        <template #default="scope">
          <el-tooltip :content="scope.row.realname" palacement="top" effect="light">
            <span class="highlight">{{scope.row.realname}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template #default="scope">
          <el-tooltip :content="scope.row.sex" palacement="top" effect="light">
            <span class="highlight">{{scope.row.sex}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="邮箱">
        <template #default="scope">
          <el-tooltip :content="scope.row.email" palacement="top" effect="light">
            <span class="highlight">{{scope.row.email}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="角色名称">
        <template #default="scope">
            <span class="highlight">{{scope.row.sysRole.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色编号">
        <template #default="scope">
          <span class="highlight">{{scope.row.sysRole.code}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <div v-if="scope.row.status == 1" style="color: #67C23A;">正常</div>
          <div v-if="scope.row.status == 0" style="color: #F56C6C;">封禁</div>
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
          <el-button size="small"
                     style="margin: 0 0 10px 10px;" @click="editUser(scope.row.id)">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                         icon-color="#626AEF" :title="'确定删除用户名为“'+scope.row.username+'”的用户吗？'"
                         @confirm="delUser(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" style="margin-bottom: 10px;">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>

    <!--分页 start-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                   v-model:page-size="pageSize"
                   @current-change="changePage"
                   :page-sizes="[10, 20, 30, 40]"/>
    <!--分页 end-->
  </div>
  <!--表格区域 end-->
</el-card>

  <!--新增用户弹出框 start-->
  <el-dialog  align-center  v-model="userDialogFormVisible"  width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{title}}</h1>
      </div>

    </template>
    <!--添加用户组件 start-->
    <AddUser @closeAddUserForm="closeAddUserForm" @success="success"/>
    <!--添加用户组件 end-->
  </el-dialog>
  <!--新增用户弹出框 end-->

  <!--编辑用户弹出框 start-->
  <el-dialog  align-center v-model="editUserDialogFormVisible"  width="42%" destroy-on-close>
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{editTitle}}</h1>
      </div>

    </template>
    <!--编辑用户组件 start-->
    <EditUser :userInfo="userInfo" @closeEditUserForm="closeEditUserForm" @success="success"/>
    <!--编辑用户组件 end-->
  </el-dialog>
  <!--编辑用户弹出框 end-->

</template>

<script setup lang="ts">
import { onMounted,reactive,toRefs, watch ,ref } from 'vue'
import {Search, Delete} from '@element-plus/icons-vue'
import {ElMessage, ElNotification, ElMessageBox} from 'element-plus'
import {deleteUserApi, getUserApi, getUserListApi} from "../../api/user/user"
import { formatTime } from "../../utils/date"
import AddUser from './components/AddUser.vue'
import EditUser from './components/EditUser.vue'
import { exportExcel } from '../../utils/exprotExcel'
// 添加用户弹窗状态
const userDialogFormVisible = ref(false)
const title = ref('新增用户')
// 编辑用户弹窗状态
const editUserDialogFormVisible = ref(false)
const editTitle = ref('编辑用户')

const state = reactive({
  // 搜索表单内容
  searchValue: "",
  // 表格全部信息
  tableData: [],
  // 当前点击的编辑信息
  userInfo:null,
  status: null,
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
})

// 获取用户列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空数据
  state.tableData=[]
  const params = {
    'pageIndex':state.pageIndex,
    'pageSize': state.pageSize,
    'status': state.status ==-1 ? '':state.status,
    'searchValue': state.searchValue
  }
  const { data } = await getUserListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

// 分页序号不乱
const Nindex = (index) => {
  // 当前页数 - 1 * 每页数据条数 + 1
  const page = state.pageIndex // 当前页码
  const pagesize = state.pageSize // 每页条数
  return index + 1 + (page - 1) * pagesize
}

// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val;
  loadData(state);
}

// 刷新按钮
const refresh = () => {
  // 搜索表单内容
  state.searchValue = null
  // 筛选下拉框内容
  state.status = null
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

// 监听用户状态下拉框内容的改变
watch(() => state.status, (val, preVal) => {
  if (val) {
    state.searchValue = ""
    if (state.status === -1) {
      // 全部
      loadData(null);
    } else {
      loadData(state)
    }
  }
})

// 添加用户
const addUser = ()=> {
  userDialogFormVisible.value = true
}

// 关闭新增用户弹出框
const closeAddUserForm = ()=> {
  userDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state);
  userDialogFormVisible.value = false
  editUserDialogFormVisible.value = false
}

// 编辑用户信息
const userInfo = ref()
const editUser = async (id:number)=> {
  const { data } = await getUserApi(id)
  userInfo.value = data.result
  editUserDialogFormVisible.value = true
}
// 关闭编辑用户弹出框
const closeEditUserForm = ()=> {
  editUserDialogFormVisible.value = false
}
// 删除用户信息
const delUser = async (id:number)=> {
  const { data } = await deleteUserApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state);
  }else {
    ElMessage.error('删除失败')
  }
}
const column = [
  {name: 'id',label: '用户id'},
  {name: 'username',label: '用户名称'},
  {name: 'realname',label: '真实姓名'},
  {name: 'sex',label: '性别'},
  {name: 'status',label: '状态'},
  {name: 'email',label: '邮箱'},
  {name: 'remarks',label: '备注'}
]
const exportExcelAction = () => {
  exportExcel({
    column,
    data:state.tableData,
    filename: '用户信息数据',
    format: 'xlsx',
    autoWidth: true,
  })
}

//挂载后加载数据
onMounted(() => {
  loadData(state);
})

const {tableData,pageIndex,pageSize,loading,total,status,searchValue} = toRefs(state)
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

/*新增用户弹出框自定义头部样式*/
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
