<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="brand">Agent Platform</div>
    </el-header>

    <el-main class="app-main">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.brand {
  color: #111827;
  font-size: 18px;
  font-weight: 600;
}

.app-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
