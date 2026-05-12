import api from './axios'

export const login = (data) => api.post('/auth/login', data)
export const signup = (data) => api.post('/auth/signup', data)
export const logout = () => api.post('/auth/logout')
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data)
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`)
export const getMe = () => api.get('/auth/me')