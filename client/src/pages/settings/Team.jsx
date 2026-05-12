import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMembers,
  inviteMember,
  changeMemberRole,
  removeMember,
} from '../../api/workspace.api'
import useAuthStore from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import Skeleton from '../../components/ui/Skeleton'

const roleBadge = { owner: 'purple', admin: 'blue', member: 'gray' }

export default function Team() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => getMembers().then((r) => r.data),
  })

  const inviteMutation = useMutation({
    mutationFn: () => inviteMember({ email: inviteEmail, role: inviteRole }),
    onSuccess: () => {
      setInviteSuccess(true)
      setInviteEmail('')
      queryClient.invalidateQueries(['members'])
      setTimeout(() => {
        setInviteSuccess(false)
        setInviteModal(false)
      }, 2000)
    },
    onError: (err) => {
      setInviteError(err.response?.data?.message || 'Invite failed')
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => changeMemberRole(id, role),
    onSuccess: () => queryClient.invalidateQueries(['members']),
  })

  const removeMutation = useMutation({
    mutationFn: (id) => removeMember(id),
    onSuccess: () => queryClient.invalidateQueries(['members']),
  })

  const handleInvite = (e) => {
    e.preventDefault()
    if (!inviteEmail) return setInviteError('Email is required')
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) return setInviteError('Enter a valid email')
    setInviteError('')
    inviteMutation.mutate()
  }

  return (
    <div className='space-y-6 max-w-3xl'>

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>Team Members</h2>
          <p className='text-sm text-gray-500 mt-0.5'>Manage your team and their roles</p>
        </div>
        <Button onClick={() => setInviteModal(true)}>
          <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Invite member
        </Button>
      </div>

      <Card padding={false}>
        {isLoading ? (
          <div className='p-6 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center gap-3'>
                <Skeleton width='w-9' height='h-9' className='rounded-full' />
                <div className='flex-1 space-y-1'>
                  <Skeleton height='h-3' width='w-32' />
                  <Skeleton height='h-3' width='w-48' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className='divide-y divide-gray-100'>
            {members?.map((member) => (
              <li key={member._id} className='flex items-center justify-between px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <Avatar name={member.name} size='md' />
                  <div>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-medium text-gray-900'>{member.name}</p>
                      {member._id === user?._id && (
                        <span className='text-xs text-gray-400'>(you)</span>
                      )}
                    </div>
                    <p className='text-xs text-gray-500'>{member.email}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Badge variant={roleBadge[member.role]}>
                    {member.role}
                  </Badge>

                  {/* Role change — only owner can change */}
                  {user?.role === 'owner' && member._id !== user?._id && (
                    <select
                      value={member.role}
                      onChange={(e) => roleMutation.mutate({ id: member._id, role: e.target.value })}
                      className='text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      <option value='admin'>Admin</option>
                      <option value='member'>Member</option>
                    </select>
                  )}

                  {/* Remove member */}
                  {user?.role === 'owner' && member._id !== user?._id && (
                    <button
                      onClick={() => removeMutation.mutate(member._id)}
                      className='text-gray-400 hover:text-red-500 transition-colors'
                      title='Remove member'
                    >
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModal}
        onClose={() => { setInviteModal(false); setInviteSuccess(false); setInviteEmail(''); setInviteError('') }}
        title='Invite team member'
      >
        {inviteSuccess ? (
          <div className='text-center py-4'>
            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <svg className='w-5 h-5 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <p className='text-sm text-gray-600'>Invite sent successfully</p>
          </div>
        ) : (
          <form onSubmit={handleInvite} className='space-y-4'>
            <Input
              label='Email'
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder='name@company.com'
            />
            <div>
              <label className='text-sm text-gray-600'>Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className='mt-1 block w-full border border-gray-200 rounded-lg px-2 py-1 text-gray-700'
              >
                <option value='member'>Member</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
            {inviteError && <p className='text-sm text-red-500'>{inviteError}</p>}
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='ghost' onClick={() => { setInviteModal(false); setInviteError('') }}>Cancel</Button>
              <Button type='submit' disabled={inviteMutation.isLoading}>
                {inviteMutation.isLoading ? 'Inviting...' : 'Send invite'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}