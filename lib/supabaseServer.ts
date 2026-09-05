const baseUrl = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '')

function getKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

function headers(extra?: HeadersInit) {
  const key = getKey()
  const h: Record<string, string> = {
    apikey: key,
    'Content-Type': 'application/json',
  }

  // Legacy service_role keys are JWTs and can be sent as Bearer tokens.
  // New sb_secret_ keys should be sent on the apikey header only.
  if (key && !key.startsWith('sb_secret_')) {
    h.Authorization = `Bearer ${key}`
  }

  return { ...h, ...(extra || {}) }
}

export function assertSupabaseEnv() {
  const url = baseUrl()
  const key = getKey()
  if (!url || !key) {
    throw new Error('SUPABASE_ENV_MISSING')
  }
  return { url, key }
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<{ data: T; response: Response }> {
  const { url } = assertSupabaseEnv()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: headers(init.headers),
    cache: 'no-store',
  })

  const text = await response.text()
  let data: any = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!response.ok) {
    const err = new Error(data?.message || data?.hint || `Supabase request failed (${response.status})`) as Error & { status?: number; details?: any }
    err.status = response.status
    err.details = data
    throw err
  }

  return { data: data as T, response }
}
