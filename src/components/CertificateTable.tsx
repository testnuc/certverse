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
            <TableHead>ID</TableHead>
            <TableHead>Common Name</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Name Value</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Serial Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell>{cert.id}</TableCell>
              <TableCell className="font-medium max-w-xs truncate" title={cert.common_name}>
                {cert.common_name}
              </TableCell>
              <TableCell className="max-w-xs truncate" title={cert.issuer_name}>
                {cert.issuer_name}
              </TableCell>
              <TableCell className="max-w-xs truncate" title={cert.name_value}>
                {cert.name_value}
              </TableCell>
              <TableCell>
                {format(new Date(cert.not_before), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(cert.not_after), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {cert.serial_number}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};