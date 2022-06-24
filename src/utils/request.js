import axios from 'axios'
import router from '../router'

const request = axios.create({
    baseURL: 'http://localhost:5555/',
    timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    err => Promise.reject(err),
)

// 响应拦截器
request.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        const { status } = err.response
        if (status === 401) {
            router.replace('/login')
        }
        return Promise.reject(err)
    }
)

export default request