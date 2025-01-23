import { supabase } from "@/integrations/supabase/client";

export async function saveQuery(query: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('domain_searches')
      .insert([{ domain: query }]);
      
    if (error) {
      console.error('Error saving query:', error);
    }
  } catch (error) {
    console.error('Error saving query:', error);
  }
}