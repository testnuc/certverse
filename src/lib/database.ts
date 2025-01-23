import { supabase } from "@/integrations/supabase/client";

export interface QueryLog {
  timestamp: number;
  query: string;
  type: string;
}

export async function saveQuery(query: string, type: string): Promise<void> {
  try {
    await supabase
      .from('domain_searches')
      .insert([{ domain: query }]);
  } catch (error) {
    console.error('Error saving query:', error);
  }
}