import { defineStore } from 'pinia'
import { ref } from 'vue'

export type TaskType = 'document' | 'image' | 'table'

export interface RecentTask {
  id: number
  type: TaskType
  title: string
  time: string
  status: '已完成' | '处理中'
}

export const useTaskStore = defineStore('tasks', () => {
  const recentTasks = ref<RecentTask[]>([
    { id: 1, type: 'document', title: '合同内容整理', status: '已完成', time: '12 分钟前' },
    { id: 2, type: 'image', title: '产品图片分析', status: '已完成', time: '昨天' },
    { id: 3, type: 'table', title: '订单数据汇总', status: '已完成', time: '周一' },
  ])

  function addTask(title: string, type: TaskType) {
    recentTasks.value.unshift({
      id: Date.now(),
      type,
      title: title.length > 18 ? `${title.slice(0, 18)}…` : title,
      status: '处理中',
      time: '刚刚',
    })
  }

  return { recentTasks, addTask }
})
