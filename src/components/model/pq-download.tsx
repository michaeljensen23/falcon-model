import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildDiscoveryPdf } from "@/lib/discovery-pdf";
import { discoveryFileStem } from "@/lib/discovery-pq";
import { downloadBytes } from "@/lib/proposal-export";

export function PqDownloadButton({
  clientName = "",
  advisorName = "",
  accountValue = null,
}: {
  clientName?: string;
  advisorName?: string;
  accountValue?: number | null;
}) {
  const [building, setBuilding] = useState(false);

  async function download() {
    if (building) return;
    setBuilding(true);
    try {
      const bytes = await buildDiscoveryPdf({ clientName, advisorName, accountValue });
      downloadBytes(`${discoveryFileStem(clientName)}.pdf`, bytes, "application/pdf");
      toast("PQ downloaded");
    } catch {
      toast("Could not build the discovery PDF.");
    } finally {
      setBuilding(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void download()}
      disabled={building}
      title="Download the 14-section discovery facts questionnaire"
      aria-label="PQ Download"
    >
      <ClipboardList />
      {building ? "Building…" : "PQ Download"}
    </Button>
  );
}
