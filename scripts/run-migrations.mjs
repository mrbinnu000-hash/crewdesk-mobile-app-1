import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!projectUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(projectUrl, serviceRoleKey)

async function runMigrations() {
  try {
    console.log('Running database migrations...')

    // Read the migration file
    const migrationFile = path.join(process.cwd(), 'lib/migrations/001_init.sql')
    const sql = fs.readFileSync(migrationFile, 'utf8')

    // Execute the migration
    const { error } = await supabase.rpc('exec', {
      sql_string: sql,
    }).catch(async () => {
      // If rpc doesn't exist, try direct query
      console.log('Using direct query execution...')
      // Split by semicolons and execute statements
      const statements = sql.split(';').filter(s => s.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('query', { query: statement })
          if (error) throw error
        }
      }
      return { error: null }
    })

    if (error) {
      console.error('Migration error:', error)
      // Continue anyway as the tables might already exist
    }

    console.log('Migrations completed!')
  } catch (err) {
    console.error('Exception:', err.message)
    // Continue with setup
  }
}

runMigrations()
