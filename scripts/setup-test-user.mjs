import { createClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!projectUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(projectUrl, serviceRoleKey)

async function createTestUser() {
  console.log('Creating test user: support@crewdesk.in')

  try {
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'support@crewdesk.in',
      password: 'H@rSh@311205',
      email_confirm: true,
      user_metadata: {
        business_name: 'CrewDesk Demo',
      },
    })

    if (error) {
      console.error('Error creating user:', error)
      process.exit(1)
    }

    console.log('Test user created successfully!')
    console.log('User ID:', data.user.id)
    console.log('Email:', data.user.email)
  } catch (err) {
    console.error('Exception:', err)
    process.exit(1)
  }
}

createTestUser()
