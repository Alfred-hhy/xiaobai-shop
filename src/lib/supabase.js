import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wpeaejmtmaqasrblzvxl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZWFlam10bWFxYXNyYmx6dnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NjU4MjEsImV4cCI6MjA4OTA0MTgyMX0.GAELRV3E02_n8ZbmWa4P4Rm2I8Vt9p-TLmF_qD_bP08'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // uni-app 环境下使用 uni.setStorageSync / getStorageSync
    storage: {
      getItem: (key) => {
        try {
          return uni.getStorageSync(key) || null
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          uni.setStorageSync(key, value)
        } catch {}
      },
      removeItem: (key) => {
        try {
          uni.removeStorageSync(key)
        } catch {}
      }
    },
    autoRefreshToken: true,
    persistSession: true
  }
})
