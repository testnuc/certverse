import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function fetchWithRetry(url: string, retries = 3, initialDelay = 1000): Promise<Response> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
      });
      
      if (response.ok) {
        return response;
      }
      
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    } catch (error) {
      lastError = error as Error;
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw lastError || new Error('All retry attempts failed');
}

function buildSearchUrl(query: string, filter: string): string {
  const baseUrl = 'https://crt.sh/';
  const params = new URLSearchParams();
  
  switch (filter) {
    case 'organization':
      params.set('O', query);
      break;
    case 'fingerprint':
      params.set('sha256', query);
      break;
    case 'id':
      params.set('caid', query);
      break;
    case 'root':
      params.set('exclude', 'expired');
      params.set('rootIncluded', 'true');
      params.set('q', query);
      break;
    default:
      params.set('q', query);
  }
  
  params.set('output', 'json');
  return `${baseUrl}?${params.toString()}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, filter = 'domain' } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const searchUrl = buildSearchUrl(query, filter);
    const response = await fetchWithRetry(searchUrl);
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch certificates' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});