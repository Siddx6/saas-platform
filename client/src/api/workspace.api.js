import api from './axios'

export const getWorkspace = () => api.get('/workspace')
export const updateWorkspace = (data) => api.patch('/workspace', data)
export const getMembers = () => api.get('/workspace/members')
export const inviteMember = (data) => api.post('/workspace/invite', data)
export const changeMemberRole = (id, role) => api.patch(`/workspace/members/${id}/role`, { role })
export const removeMember = (id) => api.delete(`/workspace/members/${id}`)
export const acceptInvite = (token, data) => api.post(`/workspace/accept-invite/${token}`, data)