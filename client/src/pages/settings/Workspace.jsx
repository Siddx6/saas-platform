import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkspace, updateWorkspace } from '../../api/workspace.api'
import useWorkspaceStore from '../../store/workspaceStore'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Workspace() {
  const queryClient = useQueryClient()
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)

  const [name, setName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace'],
    queryFn: () => getWorkspace().then((r) => r.data),
  })

  useEffect(() => {
    if (workspace) setName(workspace.name)
  }, [workspace])

  const mutation = useMutation({
    mutationFn: () => updateWorkspace({ name }),
    onSuccess: (res) => {
      setWorkspace(res.data.workspace)
      queryClient.invalidateQueries(['workspace'])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Update failed')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Workspace name is required')
    setError('')
    mutation.mutate()
  }

  return (
    <div className='space-y-6 max-w-2xl'>

      <div>
        <h2 className='text-lg font-semibold text-gray-900'>Workspace Settings</h2>
        <p className='text-sm text-gray-500 mt-0.5'>Manage your workspace details</p>
      </div>

      <Card>
        <h3 className='text-sm font-semibold text-gray-900 mb-4'>General</h3>

        {isLoading ? (
          <div className='space-y-4'>
            <div className='h-10 bg-gray-100 rounded-lg animate-pulse' />
            <div className='h-10 bg-gray-100 rounded-lg animate-pulse w-32' />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Workspace name'
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              error={error}
              placeholder='e.g. Acme Corp'
              required
            />

            <div className='flex items-center gap-3'>
              <Button type='submit' loading={mutation.isPending}>
                Save changes
              </Button>
              {success && (
                <span className='text-sm text-green-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  Saved
                </span>
              )}
            </div>
          </form>
        )}
      </Card>

      {/* Workspace info */}
      <Card>
        <h3 className='text-sm font-semibold text-gray-900 mb-4'>Workspace Info</h3>
        <div className='space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Workspace ID</span>
            <span className='text-gray-700 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded'>
              {workspace?._id}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Created</span>
            <span className='text-gray-700'>
              {workspace?.createdAt
                ? new Date(workspace.createdAt).toLocaleDateString('en-IN')
                : '—'}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Plan</span>
            <span className={`font-medium ${workspace?.plan === 'pro' ? 'text-indigo-600' : 'text-gray-700'}`}>
              {workspace?.plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <h3 className='text-sm font-semibold text-red-600 mb-1'>Danger Zone</h3>
        <p className='text-sm text-gray-500 mb-4'>
          Deleting your workspace is permanent and cannot be undone.
        </p>
        <Button variant='danger' size='sm'>
          Delete workspace
        </Button>
      </Card>

    </div>
  )
}