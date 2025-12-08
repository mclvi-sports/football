import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in the browser.
 * This client handles authentication and data fetching on the client side.
 *
 * @returns A Supabase client instance configured for the browser, or null if not configured.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return null
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
