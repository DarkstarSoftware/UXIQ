'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExportButton({ disabled = false }: { disabled?: boolean }) {
  function handleExport() {
    window.print();
  }

  return (
    <Button type="button" onClick={handleExport} disabled={disabled}>
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}
