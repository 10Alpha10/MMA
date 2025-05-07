interface SubmitProps {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Submit({ children, onClick, loading, disabled, className = '' }: SubmitProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full rounded-lg py-3 font-medium transition-all bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 ${className} disabled:opacity-50`}
    >
      {loading ? 'Generating...' : children}
    </button>
  )
}
