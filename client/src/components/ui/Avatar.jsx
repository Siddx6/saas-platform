export default function Avatar({ name = '', size = 'md' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold flex-shrink-0 ${sizes[size]}`}>
      {initials}
    </div>
  )
}