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

export const searchCertificates = async (query: string): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('search-certificates', {
      body: { query }
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