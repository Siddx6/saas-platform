import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateWorkspace } from '../../api/workspace.api'
import useWorkspaceStore from '../../store/workspaceStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Onboarding() {
  const navigate = useNavigate()
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)

  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!workspaceName.trim()) return setError('Workspace name is required')

    try {
      setLoading(true)
      const res = await updateWorkspace({ name: workspaceName })
      setWorkspace(res.data.workspace)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        <div className='flex justify-center mb-8'>
          <div className='w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>S</span>
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-8'>

          {/* Steps indicator */}
          <div className='flex items-center gap-2 mb-6'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-xs text-gray-500'>Account</span>
            </div>
            <div className='flex-1 h-px bg-gray-200' />
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center'>
                <span className='text-white text-xs font-medium'>2</span>
              </div>
              <span className='text-xs text-indigo-600 font-medium'>Workspace</span>
            </div>
            <div className='flex-1 h-px bg-gray-200' />
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-500 text-xs font-medium'>3</span>
              </div>
              <span className='text-xs text-gray-400'>Done</span>
            </div>
          </div>

          <h2 className='text-2xl font-semibold text-gray-900 mb-1'>Set up your workspace</h2>
          <p className='text-sm text-gray-500 mb-6'>
            This is the name of your company or team. You can change it later.
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Workspace name'
              name='workspaceName'
              placeholder='e.g. Acme Corp'
              value={workspaceName}
              onChange={(e) => { setWorkspaceName(e.target.value); setError('') }}
              error={error}
              required
            />

            <Button type='submit' fullWidth loading={loading}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}