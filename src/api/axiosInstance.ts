import axios from 'axios'
import { apiUrl } from '@/utils/apiUrl'
import { getAuthToken } from '@/utils/auth'

const axiosInstance = axios.create({
  baseURL: apiUrl,
})

// Add request interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
