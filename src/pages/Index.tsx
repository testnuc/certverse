import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CertificateTable } from "@/components/CertificateTable";
import { Certificate, searchCertificates } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

type SearchFilter = "domain" | "organization" | "fingerprint" | "id" | "root";

const Index = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("domain");

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await searchCertificates(query, searchFilter);
      setCertificates(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          Created by{" "}
          <a 
            href="https://www.hackwithsingh.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors"
          >
            www.hackwithsingh.com
          </a>{" "}
          <Heart 
            className="w-4 h-4 text-[#ea384c] animate-pulse" 
            fill="#ea384c"
          />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Certificate Search</h1>
          <p className="text-gray-400">
            Fast and enhanced SSL/TLS certificate search. Search by domain name, organization,
            fingerprint or certificate ID.
          </p>
        </div>

        <div className="flex justify-center">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            filter={searchFilter}
            onFilterChange={setSearchFilter}
          />
        </div>

        {certificates.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificateTable certificates={certificates} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;