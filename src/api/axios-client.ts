import axios from 'axios'

export const appAxiosInstance = axios.create({ baseURL: 'http://localhost:6200/' })
