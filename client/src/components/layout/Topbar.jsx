import { useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Avatar from '../ui/Avatar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/settings/workspace': 'Workspace Settings',
  '/settings/team': 'Team',
  '/settings/billing': 'Billing',
  '/settings/notifications': 'Notifications',
}

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore()
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'Dashboard'

  return (
    <header className='h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 lg:left-64 z-10 shadow-sm'>
      <div className='flex items-center gap-3'>
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className='lg:hidden text-gray-500 hover:text-gray-700 transition-colors'
        >
          <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
        <h1 className='text-base lg:text-lg font-semibold text-gray-900'>{title}</h1>
      </div>
      <div className='flex items-center gap-2 lg:gap-3'>
        <Avatar name={user?.name || ''} size='sm' />
        <span className='text-sm font-medium text-gray-700 hidden sm:block'>{user?.name}</span>
      </div>
    </header>
  )
}