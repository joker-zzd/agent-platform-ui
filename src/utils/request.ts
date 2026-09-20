import axios, { type AxiosInstance } from 'axios'

/**
 * 平台统一 HTTP 客户端。
 *
 * 所有后端接口统一使用该实例，便于后续集中处理鉴权、错误提示和请求追踪。
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default request
