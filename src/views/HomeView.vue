<template>
  <el-card class="welcome-card" shadow="never">
    <el-result icon="success" title="前端项目已就绪">
      <template #sub-title>
        <p>Vue 3、TypeScript、Vite、Vue Router、Pinia、Element Plus 与 Axios 已完成基础配置。</p>
      </template>
    </el-result>
  </el-card>
</template>

<style scoped>
.welcome-card {
  width: min(720px, 100%);
}
</style>
