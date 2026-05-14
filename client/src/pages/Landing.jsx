import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className='min-h-screen bg-white'>

      {/* Navbar */}
      <nav className='flex items-center justify-between px-6 lg:px-16 py-4 border-b border-gray-100'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>S</span>
          </div>
          <span className='font-semibold text-gray-900'>SaaSPlatform</span>
        </div>
        <div className='flex items-center gap-3'>
          <Link
            to='/login'
            className='text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors'
          >
            Sign in
          </Link>
          <Link
            to='/signup'
            className='text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium'
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className='px-6 lg:px-16 pt-20 pb-16 text-center max-w-4xl mx-auto'>
        <div className='inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6'>
          <span className='w-1.5 h-1.5 bg-indigo-600 rounded-full'></span>
          AI-powered business analytics
        </div>
        <h1 className='text-4xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6'>
          Your business data,{' '}
          <span className='text-indigo-600'>turned into insights</span>
        </h1>
        <p className='text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed'>
          Upload your sales data, manage your team, and receive AI-generated weekly business reports — all in one platform built for modern teams.
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Link
            to='/signup'
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm'
          >
            Get started for free
          </Link>
          <Link
            to='/login'
            className='border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm'
          >
            Sign in
          </Link>
        </div>
        <p className='text-xs text-gray-400 mt-4'>No credit card required · Free plan available</p>
      </section>

      {/* Stats */}
      <section className='px-6 lg:px-16 py-12 bg-gray-50'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center'>
          {[
            { value: 'AI Reports', label: 'Every Monday automatically' },
            { value: 'Real-time', label: 'Revenue dashboard' },
            { value: 'Multi-tenant', label: 'Team workspaces' },
            { value: 'Razorpay', label: 'Secure billing' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className='text-xl font-semibold text-indigo-600 mb-1'>{stat.value}</p>
              <p className='text-sm text-gray-500'>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className='px-6 lg:px-16 py-20 max-w-6xl mx-auto'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl font-semibold text-gray-900 mb-3'>Everything your team needs</h2>
          <p className='text-gray-500'>One platform to track revenue, manage your team, and get AI-powered insights</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              ),
              title: 'Revenue dashboard',
              desc: 'Upload your CSV data and instantly see KPI cards, revenue charts, and top product breakdowns.',
              color: 'bg-indigo-50 text-indigo-600',
            },
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              ),
              title: 'AI weekly reports',
              desc: 'Every Monday, our AI analyzes your data and delivers a business report with highlights, warnings, and recommendations.',
              color: 'bg-purple-50 text-purple-600',
            },
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              ),
              title: 'Team management',
              desc: 'Invite team members via email, assign roles (Owner, Admin, Member), and manage access control.',
              color: 'bg-green-50 text-green-600',
            },
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              ),
              title: 'Secure authentication',
              desc: 'Email/password signup with JWT tokens, Google OAuth, and email verification built in.',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              ),
              title: 'Email notifications',
              desc: 'Get weekly report emails, team invite notifications, and billing alerts delivered to your inbox.',
              color: 'bg-yellow-50 text-yellow-600',
            },
            {
              icon: (
                <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                </svg>
              ),
              title: 'Subscription billing',
              desc: 'Free plan to get started. Upgrade to Pro for ₹999/month with Razorpay for unlimited features.',
              color: 'bg-red-50 text-red-600',
            },
          ].map((feature) => (
            <div key={feature.title} className='p-6 border border-gray-100 rounded-xl hover:border-indigo-100 hover:shadow-sm transition-all'>
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>{feature.title}</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className='px-6 lg:px-16 py-20 bg-gray-50'>
        <div className='max-w-4xl mx-auto text-center mb-14'>
          <h2 className='text-3xl font-semibold text-gray-900 mb-3'>How it works</h2>
          <p className='text-gray-500'>Get started in minutes, get insights every week</p>
        </div>
        <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            { step: '01', title: 'Create your workspace', desc: 'Sign up and set up your company workspace. Invite your team members with role-based access.' },
            { step: '02', title: 'Upload your data', desc: 'Upload your sales or revenue CSV file. Your dashboard updates instantly with charts and KPIs.' },
            { step: '03', title: 'Get AI insights', desc: 'Every Monday, our AI analyzes your week and delivers a business report straight to your inbox.' },
          ].map((item) => (
            <div key={item.step} className='text-center'>
              <div className='w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-semibold text-sm'>
                {item.step}
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>{item.title}</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className='px-6 lg:px-16 py-20 max-w-4xl mx-auto'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl font-semibold text-gray-900 mb-3'>Simple pricing</h2>
          <p className='text-gray-500'>Start free, upgrade when you need more</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
          {[
            {
              name: 'Free',
              price: '₹0',
              period: 'forever',
              features: ['1 user', '30 days data history', 'Basic dashboard', 'Manual CSV upload'],
              cta: 'Get started free',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '₹999',
              period: 'per month',
              features: ['Unlimited users', 'Full data history', 'AI weekly reports', 'Email report delivery', 'Priority support'],
              cta: 'Start Pro plan',
              highlight: true,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border ${plan.highlight ? 'border-indigo-200 ring-1 ring-indigo-200 bg-white' : 'border-gray-200 bg-gray-50'}`}
            >
              <h3 className='font-semibold text-gray-900 mb-1'>{plan.name}</h3>
              <div className='flex items-baseline gap-1 mb-1'>
                <span className='text-3xl font-semibold text-gray-900'>{plan.price}</span>
                <span className='text-sm text-gray-500'>/{plan.period}</span>
              </div>
              <ul className='space-y-3 my-6'>
                {plan.features.map((f) => (
                  <li key={f} className='flex items-center gap-2 text-sm text-gray-600'>
                    <svg className='w-4 h-4 text-green-500 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to='/signup'
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='px-6 lg:px-16 py-20 bg-indigo-600 text-center'>
        <h2 className='text-3xl font-semibold text-white mb-4'>Ready to grow your business?</h2>
        <p className='text-indigo-200 mb-8 text-sm'>Join businesses already using SaaSPlatform to track revenue and get weekly AI insights.</p>
        <Link
          to='/signup'
          className='inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors'
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className='px-6 lg:px-16 py-8 border-t border-gray-100 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center'>
            <span className='text-white text-xs font-bold'>S</span>
          </div>
          <span className='text-sm font-medium text-gray-700'>SaaSPlatform</span>
        </div>
        <p className='text-xs text-gray-400'>Built with React, Node.js, Python & Groq AI</p>
      </footer>

    </div>
  )
}