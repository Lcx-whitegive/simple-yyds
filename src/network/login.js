import { request } from './request'

// 登录请求
export const login = (userInfo) => {
  return request({
      method: 'post',
      url: '/login',
      params: userInfo
  })
}