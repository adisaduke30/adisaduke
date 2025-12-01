import { createClient } from './client'

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { path: data.path, url: publicUrl }
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}

export async function listFiles(bucket: string, folder: string = '') {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder)

  if (error) throw error
  return data
}
