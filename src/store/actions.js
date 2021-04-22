import actionTypes from './actionTypes'
import mutationTypes from './mutationTypes'
import { login } from 'network/login'

export default {
    // 登录action
    [actionTypes.LOGIN](context, payload) {
        return new Promise((resolve, reject) => {
            login(payload.userInfo)
                .then(res => {
                    if (res.meta.status == 200) {
                        window.sessionStorage.setItem('userInfo', JSON.stringify(res.data))
                        window.sessionStorage.setItem('token', res.data.token)
                        context.commit({
                            type: mutationTypes.LOGIN,
                            userInfo: res.data,
                            token: res.data.token
                        })
                        resolve('登录成功')
                    }else {
                        reject('用户名或密码错误')
                    }
                })
        })
    }
}