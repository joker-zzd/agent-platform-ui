<script setup lang="ts">
import { ref } from 'vue'

import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()
const isProfileOpen = ref(false)
const isSidebarOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <aside class="history-sidebar" :class="{ open: isSidebarOpen }">
      <div class="sidebar-brand-row">
        <RouterLink class="brand" to="/" aria-label="Agent Platform 首页">
          <span class="brand-monogram" aria-hidden="true">AP</span>
          <span>Agent Platform</span>
        </RouterLink>
        <button
          class="close-sidebar"
          type="button"
          aria-label="关闭任务列表"
          @click="isSidebarOpen = false"
        >
          ×
        </button>
      </div>

      <RouterLink class="new-task-button" to="/" @click="isSidebarOpen = false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        新建任务
      </RouterLink>

      <div class="history-heading">
        <span>最近任务</span>
        <button type="button" title="搜索任务" aria-label="搜索任务">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
        </button>
      </div>

      <nav class="history-list" aria-label="最近任务">
        <button
          v-for="task in taskStore.recentTasks.slice(0, 8)"
          :key="task.id"
          type="button"
          @click="isSidebarOpen = false"
        >
          <span class="history-icon" :class="`type-${task.type}`" aria-hidden="true">
            <svg v-if="task.type === 'document'" viewBox="0 0 24 24">
              <path d="M6 3h8l4 4v14H6Z" />
              <path d="M14 3v5h5" />
            </svg>
            <svg v-else-if="task.type === 'image'" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="m4 17 5-5 3 3 3-3 5 6" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 10h18M10 3v18" />
            </svg>
          </span>
          <span class="history-copy">
            <strong>{{ task.title }}</strong>
            <small>{{ task.status }} · {{ task.time }}</small>
          </span>
          <span class="more-dots" aria-hidden="true">···</span>
        </button>
      </nav>

      <button class="all-tasks-button" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9" /></svg>
        查看全部任务
        <span aria-hidden="true">›</span>
      </button>
    </aside>

    <button
      v-if="isSidebarOpen"
      class="sidebar-scrim"
      type="button"
      aria-label="关闭任务列表"
      @click="isSidebarOpen = false"
    ></button>

    <div class="main-shell">
      <header class="topbar">
        <button
          class="menu-button"
          type="button"
          aria-label="打开任务列表"
          @click="isSidebarOpen = true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <nav class="primary-nav" aria-label="主导航">
          <RouterLink to="/">首页</RouterLink>
          <button type="button">任务中心</button>
        </nav>

        <div class="account-area">
          <button class="help-button" type="button">帮助</button>
          <button
            class="profile-button"
            type="button"
            :aria-expanded="isProfileOpen"
            aria-haspopup="menu"
            @click="isProfileOpen = !isProfileOpen"
          >
            <span class="avatar" aria-hidden="true"><i></i></span>
            <span class="profile-name">小明</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9.5 5 5 5-5" /></svg>
          </button>
          <div v-if="isProfileOpen" class="profile-menu" role="menu">
            <button type="button" role="menuitem">个人资料</button>
            <button type="button" role="menuitem">退出登录</button>
          </div>
        </div>
      </header>

      <main class="page-content"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-canvas);
}
.history-sidebar {
  position: fixed;
  z-index: 30;
  inset: 0 auto 0 0;
  display: flex;
  width: 264px;
  flex-direction: column;
  padding: 18px 14px 16px;
  border-right: 1px solid #e1e6df;
  background: #f1f4ef;
}
.sidebar-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 7px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #171a17;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.035em;
  text-decoration: none;
}
.brand-monogram {
  color: var(--color-sage-strong);
  font-size: 26px;
  font-weight: 780;
  letter-spacing: -0.13em;
}
.close-sidebar {
  display: none;
  border: 0;
  background: transparent;
  color: #6d746d;
  font-size: 25px;
  cursor: pointer;
}
.new-task-button {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 25px 0 28px;
  border: 1px solid #d4dbd2;
  border-radius: 10px;
  background: #fff;
  color: #2e352e;
  font-size: 14px;
  font-weight: 560;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(48, 65, 47, 0.035);
}
.new-task-button:hover {
  border-color: #9caf98;
  color: #4e694b;
}
.new-task-button svg,
.history-heading svg,
.all-tasks-button svg,
.menu-button svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
.history-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px 9px;
  color: #7a817a;
  font-size: 12px;
}
.history-heading button {
  display: grid;
  padding: 4px;
  place-items: center;
  border: 0;
  background: transparent;
  color: #7c847c;
  cursor: pointer;
}
.history-heading svg {
  width: 16px;
  height: 16px;
}
.history-list {
  display: grid;
  gap: 3px;
  overflow-y: auto;
}
.history-list > button {
  display: grid;
  grid-template-columns: 25px minmax(0, 1fr) 21px;
  gap: 9px;
  align-items: center;
  min-height: 58px;
  padding: 8px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #303530;
  text-align: left;
  cursor: pointer;
}
.history-list > button:hover {
  background: #e5ebe2;
}
.history-list > button:first-child {
  background: #e6ede3;
}
.history-icon {
  display: grid;
  place-items: center;
  color: #6b8567;
}
.history-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}
.history-copy {
  display: grid;
  min-width: 0;
  gap: 5px;
}
.history-copy strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 540;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-copy small {
  color: #8b928b;
  font-size: 11px;
}
.more-dots {
  color: #7e877e;
  opacity: 0;
  letter-spacing: 1px;
}
.history-list > button:hover .more-dots {
  opacity: 1;
}
.all-tasks-button {
  display: grid;
  grid-template-columns: 21px 1fr auto;
  gap: 9px;
  align-items: center;
  margin-top: auto;
  padding: 12px 9px;
  border: 0;
  border-top: 1px solid #dde3db;
  background: transparent;
  color: #596359;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.main-shell {
  width: calc(100% - 264px);
  min-width: 0;
  margin-left: 264px;
}
.topbar {
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  height: 66px;
  align-items: stretch;
  padding: 0 34px;
  border-bottom: 1px solid var(--color-border-soft);
  background: rgba(253, 254, 251, 0.94);
  backdrop-filter: blur(16px);
}
.primary-nav {
  display: flex;
  align-items: stretch;
  gap: 32px;
}
.primary-nav a,
.primary-nav button {
  position: relative;
  display: grid;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  color: #4b514b;
  font-size: 14px;
  font-weight: 540;
  text-decoration: none;
  cursor: pointer;
}
.primary-nav a {
  color: var(--color-sage-strong);
}
.primary-nav a::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--color-sage-strong);
  content: '';
}
.account-area {
  position: relative;
  display: flex;
  align-items: center;
  gap: 23px;
  margin-left: auto;
}
.help-button,
.profile-button,
.profile-menu button {
  border: 0;
  background: transparent;
  color: #343934;
  cursor: pointer;
}
.help-button {
  padding: 10px 4px;
  font-size: 14px;
}
.profile-button {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 2px;
  font-size: 14px;
}
.profile-button > svg {
  width: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
.avatar {
  position: relative;
  display: block;
  width: 37px;
  height: 37px;
  overflow: hidden;
  border: 1px solid #d7ded4;
  border-radius: 50%;
  background: linear-gradient(155deg, #edf1ec 0 48%, #7e9a77 49% 67%, #4f704e 68% 100%);
}
.avatar i {
  position: absolute;
  right: -5px;
  bottom: 6px;
  width: 34px;
  height: 12px;
  border-radius: 50%;
  background: rgba(219, 227, 195, 0.7);
  transform: rotate(-8deg);
}
.profile-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  display: grid;
  width: 132px;
  padding: 6px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(41, 52, 41, 0.1);
}
.profile-menu button {
  padding: 9px 12px;
  border-radius: 6px;
  text-align: left;
}
.profile-menu button:hover {
  background: var(--color-sage-pale);
}
.menu-button {
  display: none;
  padding: 0 10px 0 0;
  border: 0;
  background: transparent;
  color: #495149;
  cursor: pointer;
}
.sidebar-scrim {
  display: none;
}
.page-content {
  min-width: 0;
}

@media (max-width: 860px) {
  .history-sidebar {
    transform: translateX(-100%);
    transition: transform 180ms ease;
  }
  .history-sidebar.open {
    transform: translateX(0);
  }
  .close-sidebar {
    display: block;
  }
  .sidebar-scrim {
    position: fixed;
    z-index: 25;
    inset: 0;
    display: block;
    border: 0;
    background: rgba(35, 42, 35, 0.22);
  }
  .main-shell {
    width: 100%;
    margin-left: 0;
  }
  .topbar {
    padding: 0 18px;
  }
  .menu-button {
    display: block;
  }
}

@media (max-width: 560px) {
  .topbar {
    height: 60px;
  }
  .primary-nav {
    gap: 20px;
  }
  .help-button,
  .profile-name {
    display: none;
  }
  .account-area {
    gap: 7px;
  }
}
</style>
