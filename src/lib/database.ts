import { supabase } from "@/integrations/supabase/client";

export interface QueryLog {
  timestamp: number;
  query: string;
  type: string;
}

const fallbackLogs: QueryLog[] = [];

export async function saveQuery(query: string, type: string): Promise<void> {
  const log: QueryLog = {
    timestamp: Date.now(),
    query,
    type,
  };

  try {
    await supabase
      .from('domain_searches')
      .insert([{ domain: query }]);
  } catch (error) {
    console.error('Error saving query:', error);
    fallbackLogs.push(log);
    if (fallbackLogs.length > 10000) {
      fallbackLogs = fallbackLogs.slice(-10000);
    }
  }
}