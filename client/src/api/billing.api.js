import api from './axios'

export const createOrder = () => api.post('/billing/create-order')
export const verifyPayment = (data) => api.post('/billing/verify-payment', data)