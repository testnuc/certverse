import { supabase } from "@/integrations/supabase/client";

export async function saveQuery(query: string): Promise<void> {
  try {
    await supabase
      .from('domain_searches')
      .insert([{ domain: query }]);
  } catch (error) {
    console.error('Error saving query:', error);
  }
}