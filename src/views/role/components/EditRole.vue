<template>
  <el-form ref="ruleFormRef" :rules="rules"   :model="formRole"  label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formRole.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="角色编号" prop="code">
          <el-input v-model="formRole.code" placeholder="请输入角色编号" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
              v-model="formRole.remarks"
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
    <el-button color="#178557" :loading="subLoading" type="success" @click="editRole(ruleFormRef)">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {ElMessage} from 'element-plus'
import {editRoleApi} from "../../../api/role/role";
const subLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }],
})
const formRole = reactive({
  id: 0,
  code: '',
  name: '',
  remarks: ''
})
const props = defineProps(['roleInfo'])
const roleInfo = ref(props.roleInfo)
const emit = defineEmits(['closeEditRoleForm','success'])
// 给表单填充数据
for (const key in formRole) {
  formRole[key] = roleInfo.value[key]
}
// 编辑角色信息
const editRole = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true
    if (valid) {
      const { data } =  await editRoleApi(formRole)
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
  emit('closeEditRoleForm')
}
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
