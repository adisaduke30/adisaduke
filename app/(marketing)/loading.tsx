export default function MarketingLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-pulse">
          <div className="h-16 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-12 bg-muted rounded w-48 mx-auto" />
        </div>
      </section>

      {/* Video Grid Skeleton */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-pulse">
            <div className="h-12 bg-muted rounded w-64 mb-4" />
            <div className="h-6 bg-muted rounded w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-muted-foreground/10" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
