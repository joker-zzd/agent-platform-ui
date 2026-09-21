<script setup lang="ts">
import { ref } from 'vue'

const isProfileOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner">
        <RouterLink class="brand" to="/" aria-label="Agent Platform 首页">
          <span class="brand-monogram" aria-hidden="true">AP</span>
          <span>Agent Platform</span>
        </RouterLink>

        <nav class="primary-nav" aria-label="主导航">
          <RouterLink to="/">首页</RouterLink>
          <a href="#recent-tasks">我的任务</a>
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
      </div>
    </header>

    <main class="page-content"><RouterView /></main>
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; background: var(--color-canvas); }
.topbar {
  position: sticky; z-index: 20; top: 0; height: 68px;
  border-bottom: 1px solid var(--color-border-soft);
  background: rgba(253, 254, 251, 0.94); backdrop-filter: blur(16px);
}
.topbar-inner {
  display: flex; align-items: stretch; width: min(100% - 48px, 1480px);
  height: 100%; margin: 0 auto;
}
.brand {
  display: flex; align-items: center; gap: 9px; color: #171a17;
  font-size: 17px; font-weight: 720; letter-spacing: -0.035em; text-decoration: none;
}
.brand-monogram {
  color: var(--color-sage-strong); font-size: 27px; font-weight: 780; letter-spacing: -0.13em;
}
.primary-nav { display: flex; align-items: stretch; gap: 34px; margin-left: 72px; }
.primary-nav a {
  position: relative; display: grid; place-items: center; color: #3b403b;
  font-size: 15px; font-weight: 560; text-decoration: none;
}
.primary-nav a:first-child { color: var(--color-sage-strong); }
.primary-nav a:first-child::after {
  position: absolute; right: 0; bottom: -1px; left: 0; height: 2px;
  border-radius: 2px; background: var(--color-sage-strong); content: '';
}
.account-area {
  position: relative; display: flex; align-items: center; gap: 24px; margin-left: auto;
}
.help-button, .profile-button, .profile-menu button {
  border: 0; background: transparent; color: #343934; cursor: pointer;
}
.help-button { padding: 10px 4px; font-size: 14px; }
.profile-button { display: flex; align-items: center; gap: 10px; padding: 5px 2px; font-size: 14px; }
.profile-button svg {
  width: 17px; fill: none; stroke: currentColor; stroke-linecap: round;
  stroke-linejoin: round; stroke-width: 1.8;
}
.avatar {
  position: relative; display: block; width: 38px; height: 38px; overflow: hidden;
  border: 1px solid #d7ded4; border-radius: 50%;
  background: radial-gradient(circle at 72% 25%, #d8e4e0 0 25%, transparent 26%),
    linear-gradient(155deg, #edf1ec 0 48%, #7e9a77 49% 67%, #4f704e 68% 100%);
}
.avatar i {
  position: absolute; right: -5px; bottom: 6px; width: 34px; height: 12px;
  border-radius: 50%; background: rgba(219, 227, 195, 0.7); transform: rotate(-8deg);
}
.profile-menu {
  position: absolute; top: calc(100% + 8px); right: 0; display: grid; width: 132px;
  padding: 6px; border: 1px solid var(--color-border); border-radius: 10px;
  background: #fff; box-shadow: 0 12px 30px rgba(41, 52, 41, 0.1);
}
.profile-menu button { padding: 9px 12px; border-radius: 6px; text-align: left; }
.profile-menu button:hover { background: var(--color-sage-pale); }
.page-content { min-width: 0; }

@media (max-width: 720px) {
  .topbar-inner { width: min(100% - 32px, 1480px); }
  .brand span:last-child, .help-button, .profile-name { display: none; }
  .primary-nav { gap: 24px; margin-left: 34px; }
  .account-area { gap: 8px; }
}
</style>
