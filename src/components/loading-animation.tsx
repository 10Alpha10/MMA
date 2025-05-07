'use client'

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <div className="relative w-20 h-20">
          {/* Outer circle */}
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
          {/* Inner circle */}
          <div className="absolute inset-2 border-4 border-t-transparent border-r-primary border-b-transparent border-l-primary rounded-full animate-spin-reverse"></div>
        </div>
      </div>
      <p className="text-xl font-medium text-gray-700 dark:text-gray-300 animate-pulse">
        Generating Questions...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center">
        Our AI is analyzing your content and crafting engaging questions. This may take a moment.
      </p>
    </div>
  )
}
