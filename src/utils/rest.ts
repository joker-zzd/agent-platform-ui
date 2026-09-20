import type { AxiosRequestConfig } from 'axios'

import request from './request'

/** REST 请求配置，不允许调用方覆盖请求地址和 HTTP 方法。 */
export type RestRequestConfig<D = unknown> = Omit<AxiosRequestConfig<D>, 'url' | 'method'>

/** 带请求体的方法使用的配置，请求体通过独立参数传入。 */
export type RestBodyRequestConfig<D = unknown> = Omit<RestRequestConfig<D>, 'data'>

/** 发起 GET 请求并返回响应体。 */
async function get<T>(url: string, config?: RestRequestConfig): Promise<T> {
  const response = await request.get<T>(url, config)
  return response.data
}

/** 发起 POST 请求并返回响应体。 */
async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: RestBodyRequestConfig<D>,
): Promise<T> {
  const response = await request.post<T>(url, data, config)
  return response.data
}

/** 发起 PUT 请求并返回响应体。 */
async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: RestBodyRequestConfig<D>,
): Promise<T> {
  const response = await request.put<T>(url, data, config)
  return response.data
}

/** 发起 PATCH 请求并返回响应体。 */
async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: RestBodyRequestConfig<D>,
): Promise<T> {
  const response = await request.patch<T>(url, data, config)
  return response.data
}

/** 发起 DELETE 请求并返回响应体。 */
async function remove<T, D = unknown>(url: string, config?: RestRequestConfig<D>): Promise<T> {
  const response = await request.delete<T>(url, config)
  return response.data
}

/**
 * 平台统一 REST 客户端。
 *
 * 泛型 T 表示响应体类型，D 表示请求体类型。
 */
export const rest = {
  get,
  post,
  put,
  patch,
  delete: remove,
}
