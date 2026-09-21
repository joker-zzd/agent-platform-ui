<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="brand-mark" aria-hidden="true"><span>AP</span></div>
      <div class="brand-copy">
        <strong>Agent Platform</strong>
        <span>Runtime console</span>
      </div>

      <div class="header-divider" aria-hidden="true"></div>
      <div class="workspace-switcher">
        <span class="workspace-dot"></span>
        开发环境
        <span class="chevron">⌄</span>
      </div>

      <div class="header-actions">
        <button class="icon-button" type="button" aria-label="搜索" title="搜索尚未开放" disabled>⌕</button>
        <button class="icon-button" type="button" aria-label="通知" title="通知尚未开放" disabled>◌</button>
        <button class="avatar-button" type="button" aria-label="账户设置" title="账户设置尚未开放" disabled>开</button>
      </div>
    </header>

    <div class="app-body">
      <aside class="app-sidebar">
        <nav aria-label="主导航">
          <p class="nav-caption">工作空间</p>
          <a class="nav-item active" href="#" aria-current="page">
            <span class="nav-icon">◎</span>
            调试工作台
          </a>

          <p class="nav-caption">资源</p>
          <span class="nav-item disabled" title="管理接口接入后开放"><span class="nav-icon">◇</span>Agent</span>
          <span class="nav-item disabled" title="管理接口接入后开放"><span class="nav-icon">¶</span>Prompt</span>
          <span class="nav-item disabled" title="管理接口接入后开放"><span class="nav-icon">◫</span>模型</span>

          <p class="nav-caption">运行</p>
          <span class="nav-item disabled" title="查询接口接入后开放"><span class="nav-icon">≋</span>会话记录</span>
          <span class="nav-item disabled" title="查询接口接入后开放"><span class="nav-icon">⌁</span>执行记录</span>
        </nav>

        <div class="sidebar-status">
          <div class="status-line">
            <span class="pulse-dot"></span>
            Runtime 未连接
          </div>
          <span>localhost:8090</span>
        </div>
      </aside>

      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--color-canvas);
}

.app-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 58px;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border-dark);
  background: var(--color-ink);
  color: #f5f6f2;
}

.brand-mark {
  display: grid;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  place-items: center;
  border: 1px solid #5f6877;
  border-radius: 6px 2px 6px 2px;
  background: var(--color-blue);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.04em;
  transform: rotate(-2deg);
}

.brand-mark span {
  transform: rotate(2deg);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 126px;
}

.brand-copy strong {
  font-size: 14px;
  font-weight: 650;
}

.brand-copy span {
  color: #9299a5;
  font-family: var(--font-mono);
  font-size: 9px;
}

.header-divider {
  width: 1px;
  height: 22px;
  margin: 0 18px;
  background: #3a3e47;
}

.workspace-switcher {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #c8ccd3;
  font-size: 12px;
}

.workspace-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d49b2a;
}

.chevron {
  margin-left: 2px;
  color: #7f8794;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.icon-button,
.avatar-button {
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  color: #aeb4bf;
  cursor: pointer;
}

.icon-button:hover {
  background: #2b2f37;
  color: #ffffff;
}

.icon-button:disabled,
.avatar-button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.avatar-button {
  margin-left: 4px;
  border: 1px solid #515865;
  border-radius: 50%;
  background: #303641;
  color: #f4f5f2;
  font-size: 12px;
}

.app-body {
  display: grid;
  grid-template-columns: 208px minmax(0, 1fr);
  min-height: calc(100vh - 58px);
}

.app-sidebar {
  display: flex;
  flex-direction: column;
  padding: 18px 12px 14px;
  border-right: 1px solid var(--color-border);
  background: #e9eae6;
}

.nav-caption {
  margin: 15px 10px 6px;
  color: #80857f;
  font-size: 11px;
}

.nav-caption:first-child {
  margin-top: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 4px;
  color: #50554f;
  font-size: 13px;
  text-decoration: none;
}

.nav-item:hover {
  background: #ddded9;
  color: #1f242b;
}

.nav-item.disabled {
  color: #8d928c;
  cursor: not-allowed;
}

.nav-item.disabled:hover {
  background: transparent;
  color: #8d928c;
}

.nav-item.active {
  position: relative;
  background: #d9dde7;
  color: #193eaa;
  font-weight: 600;
}

.nav-item.active::before {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: -12px;
  width: 3px;
  background: var(--color-blue);
  content: '';
}

.nav-icon {
  width: 18px;
  color: #737a75;
  font-family: var(--font-mono);
  font-size: 15px;
  text-align: center;
}

.nav-item.active .nav-icon {
  color: var(--color-blue);
}

.sidebar-status {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: auto;
  padding: 12px 10px 2px;
  border-top: 1px solid #d2d4ce;
  color: #8a8f89;
  font-family: var(--font-mono);
  font-size: 10px;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #555b55;
  font-family: var(--font-sans);
  font-size: 11px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border: 1px solid #9f7625;
  border-radius: 50%;
  background: #efc870;
}

.app-main {
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 760px) {
  .brand-copy span,
  .header-divider,
  .workspace-switcher {
    display: none;
  }

  .app-body {
    grid-template-columns: 56px minmax(0, 1fr);
  }

  .app-sidebar {
    padding-inline: 8px;
  }

  .nav-caption,
  .nav-item:not(.active),
  .nav-item.active {
    font-size: 0;
  }

  .nav-item {
    justify-content: center;
    padding: 0;
  }

  .nav-item.active::before {
    left: -8px;
  }

  .nav-icon {
    font-size: 16px;
  }

  .sidebar-status {
    display: none;
  }
}
</style>
