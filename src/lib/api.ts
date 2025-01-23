import { toast } from "sonner";

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
    const response = await fetch(
      `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch certificates");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    toast.error("Failed to fetch certificates");
    return [];
  }
};