import api from './axios'

export const getReports = () => api.get('/reports')
export const getReport = (id) => api.get(`/reports/${id}`)