import { Camera, Palette, Film, Video } from 'lucide-react'

const services = [
  {
    icon: Camera,
    title: 'Cinematography',
    description: 'Expert Director of Photography services for branded content, commercials, and editorial projects.',
  },
  {
    icon: Palette,
    title: 'Color Grading',
    description: 'Professional color grading and post-production color correction to elevate your visual story.',
  },
  {
    icon: Film,
    title: 'Editing',
    description: 'Comprehensive video editing services from rough cuts to final delivery.',
  },
  {
    icon: Video,
    title: 'Camera Operation',
    description: 'Technical expertise in camera operation for productions of all scales.',
  },
]

export function ServicesCards() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full-service production capabilities from pre-production through final delivery
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-lg border border-border/40 hover:border-foreground/20 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4">
                <service.icon className="h-10 w-10 text-foreground/60 group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
