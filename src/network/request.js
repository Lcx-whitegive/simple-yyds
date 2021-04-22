import axios from 'axios'

export const request = (config) => {
  //创建axios实例
  const instence = axios.create({
      baseURL: 'http://timemeetyou.com:8889/api/private/v1',
      timeout: 5000,
  })
  //实例请求拦截
  instence.interceptors.request.use(config => {
      const token = window.sessionStorage.getItem('token')
      config.headers = Object.assign({}, config.headers, {
        Authorization: token
      })
      return config
  }, err => {
      console.log(err);
  })
  //实例响应拦截
  instence.interceptors.response.use(res => {
      return res.data
  }, err => {
      console.log(err);
  })
  return instence(config)
}