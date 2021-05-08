import { request } from './request'

// 获取权限列表(list)
export const getRightsList = () => {
    return request({
        method: 'get',
        url: '/rights/list'
    })
}
// 获取权限列表(tree)
export const getRightsTree = () => {
    return request({
        method: 'get',
        url: '/rights/tree'
    })
}
// 获取角色列表
export const getRolesList = () => {
    return request({
        method: 'get',
        url: '/roles'
    })
}
// 添加角色
export const addRole = (roleInfo) => {
    return request({
        method: 'post',
        url: '/roles',
        data: roleInfo
    })
}
// 根据id获取角色
export const getRoleById = (id) => {
    return request({
        method: 'get',
        url: `/roles/${id}`
    })
}
// 修改角色信息
export const editRoleById = (roleInfo) => {
    return request({
        method: 'put',
        url: `/roles/${roleInfo.roleId}`,
        data: roleInfo
    })
}
// 删除角色
export const deleteRole = (id) => {
    return request({
        method: 'delete',
        url: `/roles/${id}`
    })
}
// 根据id删除角色权限
export const deleteRightById = (role, rightId) => {
    return request({
        method: 'delete',
        url: `/roles/${role.id}/rights/${rightId}`
    })
}
// 给角色授权
export const sendAuths = (auths, id) => {
    const authsString = auths.join()
    return request({
        method: 'post',
        url: `roles/${id}/rights`,
        data: {
            rids: authsString
        }
    })
}