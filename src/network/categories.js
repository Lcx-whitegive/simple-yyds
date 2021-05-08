import { request } from './request'

// 获取分类列表
export const getCategories = (queryInfo) => {
    return request({
        method: 'get',
        url: '/categories',
        params: queryInfo
    })
}
// 添加分类
export const addCate = (cateInfo) => {
    return request({
        method: 'post',
        url: '/categories',
        data: cateInfo
    })
}
// 根据id查询分类
export const getCateById = (id) => {
    return request({
        method: 'get',
        url: `/categories/${id}`
    })
}
// 修改分类
export const editCate = (id, cat_name) => {
    return request({
        method: 'put',
        url: `/categories/${id}`,
        data: {
            cat_name
        }
    })
}
// 根据id删除分类
export const deleteCateById = (id) => {
    return request({
        method: 'delete',
        url: `/categories/${id}`,
    })
}