'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadFile, getSignedUrl, deleteFile as deleteStorageFile } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema
const fileUploadSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  file_name: z.string().min(1, 'File name is required'),
  file_type: z.string().min(1, 'File type is required'),
  file_size: z.number().positive('File size must be positive'),
  is_final: z.boolean().optional(),
  version: z.number().optional(),
  notes: z.string().optional(),
})

type FileUploadData = z.infer<typeof fileUploadSchema>

export async function uploadProjectFile(
  formData: FileUploadData,
  fileData: string | Uint8Array | ArrayBuffer | Blob | Buffer
) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }

    // Validate input
    const validatedData = fileUploadSchema.parse(formData)

    // Check project access
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', validatedData.project_id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized. You do not have access to this project.' }
    }

    // Upload file to Supabase Storage
    const bucket = 'project_files'
    const path = `${validatedData.project_id}/${Date.now()}-${validatedData.file_name}`

    const uploadResult = await uploadFile(
      bucket,
      path,
      fileData,
      validatedData.file_type
    )

    if (!uploadResult.success) {
      return { success: false, error: 'Failed to upload file to storage' }
    }

    // Insert file record in database
    const { data: fileRecord, error } = await supabase
      .from('project_files')
      .insert({
        project_id: validatedData.project_id,
        uploaded_by: user.id,
        file_url: uploadResult.path!,
        file_name: validatedData.file_name,
        file_type: validatedData.file_type,
        file_size: validatedData.file_size,
        is_final: validatedData.is_final || false,
        version: validatedData.version || 1,
        notes: validatedData.notes,
      })
      .select()
      .single()

    if (error) {
      // If database insert fails, delete the uploaded file
      await deleteStorageFile(bucket, path)
      console.error('File record creation error:', error)
      return { success: false, error: 'Failed to create file record' }
    }

    // Send notification to the other party
    const recipientId = isAdmin ? project.client_id : await getAdminId()

    if (recipientId) {
      await supabase.from('notifications').insert({
        user_id: recipientId,
        type: 'file_uploaded',
        title: 'New File Uploaded',
        message: `A new file "${validatedData.file_name}" has been uploaded`,
        link: `/projects/${validatedData.project_id}`,
      })
    }

    // Revalidate
    revalidatePath(`/projects/${validatedData.project_id}`)
    revalidatePath(`/admin/projects/${validatedData.project_id}`)

    return { success: true, data: fileRecord }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getFileDownloadUrl(fileId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get file record
    const { data: file } = await supabase
      .from('project_files')
      .select('file_url, project_id, file_name')
      .eq('id', fileId)
      .single()

    if (!file) {
      return { success: false, error: 'File not found' }
    }

    // Check project access
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', file.project_id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return { success: false, error: 'Unauthorized' }
    }

    // Generate signed URL (valid for 1 hour)
    const urlResult = await getSignedUrl('project_files', file.file_url, 3600)

    if (!urlResult.success) {
      return { success: false, error: 'Failed to generate download URL' }
    }

    return { success: true, data: { url: urlResult.url, fileName: file.file_name } }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteProjectFile(fileId: string) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get file record
    const { data: file } = await supabase
      .from('project_files')
      .select('file_url, project_id, uploaded_by')
      .eq('id', fileId)
      .single()

    if (!file) {
      return { success: false, error: 'File not found' }
    }

    // Check if user can delete (admin or uploader)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isUploader = file.uploaded_by === user.id

    if (!isAdmin && !isUploader) {
      return { success: false, error: 'Unauthorized. Only admins or file uploaders can delete files.' }
    }

    // Delete file from storage
    await deleteStorageFile('project_files', file.file_url)

    // Delete file record
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId)

    if (error) {
      console.error('File deletion error:', error)
      return { success: false, error: 'Failed to delete file record' }
    }

    // Revalidate
    revalidatePath(`/projects/${file.project_id}`)
    revalidatePath(`/admin/projects/${file.project_id}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateFileStatus(fileId: string, isFinal: boolean) {
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

    // Update file
    const { data: file, error } = await supabase
      .from('project_files')
      .update({ is_final: isFinal })
      .eq('id', fileId)
      .select('project_id')
      .single()

    if (error) {
      console.error('File update error:', error)
      return { success: false, error: 'Failed to update file status' }
    }

    // Revalidate
    revalidatePath(`/projects/${file.project_id}`)
    revalidatePath(`/admin/projects/${file.project_id}`)

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Helper function to get admin ID
async function getAdminId(): Promise<string | null> {
  const supabase = await createClient()

  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  return admins && admins.length > 0 ? admins[0].id : null
}
