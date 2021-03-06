import { AxiosStatic, AxiosInstance, AxiosResponse } from 'axios'
/**
 * 根据 expands 规则合并 response 和 data
 *
 * 由于执行顺序规则，axiosWithAssignResponse 应该最先被调用
 *
 * 合并后需要自行 declare module "axios" 补充类型
 *
 * @param axios
 * @param expands
 */
export const withAssignResponse = (axios: AxiosStatic | AxiosInstance, expands: '*' | (string | [string, string])[] = '*') => {
  const extend = (target: any, source: any, filed: string, key = filed) => {
    source[filed] && (target[key] = source[filed])
  }
  const assign = (response: AxiosResponse, data: any) => {
    if (!data || typeof data !== 'object' || Array.isArray(data))
      return
    if (!expands.length)
      return
    if (expands === '*') {
      for (const key of Object.keys(data)) extend(response, data, key)
      return
    }
    for (const keys of expands) {
      const filed = Array.isArray(keys) ? keys[0] : keys
      const key = Array.isArray(keys) ? keys[1] : keys
      extend(response, data, key, filed)
    }
  }
  axios.interceptors.response.use(
    (response) => {
      assign(response, response.data)
      return response
    },
    (error) => {
      assign(error.response, error.response?.data)
      return Promise.reject(error)
    }
  )
}
