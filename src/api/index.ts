import lodash from 'lodash'

import { appAxiosInstance } from '@/api/axios-client.ts'

type RequestConfig = {
  method: 'GET' | 'POST'
  url: string
  data?: any
  params?: any
  timeout?: number
}

async function request<T = any>(config: RequestConfig): Promise<T> {
  const response = await appAxiosInstance.request<T>({
    method: config.method,
    url: config.url,
    data: config.data,
    params: config.params,
  })

  return { ...response.data, __source: response }
}

function get<T = any>(
  url: string,
  params?: any,
  config?: Omit<RequestConfig, 'method' | 'url' | 'params'>
) {
  const nonUndefinedConfig = lodash.omitBy(config, v => v === undefined)
  return request<T>({ method: 'GET', url, params, ...nonUndefinedConfig })
}

function post<T = any>(
  url: string,
  data?: any,
  config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
) {
  const nonUndefinedConfig = lodash.omitBy(config, v => v === undefined)
  return request<T>({ method: 'POST', url, data, ...nonUndefinedConfig })
}

export const ApiRequestService = { request, get, post }
