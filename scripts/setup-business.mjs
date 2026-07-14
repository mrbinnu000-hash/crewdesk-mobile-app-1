import { createClient } from '@supabase/supabase-js'

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!projectUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(projectUrl, serviceRoleKey)

async function setupBusiness() {
  try {
    console.log('Setting up business and user relationship...')

    // User ID from previous step
    const userId = '53629b62-347e-499c-911e-b6aacd71cc18'

    // Create business
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .insert([
        {
          name: 'CrewDesk Demo',
          phone: '(555) 000-0001',
          timezone: 'America/New_York',
        },
      ])
      .select()
      .single()

    if (businessError) {
      console.error('Error creating business:', businessError)
      process.exit(1)
    }

    console.log('Business created:', businessData.id)

    // Create profile linking user to business
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          business_id: businessData.id,
          full_name: 'Support Team',
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      process.exit(1)
    }

    console.log('Profile created successfully!')
    console.log('Business ID:', businessData.id)
    console.log('User ID:', userId)
  } catch (err) {
    console.error('Exception:', err)
    process.exit(1)
  }
}

setupBusiness()
