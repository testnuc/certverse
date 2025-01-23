import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Certificate } from "@/lib/api";
import { format } from "date-fns";

interface CertificateTableProps {
  certificates: Certificate[];
}

export const CertificateTable = ({ certificates }: CertificateTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Common Name</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid Until</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">{cert.common_name}</TableCell>
              <TableCell>{cert.issuer_name}</TableCell>
              <TableCell>
                {format(new Date(cert.not_before), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(cert.not_after), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};