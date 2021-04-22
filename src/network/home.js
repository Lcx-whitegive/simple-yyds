import { request } from './request'

// 获取首页左侧导航列表
export const getMenuList = () => {
  return request({
      method: 'get',
      url: '/menus'
  })
}