<script setup lang="ts">
import axios from 'axios'
import { computed, nextTick, ref } from 'vue'

import { runAgent } from '@/api/agent'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  meta?: string
}

const agents = [
  { id: 'general-agent', name: '通用助手', prompt: 'general-system-prompt', model: 'default-model' },
  { id: 'code-agent', name: '编程助手', prompt: 'code-system-prompt', model: 'default-model' },
]

const selectedAgentId = ref('general-agent')
const input = ref('')
const isSubmitting = ref(false)
const requestError = ref('')
const executionId = ref('9bb60474…6173')
const duration = ref(842)
const copiedMessageId = ref('')
const sessionId = crypto.randomUUID()
const messageList = ref<HTMLElement>()

const messages = ref<ChatMessage[]>([
  {
    id: 'welcome',
    role: 'assistant',
    content:
      '你好，我是通用助手。当前工作台用于验证 Agent Runtime、模型路由与 Prompt 配置。你可以从下方示例开始，或直接发送一条测试消息。',
    meta: 'default-model · 842 ms',
  },
])

const selectedAgent = computed(
  () => agents.find((agent) => agent.id === selectedAgentId.value) ?? agents[0]!,
)

function applySuggestion(value: string) {
  input.value = value
}

async function copyMessage(message: ChatMessage) {
  await navigator.clipboard.writeText(message.content)
  copiedMessageId.value = message.id
  window.setTimeout(() => {
    if (copiedMessageId.value === message.id) copiedMessageId.value = ''
  }, 1600)
}

async function scrollToLatest() {
  await nextTick()
  messageList.value?.scrollTo({ top: messageList.value.scrollHeight, behavior: 'smooth' })
}

async function submitMessage() {
  const content = input.value.trim()
  if (!content || isSubmitting.value) return

  requestError.value = ''
  input.value = ''
  messages.value.push({ id: crypto.randomUUID(), role: 'user', content })
  await scrollToLatest()

  const startedAt = performance.now()
  isSubmitting.value = true

  try {
    const result = await runAgent(selectedAgentId.value, {
      sessionId,
      userId: 'developer',
      message: content,
      variables: {},
    })

    duration.value = Math.round(performance.now() - startedAt)
    executionId.value = result.executionId
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: result.content,
      meta: `${result.modelId} · ${duration.value.toLocaleString()} ms`,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      requestError.value =
        error.response?.data?.message ?? '无法连接 Runtime。请确认后端已在 localhost:8090 启动。'
    } else {
      requestError.value = '请求没有完成，请稍后重试。'
    }
  } finally {
    isSubmitting.value = false
    await scrollToLatest()
  }
}
</script>

<template>
  <section class="workbench">
    <header class="page-toolbar">
      <div>
        <div class="breadcrumb"><span>工作空间</span><b>/</b> 调试工作台</div>
        <h1>Agent 调试</h1>
      </div>
      <div class="toolbar-actions">
        <span class="mode-note"><i></i> 单轮模式</span>
        <a
          class="secondary-button"
          href="http://localhost:8090/swagger-ui.html"
          target="_blank"
          rel="noreferrer"
        >查看接口文档 ↗</a>
      </div>
    </header>

    <div class="runtime-bar">
      <div class="agent-selector">
        <label for="agent-select">运行 Agent</label>
        <select id="agent-select" v-model="selectedAgentId">
          <option v-for="agent in agents" :key="agent.id" :value="agent.id">
            {{ agent.name }} · {{ agent.id }}
          </option>
        </select>
      </div>
      <div class="runtime-fact"><span>模型</span>{{ selectedAgent.model }}</div>
      <div class="runtime-fact"><span>Prompt</span>{{ selectedAgent.prompt }}</div>
      <div class="runtime-fact session-fact"><span>Session</span>{{ sessionId.slice(0, 13) }}…</div>
      <button class="more-button" type="button" aria-label="更多运行设置" title="高级配置尚未开放" disabled>•••</button>
    </div>

    <div class="workspace-grid">
      <article class="conversation-panel">
        <div ref="messageList" class="message-list" aria-live="polite">
          <div class="conversation-intro">
            <span class="agent-emblem">A</span>
            <div>
              <h2>{{ selectedAgent.name }}</h2>
              <p>测试 Runtime 的基础响应。当前消息不会形成多轮上下文。</p>
            </div>
          </div>

          <div
            v-for="message in messages"
            :key="message.id"
            class="message-row"
            :class="`message-${message.role}`"
          >
            <div class="message-author">{{ message.role === 'assistant' ? 'A' : '你' }}</div>
            <div class="message-body">
              <div class="message-label">
                {{ message.role === 'assistant' ? selectedAgent.name : '开发者' }}
                <span v-if="message.meta">{{ message.meta }}</span>
              </div>
              <p>{{ message.content }}</p>
              <button
                v-if="message.role === 'assistant'"
                class="copy-action"
                type="button"
                aria-label="复制回复"
                @click="copyMessage(message)"
              >
                {{ copiedMessageId === message.id ? '已复制' : '复制' }}
              </button>
            </div>
          </div>

          <div v-if="isSubmitting" class="message-row message-assistant">
            <div class="message-author">A</div>
            <div class="message-body pending-message">
              <div class="message-label">{{ selectedAgent.name }}</div>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="composer-area">
          <div v-if="requestError" class="request-error" role="alert">
            <strong>运行失败</strong>
            <span>{{ requestError }}</span>
            <button type="button" @click="requestError = ''">关闭</button>
          </div>
          <div class="suggestions">
            <button type="button" @click="applySuggestion('介绍一下当前 Agent Runtime 的工作流程')">
              解释 Runtime 流程
            </button>
            <button type="button" @click="applySuggestion('给出一个 Spring AI 工具调用示例')">
              测试技术问答
            </button>
          </div>
          <form class="composer" @submit.prevent="submitMessage">
            <textarea
              v-model="input"
              rows="3"
              placeholder="输入一条消息测试 Agent…"
              aria-label="发送给 Agent 的消息"
              @keydown.ctrl.enter.prevent="submitMessage"
            ></textarea>
            <div class="composer-footer">
              <span>Ctrl + Enter 发送</span>
              <div>
                <button class="attachment-button" type="button" disabled title="附件功能尚未开放">
                  ＋
                </button>
                <button class="send-button" type="submit" :disabled="!input.trim() || isSubmitting">
                  {{ isSubmitting ? '运行中' : '运行 Agent' }}
                  <span>↵</span>
                </button>
              </div>
            </div>
          </form>
          <p class="composer-note">响应由配置的模型生成，请验证关键内容。</p>
        </div>
      </article>

      <aside class="inspector-panel" aria-label="本次执行信息">
        <div class="inspector-heading">
          <div>
            <h2>执行检查器</h2>
            <p>最近一次运行</p>
          </div>
          <span class="success-state">成功</span>
        </div>

        <dl class="execution-meta">
          <div><dt>执行 ID</dt><dd>{{ executionId }}</dd></div>
          <div><dt>耗时</dt><dd>{{ duration.toLocaleString() }} ms</dd></div>
          <div><dt>模式</dt><dd>同步</dd></div>
          <div><dt>用户</dt><dd>developer</dd></div>
        </dl>

        <div class="trace-section">
          <div class="section-title">
            <h3>执行链路</h3>
            <span>3 步</span>
          </div>
          <ol class="trace-list">
            <li class="completed">
              <span class="trace-node">1</span>
              <div><strong>加载 Agent 定义</strong><small>general-agent</small></div>
              <time>12 ms</time>
            </li>
            <li class="completed">
              <span class="trace-node">2</span>
              <div><strong>组装 Prompt</strong><small>version 1</small></div>
              <time>4 ms</time>
            </li>
            <li class="completed">
              <span class="trace-node">3</span>
              <div><strong>调用模型</strong><small>default-model</small></div>
              <time>826 ms</time>
            </li>
          </ol>
        </div>

        <div class="payload-section">
          <div class="section-title"><h3>请求变量</h3><span>JSON</span></div>
          <pre>{}</pre>
        </div>

        <div class="limitation-note">
          <strong>当前能力边界</strong>
          <p>多轮记忆、Tool Calling 与流式输出尚未接入。</p>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.workbench {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 58px);
  min-height: 610px;
}

.page-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 86px;
  padding: 16px 24px 14px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.breadcrumb {
  margin-bottom: 6px;
  color: #757a75;
  font-size: 11px;
}

.breadcrumb span {
  color: #9a9f99;
}

.breadcrumb b {
  margin: 0 7px;
  color: #c0c3bd;
  font-weight: 400;
}

.page-toolbar h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mode-note {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #666b66;
  font-size: 11px;
}

.mode-note i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-amber);
}

.secondary-button {
  display: inline-grid;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #c7cac3;
  border-radius: 3px;
  background: transparent;
  color: #404640;
  font-size: 11px;
  text-decoration: none;
  cursor: pointer;
}

.secondary-button:hover {
  border-color: #959b94;
  background: #f1f2ee;
}

.runtime-bar {
  display: flex;
  align-items: stretch;
  min-height: 58px;
  border-bottom: 1px solid var(--color-border);
  background: #f4f5f1;
}

.agent-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  padding: 0 20px 0 24px;
  border-right: 1px solid var(--color-border);
}

.agent-selector label,
.runtime-fact span {
  color: #898e88;
  font-size: 10px;
}

.agent-selector select {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #272c27;
  font-size: 12px;
  font-weight: 600;
}

.runtime-fact {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 150px;
  padding: 0 18px;
  border-right: 1px solid var(--color-border);
  color: #454b45;
  font-family: var(--font-mono);
  font-size: 10px;
}

.session-fact {
  min-width: 170px;
}

.more-button {
  width: 48px;
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #777d77;
  cursor: pointer;
}

.more-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.workspace-grid {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(520px, 1fr) 292px;
  min-height: 0;
}

.conversation-panel {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: var(--color-surface);
}

.message-list {
  flex: 1;
  min-height: 0;
  padding: 28px clamp(24px, 5vw, 72px) 20px;
  overflow-y: auto;
}

.conversation-intro {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 760px;
  margin: 0 auto 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e2dc;
}

.agent-emblem {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 3px 9px 3px 9px;
  background: #203c93;
  color: #ffffff;
  font-family: var(--font-mono);
  font-weight: 700;
}

.conversation-intro h2 {
  margin: 0 0 4px;
  color: #252a25;
  font-size: 14px;
}

.conversation-intro p {
  margin: 0;
  color: #777c76;
  font-size: 11px;
  line-height: 1.5;
}

.message-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  max-width: 760px;
  margin: 0 auto 24px;
}

.message-author {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid #c9ccc6;
  border-radius: 3px;
  background: #f1f2ee;
  color: #5c625c;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
}

.message-assistant .message-author {
  border-color: #b9c4e4;
  background: #e7ebf7;
  color: #24449c;
}

.message-body {
  position: relative;
  min-width: 0;
  padding-top: 2px;
}

.message-label {
  margin-bottom: 7px;
  color: #343934;
  font-size: 11px;
  font-weight: 650;
}

.message-label span {
  margin-left: 8px;
  color: #9a9e99;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 400;
}

.message-body p {
  max-width: 70ch;
  margin: 0;
  color: #444a44;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.message-user .message-body p {
  display: inline-block;
  padding: 10px 12px;
  border: 1px solid #dde0da;
  border-radius: 3px;
  background: #f4f5f1;
}

.copy-action {
  margin-top: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #838882;
  font-size: 10px;
  cursor: pointer;
}

.copy-action:hover {
  color: var(--color-blue);
}

.pending-message span {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 5px 3px 0 0;
  border-radius: 50%;
  background: #8190bd;
  animation: thinking 1.1s infinite ease-in-out;
}

.pending-message span:nth-child(3) { animation-delay: 0.14s; }
.pending-message span:nth-child(4) { animation-delay: 0.28s; }

.composer-area {
  position: relative;
  z-index: 2;
  padding: 10px clamp(24px, 5vw, 72px) 14px;
  border-top: 1px solid var(--color-border);
  background: #f6f7f3;
}

.suggestions,
.composer,
.composer-note,
.request-error {
  max-width: 760px;
  margin-right: auto;
  margin-left: auto;
}

.suggestions {
  display: flex;
  gap: 7px;
  margin-bottom: 8px;
}

.suggestions button {
  padding: 5px 9px;
  border: 1px solid #d3d6cf;
  border-radius: 3px;
  background: transparent;
  color: #6d726d;
  font-size: 10px;
  cursor: pointer;
}

.suggestions button:hover {
  border-color: #aeb5c7;
  color: #294ba4;
}

.composer {
  border: 1px solid #bfc3bc;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(36, 42, 36, 0.05);
}

.composer:focus-within {
  border-color: #6680c8;
  box-shadow: 0 0 0 2px rgba(47, 91, 234, 0.1);
}

.composer textarea {
  display: block;
  width: 100%;
  min-height: 68px;
  padding: 12px 13px 4px;
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: #292e29;
  font: inherit;
  font-size: 12px;
  line-height: 1.6;
}

.composer textarea::placeholder {
  color: #9da19c;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  padding: 5px 7px 7px 12px;
  color: #a0a49e;
  font-size: 9px;
}

.composer-footer > div {
  display: flex;
  gap: 6px;
}

.attachment-button {
  width: 30px;
  height: 30px;
  border: 1px solid #d6d9d2;
  border-radius: 3px;
  background: transparent;
  color: #a2a6a0;
}

.send-button {
  height: 30px;
  padding: 0 10px 0 12px;
  border: 0;
  border-radius: 3px;
  background: var(--color-blue);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}

.send-button span {
  margin-left: 9px;
  opacity: 0.7;
}

.send-button:disabled {
  background: #aeb7ce;
  cursor: not-allowed;
}

.composer-note {
  margin-top: 6px;
  margin-bottom: 0;
  color: #9a9e99;
  font-size: 9px;
  text-align: center;
}

.request-error {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 9px;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 10px;
  border-left: 3px solid #b94e46;
  background: #f5e9e7;
  color: #7b3934;
  font-size: 10px;
}

.request-error button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.inspector-panel {
  min-width: 0;
  overflow-y: auto;
  border-left: 1px solid var(--color-border);
  background: #eef0eb;
}

.inspector-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 18px 16px;
  border-bottom: 1px solid #d8dad4;
}

.inspector-heading h2,
.section-title h3 {
  margin: 0;
  color: #343934;
  font-size: 12px;
}

.inspector-heading p {
  margin: 4px 0 0;
  color: #929791;
  font-size: 9px;
}

.success-state {
  padding: 3px 7px;
  border: 1px solid #9fc1ae;
  border-radius: 2px;
  background: #e4eee8;
  color: #276746;
  font-size: 9px;
}

.execution-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  border-bottom: 1px solid #d8dad4;
}

.execution-meta div {
  min-width: 0;
  padding: 12px 16px;
  border-right: 1px solid #d8dad4;
  border-bottom: 1px solid #d8dad4;
}

.execution-meta div:nth-child(even) { border-right: 0; }
.execution-meta div:nth-last-child(-n + 2) { border-bottom: 0; }

.execution-meta dt {
  margin-bottom: 5px;
  color: #90958f;
  font-size: 9px;
}

.execution-meta dd {
  margin: 0;
  overflow: hidden;
  color: #464c46;
  font-family: var(--font-mono);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trace-section,
.payload-section {
  padding: 18px;
  border-bottom: 1px solid #d8dad4;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.section-title span,
.section-title button {
  border: 0;
  background: transparent;
  color: #8a8f89;
  font-size: 9px;
}

.trace-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.trace-list li {
  position: relative;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 9px;
  align-items: start;
  min-height: 54px;
}

.trace-list li:not(:last-child)::after {
  position: absolute;
  top: 21px;
  bottom: -1px;
  left: 10px;
  width: 1px;
  background: #a9b7de;
  content: '';
}

.trace-node {
  display: grid;
  width: 21px;
  height: 21px;
  place-items: center;
  border: 1px solid #8ea2da;
  border-radius: 50%;
  background: #eef0eb;
  color: #2e54bb;
  font-family: var(--font-mono);
  font-size: 8px;
}

.trace-list strong,
.trace-list small {
  display: block;
}

.trace-list strong {
  margin-top: 2px;
  color: #4a504a;
  font-size: 10px;
  font-weight: 600;
}

.trace-list small {
  margin-top: 4px;
  color: #969a95;
  font-family: var(--font-mono);
  font-size: 8px;
}

.trace-list time {
  margin-top: 4px;
  color: #8a8f89;
  font-family: var(--font-mono);
  font-size: 8px;
}

.payload-section pre {
  margin: 0;
  padding: 10px;
  border: 1px solid #d8dad4;
  border-radius: 2px;
  background: #e7e9e4;
  color: #606660;
  font-family: var(--font-mono);
  font-size: 9px;
}

.limitation-note {
  margin: 16px;
  padding: 12px;
  border-left: 2px solid var(--color-amber);
  background: #f2eee3;
}

.limitation-note strong {
  color: #625633;
  font-size: 10px;
}

.limitation-note p {
  margin: 5px 0 0;
  color: #81775a;
  font-size: 9px;
  line-height: 1.6;
}

@keyframes thinking {
  0%, 70%, 100% { transform: translateY(0); opacity: 0.45; }
  35% { transform: translateY(-3px); opacity: 1; }
}

@media (max-width: 1100px) {
  .workspace-grid { grid-template-columns: minmax(500px, 1fr) 260px; }
  .runtime-fact { display: none; }
}

@media (max-width: 880px) {
  .workspace-grid { display: block; overflow-y: auto; }
  .conversation-panel { min-height: calc(100vh - 202px); }
  .inspector-panel { border-top: 1px solid var(--color-border); border-left: 0; }
  .message-list { min-height: 310px; }
}

@media (max-width: 620px) {
  .page-toolbar { padding-inline: 16px; }
  .secondary-button { display: none; }
  .runtime-bar { min-height: 54px; }
  .agent-selector { min-width: 0; width: calc(100% - 48px); padding-inline: 16px; }
  .message-list, .composer-area { padding-inline: 16px; }
  .suggestions { overflow-x: auto; }
  .suggestions button { flex: 0 0 auto; }
}

@media (prefers-reduced-motion: reduce) {
  .pending-message span { animation: none; }
  * { scroll-behavior: auto !important; }
}
</style>
