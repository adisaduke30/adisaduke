const clients = [
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Puma', logo: 'PUMA' },
  { name: 'HP', logo: 'HP' },
  { name: 'Vimeo', logo: 'VIMEO' },
]

export function ClientLogos() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center max-w-3xl mx-auto">
      {clients.map((client) => (
        <div
          key={client.name}
          className="text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          <span className="text-2xl font-bold tracking-wider">{client.logo}</span>
        </div>
      ))}
    </div>
  )
}
