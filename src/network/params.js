import { request } from './request'

// 获取参数列表
export const getParams = (id, sel) => {
    return request({
        method: 'get',
        url: `/categories/${id}/attributes`,
        params: {
            sel
        }
    })
}
// 添加静态/动态参数
export const addParam = (paramInfo) => {
    return request({
        method: 'post',
        url: `/categories/${paramInfo.id}/attributes`,
        data: paramInfo
    })
}
// 根据id查询参数
export const getParamById = (queryInfo) => {
    return request({
        method: 'get',
        url: `/categories/${queryInfo.cate_id}/attributes/${queryInfo.attr_id}`,
        data: queryInfo
    })
}
// 修改参数
export const editParam = (paramInfo) => {
    return request({
        method: 'put',
        url: `/categories/${paramInfo.id}/attributes/${paramInfo.attr_id}`,
        data: paramInfo
    })
}
// 删除参数
export const deleteParamById = (paramInfo) => {
    return request({
        method: 'delete',
        url: `/categories/${paramInfo.id}/attributes/${paramInfo.attr_id}`
    })
}