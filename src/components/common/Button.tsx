import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  children: ReactNode
  className?: string
}

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass = variant === 'icon' ? 'btn-icon' : 'btn'
  const variantClass = variant !== 'icon' ? `btn-${variant}` : ''

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
