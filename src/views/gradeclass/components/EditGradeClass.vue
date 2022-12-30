<template>
  <el-form ref="ruleFormRef" :rules="rules"  :model="formGradeClass"  label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="班级编号" prop="code">
          <el-input v-model="formGradeClass.code" placeholder="请输入班级编号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="formGradeClass.name" placeholder="请输入班级名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="年级" prop="grade">
          <el-input v-model="formGradeClass.grade" placeholder="请输入年级" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="班级" prop="clazz">
          <el-input v-model="formGradeClass.clazz" placeholder="请输入班级" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
              v-model="formGradeClass.remarks"
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
    <el-button color="#178557" :loading="subLoading" type="success" @click="editGradeClass(ruleFormRef)">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {ElMessage} from 'element-plus'
import {editGradeClassApi} from "../../../api/gradeclass/gradeclass";
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true, message: '班级名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '班级不能为空', trigger: 'blur' }],
  grade: [{ required: true, message: '年级不能为空', trigger: 'blur' }],
  clazz: [{ required: true, message: '班级不能为空', trigger: 'blur' }]
})
const formGradeClass = reactive({
  id: 0,
  name: '',
  code: '',
  clazz: 1,
  grade: 2022,
  remarks: ''
})
const props = defineProps(['gradeClassInfo'])
const gradeClassInfo = ref(props.gradeClassInfo)
const emit = defineEmits(['closeEditGradeClassForm','success'])
// 给表单填充数据
for (const key in formGradeClass) {
  formGradeClass[key] = gradeClassInfo.value[key]
}
// 编辑班级信息
const editGradeClass = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } =  await editGradeClassApi(formGradeClass)
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
// 取消表单
const close = ()=> {
  emit('closeEditGradeClassForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
