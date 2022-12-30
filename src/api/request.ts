import axios from 'axios'
const service  = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 3000000,
    // 跨域时候允许携带凭证
    withCredentials: true
})
export default service
