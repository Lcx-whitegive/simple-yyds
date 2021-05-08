import { request } from './request'

// 获取商品列表
export const getGoodsList = (queryInfo) => {
    return request({
        method: 'get',
        url: '/goods',
        params: queryInfo
    })
}
// 根据id删除商品
export const deleteGoodsById = (id) => {
    return request({
        method: 'delete',
        url: `/goods/${id}`
    })
}
// 添加商品
export const addGoods = (goodsInfo) => {
    return request({
        method: 'post',
        url: '/goods',
        data: goodsInfo
    })
}