export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-2" />
        <div className="h-4 bg-muted rounded w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border border-border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-4" />
            <div className="h-8 bg-muted rounded w-16 mb-2" />
            <div className="h-3 bg-muted rounded w-32" />
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="border border-border rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-10 bg-muted rounded w-10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded w-20" />
                <div className="h-8 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
