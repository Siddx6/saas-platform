import api from './axios'

export const uploadData = (data) => api.post('/data/upload', data)
export const getSummary = () => api.get('/data/summary')
export const getRevenueChart = (range) => api.get(`/data/revenue-chart?range=${range}`)
export const getTopProducts = () => api.get('/data/top-products')