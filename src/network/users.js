import { request } from './request'

// 获取用户列表
export const getUserList = (queryInfo) => {
    return request({
        method: 'get',
        url: '/users',
        params: queryInfo
    })
}

// 修改用户状态
export const changeUserState = (userId, UserState) => {
    return request({
        method: 'put',
        url: `/users/${userId}/state/${UserState}`
    })
}

// 添加用户
export const addUser = (userInfo) => {
    return request({
        method: 'post',
        url: '/users',
        data: userInfo
    })
}

// 根据id查找用户
export const getUserById = (id) => {
  return request({
      method: 'get',
      url: `users/${id}`
  })
}

// 修改用户信息
export const editUser = (userInfo) => {
  return request({
      method: 'put',
      url: `/users/${userInfo.id}`,
      data: userInfo
  })
}

// 根据id删除用户
export const deleteUserById = (id) => {
    return request({
        method: 'delete',
        url: `/users/${id}`
    })
}