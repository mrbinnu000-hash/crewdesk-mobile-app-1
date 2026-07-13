import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

/**
 * Upload a recording file to Supabase Storage
 * Files are stored in: recordings/{business_id}/{call_id}.mp3
 * Access is restricted to authenticated users in the same business
 */
export async function uploadRecording(
  supabase: SupabaseClient<Database>,
  businessId: string,
  callId: string,
  file: File
): Promise<{ path: string; error?: string }> {
  try {
    const filePath = `${businessId}/${callId}.mp3`

    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[CrewDesk] Recording upload error:', error)
      return { path: '', error: error.message }
    }

    return { path: data.path }
  } catch (error) {
    console.error('[CrewDesk] Recording upload exception:', error)
    return { path: '', error: 'Failed to upload recording' }
  }
}

/**
 * Generate a signed URL for secure recording download
 * URL expires after 1 hour
 * Only accessible by authenticated users in the same business
 */
export async function getRecordingUrl(
  supabase: SupabaseClient<Database>,
  businessId: string,
  callId: string
): Promise<{ url: string; error?: string }> {
  try {
    const filePath = `${businessId}/${callId}.mp3`

    const { data, error } = await supabase.storage
      .from('recordings')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('[CrewDesk] Signed URL error:', error)
      return { url: '', error: error.message }
    }

    return { url: data.signedUrl }
  } catch (error) {
    console.error('[CrewDesk] Signed URL exception:', error)
    return { url: '', error: 'Failed to generate download URL' }
  }
}

/**
 * Delete a recording file from storage
 * Only business admins can delete recordings
 */
export async function deleteRecording(
  supabase: SupabaseClient<Database>,
  businessId: string,
  callId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = `${businessId}/${callId}.mp3`

    const { error } = await supabase.storage
      .from('recordings')
      .remove([filePath])

    if (error) {
      console.error('[CrewDesk] Recording delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[CrewDesk] Recording delete exception:', error)
    return { success: false, error: 'Failed to delete recording' }
  }
}

/**
 * Check if a recording exists in storage
 */
export async function recordingExists(
  supabase: SupabaseClient<Database>,
  businessId: string,
  callId: string
): Promise<boolean> {
  try {
    const filePath = `${businessId}/${callId}.mp3`

    const { data, error } = await supabase.storage
      .from('recordings')
      .list(businessId)

    if (error) {
      console.error('[CrewDesk] Recording check error:', error)
      return false
    }

    return data.some((file) => file.name === `${callId}.mp3`)
  } catch (error) {
    console.error('[CrewDesk] Recording check exception:', error)
    return false
  }
}

/**
 * Get file size of a recording
 */
export async function getRecordingSize(
  supabase: SupabaseClient<Database>,
  businessId: string,
  callId: string
): Promise<number> {
  try {
    const filePath = `${businessId}/${callId}.mp3`

    const { data, error } = await supabase.storage
      .from('recordings')
      .list(businessId)

    if (error) {
      console.error('[CrewDesk] Recording size check error:', error)
      return 0
    }

    const file = data.find((f) => f.name === `${callId}.mp3`)
    return file?.metadata?.size || 0
  } catch (error) {
    console.error('[CrewDesk] Recording size exception:', error)
    return 0
  }
}
