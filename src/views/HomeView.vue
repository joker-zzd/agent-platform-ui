<script setup lang="ts">
import { computed, ref } from 'vue'

interface RecentTask {
  id: number
  type: 'document' | 'image' | 'table'
  title: string
  time: string
  status: '已完成' | '处理中'
}

interface Attachment {
  name: string
  kind: 'file' | 'image'
}

const taskInput = ref('')
const notice = ref('')
const isStarting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const textarea = ref<HTMLTextAreaElement | null>(null)
const attachments = ref<Attachment[]>([])

const recentTasks = ref<RecentTask[]>([
  { id: 1, type: 'document', title: '合同内容整理', status: '已完成', time: '12 分钟前' },
  { id: 2, type: 'image', title: '产品图片分析', status: '已完成', time: '昨天' },
  { id: 3, type: 'table', title: '订单数据汇总', status: '已完成', time: '周一' },
])

const canStart = computed(() => taskInput.value.trim().length > 0 || attachments.value.length > 0)

function selectFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  attachments.value.push(
    ...files.map((file) => ({
      name: file.name,
      kind: file.type.startsWith('image/') ? ('image' as const) : ('file' as const),
    })),
  )
  input.value = ''
  notice.value = files.length ? `已添加 ${files.length} 个文件` : ''
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1)
}

function startVoiceInput() {
  notice.value = '语音输入功能即将开放，你可以先输入文字。'
  textarea.value?.focus()
}

function startTask() {
  if (!canStart.value || isStarting.value) return

  isStarting.value = true
  notice.value = '正在创建任务…'
  const title = taskInput.value.trim() || attachments.value[0]?.name || '新任务'

  window.setTimeout(() => {
    recentTasks.value.unshift({
      id: Date.now(),
      type: attachments.value.some((item) => item.kind === 'image') ? 'image' : 'document',
      title: title.length > 20 ? `${title.slice(0, 20)}…` : title,
      status: '处理中',
      time: '刚刚',
    })
    taskInput.value = ''
    attachments.value = []
    isStarting.value = false
    notice.value = '任务已创建，可在右侧查看进度。'
  }, 650)
}
</script>

<template>
  <section class="home-page">
    <div class="botanical botanical-left" aria-hidden="true">
      <i v-for="index in 5" :key="index"></i>
    </div>
    <div class="botanical botanical-right" aria-hidden="true">
      <i v-for="index in 6" :key="index"></i>
    </div>

    <div class="home-container">
      <header class="hero-copy">
        <p class="handwritten" aria-hidden="true">让复杂的事情<br />变简单</p>
        <h1>你好，今天想完成什么？</h1>
        <p>可以提问，也可以添加图片、文档或其他文件。</p>
      </header>

      <div class="workspace-grid">
        <div class="task-area">
          <form class="task-composer" @submit.prevent="startTask">
            <textarea
              ref="textarea"
              v-model="taskInput"
              rows="5"
              maxlength="2000"
              aria-label="描述你想完成的事情"
              placeholder="描述你想完成的事情…"
              @input="notice = ''"
            ></textarea>

            <div v-if="attachments.length" class="attachment-list" aria-label="已添加的文件">
              <span v-for="(item, index) in attachments" :key="`${item.name}-${index}`">
                <svg v-if="item.kind === 'image'" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="8.5" cy="9" r="1.5" />
                  <path d="m4 17 4.5-4.5 3.5 3 2.4-2.4L20 18" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5" />
                </svg>
                <b>{{ item.name }}</b>
                <button type="button" :aria-label="`移除 ${item.name}`" @click="removeAttachment(index)">×</button>
              </span>
            </div>

            <div class="composer-actions">
              <div class="input-actions">
                <button type="button" @click="fileInput?.click()">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m20.5 11.5-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.6-8.6" />
                  </svg>
                  添加文件
                </button>
                <button type="button" @click="startVoiceInput">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" />
                  </svg>
                  语音输入
                </button>
              </div>

              <button class="start-button" type="submit" :disabled="!canStart || isStarting">
                <svg v-if="!isStarting" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 10 7-10 7Z" /></svg>
                <span v-else class="loading-mark" aria-hidden="true"></span>
                {{ isStarting ? '创建中' : '开始' }}
              </button>
            </div>

            <input ref="fileInput" class="visually-hidden" type="file" multiple @change="selectFiles" />
          </form>
          <p v-if="notice" class="notice" role="status">{{ notice }}</p>
        </div>

        <aside id="recent-tasks" class="recent-panel" aria-labelledby="recent-title">
          <div class="panel-heading">
            <div>
              <h2 id="recent-title">最近任务</h2>
              <p>继续查看或处理之前的任务</p>
            </div>
            <button type="button" aria-label="查看全部任务">全部 <span aria-hidden="true">›</span></button>
          </div>

          <div class="task-list">
            <button v-for="task in recentTasks.slice(0, 4)" :key="task.id" type="button" class="task-row">
              <span class="task-kind">
                <svg v-if="task.type === 'document'" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5M9 12h6M9 16h6" />
                </svg>
                <svg v-else-if="task.type === 'image'" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 4.5-4.5 3.5 3 2.4-2.4L20 18" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                </svg>
              </span>
              <span class="task-copy">
                <strong>{{ task.title }}</strong>
                <small><i :class="{ processing: task.status === '处理中' }"></i>{{ task.status }} · {{ task.time }}</small>
              </span>
              <svg class="row-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  position: relative;
  min-height: calc(100vh - 68px);
  overflow: hidden;
  padding: 64px 32px 72px;
  background: #f7f9f5;
}

.home-container {
  position: relative;
  z-index: 2;
  width: min(100%, 1180px);
  margin: 0 auto;
}

.hero-copy {
  position: relative;
  margin-bottom: 38px;
  text-align: center;
}

.hero-copy h1 {
  margin: 0;
  color: #202420;
  font-size: clamp(33px, 3vw, 44px);
  font-weight: 520;
  letter-spacing: -0.045em;
  line-height: 1.2;
}

.hero-copy > p:not(.handwritten) {
  margin: 14px 0 0;
  color: #697069;
  font-size: 16px;
}

.handwritten {
  position: absolute;
  top: 44px;
  left: -76px;
  margin: 0;
  color: #83977e;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 18px;
  line-height: 1.7;
  text-align: left;
  transform: rotate(-7deg);
}

.handwritten::after {
  display: block;
  width: 72px;
  height: 1px;
  margin: 4px 0 0 16px;
  background: #8ba087;
  content: '';
  transform: rotate(-10deg);
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.task-area {
  min-width: 0;
}

.task-composer {
  overflow: hidden;
  border: 1px solid #cfd6cf;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(56, 71, 55, 0.06);
}

.task-composer:focus-within {
  border-color: #879d83;
  box-shadow: 0 0 0 3px rgba(111, 130, 107, 0.1), 0 14px 34px rgba(56, 71, 55, 0.07);
}

.task-composer textarea {
  display: block;
  width: 100%;
  min-height: 230px;
  padding: 26px 27px 14px;
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: #232823;
  font: inherit;
  font-size: 17px;
  line-height: 1.65;
}

.task-composer textarea::placeholder {
  color: #a1a7a2;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 24px 12px;
}

.attachment-list span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: 280px;
  padding: 7px 9px;
  overflow: hidden;
  border: 1px solid #dce3da;
  border-radius: 6px;
  background: #f5f8f3;
  color: #566354;
  font-size: 13px;
}

.attachment-list svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.attachment-list b {
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-list button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7d887b;
  cursor: pointer;
}

.composer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  padding: 9px 15px 13px 22px;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-actions button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #343b36;
  font-size: 14px;
  cursor: pointer;
}

.input-actions button:hover {
  background: var(--color-sage-pale);
  color: #496347;
}

.input-actions svg,
.start-button svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.start-button {
  display: inline-flex;
  min-width: 116px;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 8px;
  background: var(--color-sage-strong);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(73, 100, 71, 0.14);
}

.start-button:hover:not(:disabled) {
  background: #526e50;
  transform: translateY(-1px);
}

.start-button:disabled {
  background: #a7b4a4;
  cursor: not-allowed;
  box-shadow: none;
}

.loading-mark {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.notice {
  min-height: 22px;
  margin: 10px 3px 0;
  color: #627360;
  font-size: 13px;
}

.recent-panel {
  overflow: hidden;
  border: 1px solid #dce1dc;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.86);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 21px 20px 17px;
  border-bottom: 1px solid #e8ebe7;
}

.panel-heading h2 {
  margin: 0;
  color: #232723;
  font-size: 18px;
  font-weight: 620;
}

.panel-heading p {
  margin: 6px 0 0;
  color: #8a918a;
  font-size: 12px;
}

.panel-heading button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: var(--color-sage-strong);
  font-size: 13px;
  cursor: pointer;
}

.panel-heading button span {
  font-size: 19px;
  line-height: 0.8;
}

.task-list {
  display: grid;
}

.task-row {
  display: grid;
  width: 100%;
  grid-template-columns: 31px minmax(0, 1fr) 17px;
  gap: 12px;
  align-items: center;
  min-height: 82px;
  padding: 13px 17px;
  border: 0;
  border-bottom: 1px solid #e8ebe7;
  background: transparent;
  color: #252a25;
  text-align: left;
  cursor: pointer;
}

.task-row:last-child {
  border-bottom: 0;
}

.task-row:hover {
  background: #f2f6ef;
}

.task-kind {
  display: grid;
  place-items: center;
}

.task-kind svg {
  width: 25px;
  height: 25px;
  fill: none;
  stroke: var(--color-sage-strong);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.task-copy {
  display: grid;
  min-width: 0;
  gap: 7px;
}

.task-copy strong {
  overflow: hidden;
  font-size: 14px;
  font-weight: 560;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-copy small {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #858c85;
  font-size: 12px;
}

.task-copy i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f864a;
}

.task-copy i.processing {
  background: #c58e37;
}

.row-arrow {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: #7c867e;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.botanical {
  position: absolute;
  z-index: 1;
  width: 210px;
  height: 310px;
  opacity: 0.28;
  pointer-events: none;
}

.botanical::before {
  position: absolute;
  width: 2px;
  height: 280px;
  border-radius: 50%;
  background: #9eb39a;
  content: '';
}

.botanical i {
  position: absolute;
  display: block;
  width: 98px;
  height: 45px;
  border-radius: 100% 0 100% 0;
  background: #d9e4d5;
  transform-origin: bottom right;
}

.botanical-left { bottom: 12px; left: -44px; transform: rotate(-9deg); }
.botanical-left::before { bottom: -32px; left: 83px; transform: rotate(19deg); }
.botanical-left i:nth-child(1) { top: 34px; left: 88px; transform: rotate(34deg) scale(0.9); }
.botanical-left i:nth-child(2) { top: 92px; left: 21px; transform: rotate(205deg) scale(1.05); }
.botanical-left i:nth-child(3) { top: 137px; left: 96px; transform: rotate(23deg) scale(0.88); }
.botanical-left i:nth-child(4) { top: 193px; left: 18px; transform: rotate(203deg) scale(1.15); }
.botanical-left i:nth-child(5) { top: 235px; left: 92px; transform: rotate(21deg) scale(0.8); }
.botanical-right { top: 110px; right: -74px; transform: rotate(9deg) scale(0.76); }
.botanical-right::before { top: 20px; right: 83px; transform: rotate(-14deg); }
.botanical-right i:nth-child(1) { top: 12px; left: 11px; transform: rotate(202deg) scale(0.8); }
.botanical-right i:nth-child(2) { top: 57px; left: 91px; transform: rotate(20deg); }
.botanical-right i:nth-child(3) { top: 108px; left: 8px; transform: rotate(203deg) scale(1.05); }
.botanical-right i:nth-child(4) { top: 157px; left: 94px; transform: rotate(18deg) scale(0.92); }
.botanical-right i:nth-child(5) { top: 202px; left: 11px; transform: rotate(203deg); }
.botanical-right i:nth-child(6) { top: 246px; left: 89px; transform: rotate(20deg) scale(0.84); }

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1180px) {
  .handwritten,
  .botanical {
    display: none;
  }
}

@media (max-width: 900px) {
  .home-page {
    padding-top: 44px;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .task-composer textarea {
    min-height: 180px;
  }
}

@media (max-width: 620px) {
  .home-page {
    padding: 34px 16px 48px;
  }

  .hero-copy {
    margin-bottom: 25px;
    text-align: left;
  }

  .hero-copy h1 {
    font-size: 30px;
    font-weight: 500;
  }

  .hero-copy > p:not(.handwritten) {
    font-size: 15px;
    line-height: 1.6;
  }

  .task-composer textarea {
    min-height: 145px;
    padding: 20px 18px 8px;
    font-size: 16px;
  }

  .composer-actions {
    align-items: flex-end;
    padding: 8px 10px 10px 12px;
  }

  .input-actions {
    gap: 1px;
  }

  .input-actions button {
    width: 42px;
    justify-content: center;
    padding: 9px;
    font-size: 0;
  }

  .start-button {
    min-width: 96px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-mark { animation: none; }
}
</style>
