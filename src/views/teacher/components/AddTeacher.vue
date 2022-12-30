<template>
  <el-form ref="ruleFormRef" :rules="rules"  :model="formTeacher"  label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="gradeClass" label="教授科目">
          <el-select v-model="formTeacher.course.id" placeholder="请选择科目" style="width: 100%;">
            <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="教师工号" prop="teachno">
          <el-input v-model="formTeacher.teachno" placeholder="请输入教师工号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="formTeacher.name" placeholder="请输入教师姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-input v-model="formTeacher.sex" placeholder="请输入性别" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formTeacher.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="formTeacher.qq" placeholder="请输入QQ号" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
              v-model="formTeacher.remarks"
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
    <el-button color="#178557" :loading="subLoading" type="success" @click="addTeacher(ruleFormRef)">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {addTeacherApi, getAllCourseListApi} from "../../../api/teacher/teacher";
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const subLoading = ref(false)
const formTeacher = reactive({
  name: '',
  teachno: '',
  sex: '',
  phone: '',
  course: {
    id: ''
  },
  qq: '',
  remarks: ''
})
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true, message: '教师姓名不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  qq: [{ required: true, message: 'qq号不能为空', trigger: 'blur' }],
  course: [{ required: true, message: '教授科目不能为空', trigger: 'blur' }],
  teachno: [{ required: true, message: '教师工号不能为空', trigger: 'blur' }],
})
// 新增教师信息
const addTeacher = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } =  await addTeacherApi(formTeacher)
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
getAllCourseList()
const emit = defineEmits(['closeAddTeacherForm','success'])
// 取消表单
const close = ()=> {
  emit('closeAddTeacherForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
