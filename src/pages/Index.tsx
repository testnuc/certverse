import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CertificateTable } from "@/components/CertificateTable";
import { Certificate, searchCertificates } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await searchCertificates(query);
      setCertificates(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Certificate Transparency Search
          </h1>
          <p className="text-muted-foreground">
            Search SSL/TLS certificates across Certificate Transparency logs
          </p>
        </div>

        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
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