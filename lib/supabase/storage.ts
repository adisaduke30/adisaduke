import { createClient } from './client'

export async function uploadFile(
  bucket: string,
  path: string,
  file: string | Uint8Array | ArrayBuffer | Blob | Buffer | File,
  contentType?: string
) {
  const supabase = createClient()

  const options: any = {
    cacheControl: '3600',
    upsert: false,
  }

  if (contentType) {
    options.contentType = contentType
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, path: data.path }
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

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, url: data.signedUrl }
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function listFiles(bucket: string, folder: string = '') {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder)

  if (error) throw error
  return data
}
