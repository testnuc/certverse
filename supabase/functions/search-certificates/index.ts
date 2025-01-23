import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function fetchWithRetry(query: string, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`
      )
      
      if (response.ok) {
        return response
      }
      
      console.log(`Attempt ${attempt} failed, ${retries - attempt} retries left`)
      if (attempt < retries) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      if (attempt === retries) throw error
      console.error(`Attempt ${attempt} error:`, error)
    }
  }
  throw new Error('All retry attempts failed')
}

async function checkCachedResults(query: string) {
  const { data: certificates } = await supabase
    .from('crt')
    .select('*')
    .eq('domain', query)
    .order('created_at', { ascending: false })
    .limit(1)

  if (certificates && certificates.length > 0) {
    const cacheAge = Date.now() - new Date(certificates[0].created_at).getTime()
    // Return cached results if less than 1 hour old
    if (cacheAge < 3600000) {
      return certificates
    }
  }
  return null
}

async function storeCertificates(certificates: any[], domain: string) {
  for (const cert of certificates) {
    await supabase.from('crt').insert({
      common_name: cert.common_name,
      issuer_name: cert.issuer_name,
      not_before: cert.not_before,
      not_after: cert.not_after,
      domain: domain
    })
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Searching certificates for domain: ${query}`)
    
    // Check cache first
    const cachedResults = await checkCachedResults(query)
    if (cachedResults) {
      console.log('Returning cached results')
      return new Response(
        JSON.stringify(cachedResults),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If no cache, fetch from crt.sh with retry logic
    const response = await fetchWithRetry(query)
    const data = await response.json()
    
    // Store results in database for future queries
    await storeCertificates(data, query)
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch certificates' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})