'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const bookingSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  desired_date: z.string().min(1, 'Date is required'),
  project_type: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  budget_range: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export async function createBooking(formData: BookingFormData) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to create a booking' }
    }

    // Validate input
    const validatedData = bookingSchema.parse(formData)

    // Insert booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        ...validatedData,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Booking creation error:', error)
      return { success: false, error: 'Failed to create booking. Please try again.' }
    }

    // Create notification for admin
    await createBookingNotification(booking.id, user.id)

    // Revalidate bookings page
    revalidatePath('/bookings')
    revalidatePath('/admin/bookings')

    return { success: true, data: booking }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'reviewing' | 'approved' | 'declined' | 'converted',
  adminNotes?: string
) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Update booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status,
        admin_notes: adminNotes,
        responded_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Booking update error:', error)
      return { success: false, error: 'Failed to update booking' }
    }

    // Create notification for client
    await createBookingStatusNotification(booking.id, booking.client_id, status)

    // Revalidate
    revalidatePath('/admin/bookings')
    revalidatePath('/bookings')

    return { success: true, data: booking }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function convertBookingToProject(
  bookingId: string,
  projectData: {
    name: string
    description?: string
    project_type?: string
    deadline?: string
  }
) {
  try {
    const supabase = await createClient()

    // Check admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' }
    }

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return { success: false, error: 'Booking not found' }
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        client_id: booking.client_id,
        name: projectData.name,
        description: projectData.description || booking.message,
        project_type: projectData.project_type || booking.project_type,
        deadline: projectData.deadline,
        status: 'pre_production',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      return { success: false, error: 'Failed to create project' }
    }

    // Update booking status and link to project
    await supabase
      .from('bookings')
      .update({
        status: 'converted',
        converted_project_id: project.id,
        responded_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    // Create notification for client
    await createProjectCreatedNotification(project.id, booking.client_id)

    // Revalidate
    revalidatePath('/admin/bookings')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    revalidatePath('/bookings')

    return { success: true, data: project }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Helper functions for notifications
async function createBookingNotification(bookingId: string, clientId: string) {
  const supabase = await createClient()

  // Get all admins
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')

  if (admins && admins.length > 0) {
    // Create notification for each admin
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'booking_request',
      title: 'New Booking Request',
      message: 'A new booking request has been submitted',
      link: `/admin/bookings`,
    }))

    await supabase.from('notifications').insert(notifications)
  }
}

async function createBookingStatusNotification(
  bookingId: string,
  clientId: string,
  status: string
) {
  const supabase = await createClient()

  let title = 'Booking Update'
  let message = 'Your booking request has been updated'

  switch (status) {
    case 'approved':
      title = 'Booking Approved'
      message = 'Your booking request has been approved!'
      break
    case 'declined':
      title = 'Booking Declined'
      message = 'Your booking request has been declined'
      break
    case 'reviewing':
      title = 'Booking Under Review'
      message = 'Your booking request is being reviewed'
      break
  }

  await supabase.from('notifications').insert({
    user_id: clientId,
    type: 'booking_status',
    title,
    message,
    link: '/bookings',
  })
}

async function createProjectCreatedNotification(projectId: string, clientId: string) {
  const supabase = await createClient()

  await supabase.from('notifications').insert({
    user_id: clientId,
    type: 'project_created',
    title: 'Project Created',
    message: 'A new project has been created from your booking request',
    link: `/projects/${projectId}`,
  })
}
