<template>
  <el-form ref="ruleFormRef" :rules="rules"  :model="formStudent"  label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item  label="所属班级" prop="gradeClass">
          <el-select v-model="formStudent.gradeClass.id" placeholder="请选择班级" style="width: 100%;">
            <el-option v-for="item in gradeClassOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="学号" prop="stuno">
          <el-input v-model="formStudent.stuno" placeholder="请输入学号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="formStudent.name" placeholder="请输入学生姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-input v-model="formStudent.sex" placeholder="请输入性别" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formStudent.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="formStudent.qq" placeholder="请输入QQ号" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
              v-model="formStudent.remarks"
              :rows="2"
              type="textarea"
              placeholder="请输入备注"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button color="#178557" :loading="subLoading" type="success" @click="editStudent(ruleFormRef)">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {ElMessage} from 'element-plus'
import {editStudentApi, gradeClassListApi} from "../../../api/student/student";
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const subLoading = ref(false)
const formStudent = reactive({
  id: 0,
  name: '',
  stuno: '',
  sex: '',
  phone: '',
  gradeClass: {
    id: ''
  },
  qq: '',
  remarks: ''
})
const emit = defineEmits(['closeEditStudentForm','success'])
const props = defineProps(['studentInfo'])
console.log('EditStudent:props--',props)
const studentInfo = ref(props.studentInfo)
// 给表单填充数据
for (const key in formStudent) {
  formStudent[key] = studentInfo.value[key]
}
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true, message: '学生姓名不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  qq: [{ required: true, message: 'qq号不能为空', trigger: 'blur' }],
  gradeClass: [{ required: true, message: '班级不能为空', trigger: 'blur' }],
  stuno: [{ required: true, message: '班级不能为空', trigger: 'blur' }],
})
// 编辑学生信息
const editStudent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } =  await editStudentApi(formStudent)
      if(data.status===200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    } else {
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('error submit!', fields)
    }
    subLoading.value = false
  })
}
// 定义班级下拉选择项
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
gradeClassList()
// 取消表单
const close = ()=> {
  emit('closeEditStudentForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
