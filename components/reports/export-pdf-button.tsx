import Link from 'next/link';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ExportPdfButton({ reportId }: { reportId: string }) {
  return (
    <Link href={`/api/reports/${reportId}/pdf`}>
      <Button variant="secondary">
        <Download className="h-4 w-4" /> Export PDF
      </Button>
    </Link>
  );
}
