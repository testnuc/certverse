import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Certificate {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
}

type SearchFilter = "domain" | "organization" | "fingerprint" | "id" | "root";

export const searchCertificates = async (
  query: string, 
  filter: SearchFilter = "domain"
): Promise<Certificate[]> => {
  try {
    // Store the search query
    await supabase
      .from('domain_searches')
      .insert([{ domain: query }]);

    const { data, error } = await supabase.functions.invoke('search-certificates', {
      body: { query, filter }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    toast.error("Failed to fetch certificates");
    return [];
  }
};