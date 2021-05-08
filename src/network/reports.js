import { request } from './request'

// 获取折线图数据
export const getReportsData = () => {
    return request({
        method: 'get',
        url: 'reports/type/1'
    })
}