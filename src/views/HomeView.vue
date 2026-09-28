<script setup lang="ts">
import { computed, ref } from 'vue'

import { useTaskStore, type TaskType } from '@/stores/tasks'

interface Attachment {
  name: string
  kind: 'file' | 'image'
}

const taskStore = useTaskStore()
const taskInput = ref('')
const notice = ref('')
const isStarting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const textarea = ref<HTMLTextAreaElement | null>(null)
const attachments = ref<Attachment[]>([])

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

function inferTaskType(): TaskType {
  if (attachments.value.some((item) => item.kind === 'image')) return 'image'
  if (/表格|数据|订单|统计/.test(taskInput.value)) return 'table'
  return 'document'
}

function startTask() {
  if (!canStart.value || isStarting.value) return

  isStarting.value = true
  notice.value = '正在创建任务…'
  const title = taskInput.value.trim() || attachments.value[0]?.name || '新任务'
  const type = inferTaskType()

  window.setTimeout(() => {
    taskStore.addTask(title, type)
    taskInput.value = ''
    attachments.value = []
    isStarting.value = false
    notice.value = '任务已创建，稍后可从左侧任务列表继续查看。'
  }, 650)
}
</script>

<template>
  <section class="home-page">
    <div class="botanical botanical-left" aria-hidden="true">
      <i v-for="index in 5" :key="index"></i>
    </div>
    <div class="botanical botanical-right" aria-hidden="true">
      <i v-for="index in 5" :key="index"></i>
    </div>

    <div class="home-container">
      <header class="hero-copy">
        <h1>开始一项任务</h1>
        <p>说清目标，添加需要处理的内容，剩下的交给平台完成。</p>
      </header>

      <form class="task-composer" @submit.prevent="startTask">
        <textarea
          ref="textarea"
          v-model="taskInput"
          rows="6"
          maxlength="2000"
          aria-label="描述任务目标"
          placeholder="描述你想完成的任务，例如：整理这份合同，提取关键条款并生成风险清单"
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
              <path d="M6 3h8l4 4v14H6Z" />
              <path d="M14 3v5h5" />
            </svg>
            <b>{{ item.name }}</b>
            <button
              type="button"
              :aria-label="`移除 ${item.name}`"
              @click="removeAttachment(index)"
            >
              ×
            </button>
          </span>
        </div>

        <div class="composer-footer">
          <div class="input-actions">
            <button type="button" @click="fileInput?.click()">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m20.5 11.5-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.6-8.6"
                />
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
            <svg v-if="!isStarting" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m8 5 10 7-10 7Z" />
            </svg>
            <span v-else class="loading-mark" aria-hidden="true"></span>
            {{ isStarting ? '创建中' : '开始任务' }}
          </button>
        </div>

        <input ref="fileInput" class="visually-hidden" type="file" multiple @change="selectFiles" />
      </form>

      <div class="capability-note" aria-label="支持的任务内容">
        <span>可处理</span>
        <ul>
          <li>文档</li>
          <li>图片</li>
          <li>表格与数据</li>
          <li>信息查询</li>
        </ul>
      </div>

      <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  position: relative;
  display: grid;
  min-height: calc(100vh - 66px);
  overflow: hidden;
  padding: 78px 32px 88px;
  place-items: start center;
  background: #f7f9f5;
}
.home-container {
  position: relative;
  z-index: 2;
  width: min(100%, 850px);
}
.hero-copy {
  margin-bottom: 34px;
  text-align: center;
}
.hero-copy h1 {
  margin: 0;
  color: #202420;
  font-size: clamp(34px, 3.2vw, 45px);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.2;
}
.hero-copy p {
  margin: 14px 0 0;
  color: #697069;
  font-size: 16px;
  line-height: 1.7;
}
.task-composer {
  overflow: hidden;
  border: 1px solid #cfd6cf;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(56, 71, 55, 0.07);
}
.task-composer:focus-within {
  border-color: #879d83;
  box-shadow:
    0 0 0 3px rgba(111, 130, 107, 0.1),
    0 18px 44px rgba(56, 71, 55, 0.07);
}
.task-composer textarea {
  display: block;
  width: 100%;
  min-height: 275px;
  padding: 28px 29px 14px;
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: #232823;
  font: inherit;
  font-size: 17px;
  line-height: 1.7;
}
.task-composer textarea::placeholder {
  color: #9ca39c;
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
  border-radius: 7px;
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
.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 10px 15px 14px 22px;
  border-top: 1px solid #f0f2ef;
}
.input-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}
.input-actions button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
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
  min-width: 132px;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 9px;
  background: var(--color-sage-strong);
  color: #fff;
  font-size: 15px;
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
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.capability-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  color: #7a827a;
  font-size: 13px;
}
.capability-note > span {
  color: #5e685e;
  font-weight: 560;
}
.capability-note ul {
  display: flex;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.capability-note li {
  padding-left: 12px;
  position: relative;
}
.capability-note li::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #92a18e;
  content: '';
  transform: translateY(-50%);
}
.notice {
  margin: 13px 0 0;
  color: #627360;
  font-size: 13px;
  text-align: center;
}
.botanical {
  position: absolute;
  z-index: 1;
  width: 180px;
  height: 280px;
  opacity: 0.22;
  pointer-events: none;
}
.botanical::before {
  position: absolute;
  width: 2px;
  height: 250px;
  background: #9eb39a;
  content: '';
}
.botanical i {
  position: absolute;
  display: block;
  width: 88px;
  height: 40px;
  border-radius: 100% 0 100% 0;
  background: #d9e4d5;
  transform-origin: bottom right;
}
.botanical-left {
  bottom: 0;
  left: -45px;
  transform: rotate(-9deg);
}
.botanical-left::before {
  bottom: -22px;
  left: 74px;
  transform: rotate(19deg);
}
.botanical-left i:nth-child(1) {
  top: 35px;
  left: 77px;
  transform: rotate(32deg);
}
.botanical-left i:nth-child(2) {
  top: 87px;
  left: 12px;
  transform: rotate(204deg);
}
.botanical-left i:nth-child(3) {
  top: 132px;
  left: 82px;
  transform: rotate(21deg);
}
.botanical-left i:nth-child(4) {
  top: 181px;
  left: 14px;
  transform: rotate(204deg);
}
.botanical-left i:nth-child(5) {
  top: 222px;
  left: 78px;
  transform: rotate(20deg) scale(0.85);
}
.botanical-right {
  top: 95px;
  right: -78px;
  transform: rotate(12deg) scale(0.72);
}
.botanical-right::before {
  top: 18px;
  right: 75px;
  transform: rotate(-15deg);
}
.botanical-right i:nth-child(1) {
  top: 18px;
  left: 10px;
  transform: rotate(202deg);
}
.botanical-right i:nth-child(2) {
  top: 67px;
  left: 82px;
  transform: rotate(20deg);
}
.botanical-right i:nth-child(3) {
  top: 116px;
  left: 9px;
  transform: rotate(203deg);
}
.botanical-right i:nth-child(4) {
  top: 164px;
  left: 84px;
  transform: rotate(18deg);
}
.botanical-right i:nth-child(5) {
  top: 210px;
  left: 12px;
  transform: rotate(203deg);
}
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
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1180px) {
  .botanical {
    display: none;
  }
}
@media (max-width: 620px) {
  .home-page {
    min-height: calc(100vh - 60px);
    padding: 42px 16px 52px;
  }
  .hero-copy {
    margin-bottom: 26px;
    text-align: left;
  }
  .hero-copy h1 {
    font-size: 31px;
  }
  .hero-copy p {
    font-size: 15px;
  }
  .task-composer textarea {
    min-height: 205px;
    padding: 21px 18px 10px;
    font-size: 16px;
  }
  .composer-footer {
    align-items: flex-end;
    padding: 9px 10px 11px 11px;
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
    min-width: 111px;
  }
  .capability-note {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .capability-note ul {
    flex-wrap: wrap;
  }
}
@media (prefers-reduced-motion: reduce) {
  .loading-mark {
    animation: none;
  }
}
</style>
