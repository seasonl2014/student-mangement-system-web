<template>
  <div class="hamburger-container" @click="handleCollapse">
    <el-icon class="icon" color="#178557" v-if="isCollapse" ><expand /></el-icon>
    <el-icon class="icon" color="#178557" v-else><fold /></el-icon>
  </div>
</template>

<script setup lang="ts">
import {useSettingStore} from "../../../store/modules/setting"
import {computed} from "vue"
const SettingStore = useSettingStore()
const isCollapse = computed(() =>!SettingStore.isCollapse)
const handleCollapse = () => {
  SettingStore.setCollapse(isCollapse.value)
}
</script>

<style scoped>
.hamburger-container {
  padding: 0px 15px;
  height: 100%;
  display: flex;
  align-items: center;
}
.hamburger-container  .icon {
  font-size: 24px;
  cursor: pointer;
}
</style>
