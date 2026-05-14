import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useWorkspaceStore from '../../store/workspaceStore'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
      </svg>
    ),
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
      </svg>
    ),
  },
]

const settingsItems = [
  {
    label: 'Workspace',
    path: '/settings/workspace',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
      </svg>
    ),
  },
  {
    label: 'Team',
    path: '/settings/team',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
  },
  {
    label: 'Billing',
    path: '/settings/billing',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
      </svg>
    ),
  },
  {
    label: 'Notifications',
    path: '/settings/notifications',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
      </svg>
    ),
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { workspace, clearWorkspace } = useWorkspaceStore()

  const handleLogout = () => {
    logout()
    clearWorkspace()
    navigate('/')
  }

  const activeClass = 'bg-indigo-50 text-indigo-600 font-medium'
  const inactiveClass = 'text-gray-600 hover:bg-gray-100'

  return (
    <aside className={`
      fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200
      flex flex-col z-30 transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>

      {/* Logo + workspace */}
      <div className='px-5 py-4 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>S</span>
            </div>
            <span className='text-sm font-semibold text-gray-900'>SaaSPlatform</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className='lg:hidden text-gray-400 hover:text-gray-600'
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <p className='text-xs text-gray-500 truncate'>{workspace?.name || 'My Workspace'}</p>
          <Badge variant={workspace?.plan === 'pro' ? 'purple' : 'gray'}>
            {workspace?.plan === 'pro' ? 'Pro' : 'Free'}
          </Badge>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 overflow-y-auto'>
        <p className='text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2'>Main</p>
        <ul className='space-y-1 mb-6'>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? activeClass : inactiveClass}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className='text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2'>Settings</p>
        <ul className='space-y-1'>
          {settingsItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? activeClass : inactiveClass}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className='px-3 py-4 border-t border-gray-100'>
        <div className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50'>
          <Avatar name={user?.name || 'User'} size='sm' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>{user?.name}</p>
            <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className='text-gray-400 hover:text-red-500 transition-colors'
            title='Logout'
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}