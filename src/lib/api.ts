import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveQuery } from "./database";

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
    // First save the search query
    await saveQuery(query);

    // Then perform the search via Edge Function
    const { data, error } = await supabase.functions.invoke('search-certificates', {
      body: { query, filter }
    });

    if (error) {
      console.error('Supabase function error:', error);
      toast.error("Failed to fetch certificates");
      return [];
    }

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    toast.error("Failed to fetch certificates. Please try again.");
    return [];
  }
};