import { useEffect, useRef, useState } from "react";
import { Download, Mail, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  classifyCallToolError,
  isSafeLoginUrl,
  redirectToLoginIfRequired,
} from "@/lib/app-data";
import { sendProposalEmail } from "@/lib/proposal-email";
import {
  buildProposalEml,
  downloadBytes,
  downloadTextFile,
  isEmailAddress,
  proposalCsv,
  proposalEmailBody,
  proposalFileStem,
} from "@/lib/proposal-export";
import { buildProposalPdf } from "@/lib/proposal-pdf";
import { buildAllocation, type ModelInput } from "@/lib/portfolio";

type Mode = "export" | "email";

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  input: ModelInput;
  advisorName: string;
  allowPrint?: boolean;
};

export function ShareDialog({ open, mode, onClose, input, advisorName, allowPrint }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const buildingRef = useRef(false);
  const [to, setTo] = useState("");
  const [building, setBuilding] = useState(false);
  onCloseRef.current = onClose;
  buildingRef.current = building;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const last = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const id = window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !buildingRef.current) onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      last?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const allocation = buildAllocation(input);
  const csv = proposalCsv(input, allocation);
  const stem = proposalFileStem(input.clientName, allocation.policyCode);
  const client = input.clientName.trim() || "the household";
  const pdfName = `${stem}.pdf`;
  const csvName = `${stem}.csv`;
  const mailOk = isEmailAddress(to);

  function downloadCsv() {
    downloadTextFile(csvName, csv, "text/csv");
    toast("Holdings CSV downloaded");
  }

  async function downloadPdf() {
    if (building) return;
    setBuilding(true);
    try {
      const bytes = buildProposalPdf(input, allocation, advisorName);
      downloadBytes(pdfName, bytes, "application/pdf");
      toast("Proposal PDF downloaded");
    } catch {
      toast("Could not build the PDF.");
    } finally {
      setBuilding(false);
    }
  }

  function attachLocally(pdfBytes: Uint8Array) {
    const eml = buildProposalEml({
      to: to.trim(),
      clientName: client,
      pdfName,
      csvName,
      pdfBytes,
      csvText: csv,
    });
    downloadTextFile(`${stem}.eml`, eml, "message/rfc822");
  }

  async function sendEmail() {
    if (!mailOk || building) return;
    setBuilding(true);
    try {
      const result = await sendProposalEmail({
        data: {
          to: to.trim(),
          input,
        },
      });
      if (result.ok) {
        toast("Email sent with the PDF and CSV attached");
        onClose();
        return;
      }
      if (result.loginRequired && isSafeLoginUrl(result.loginUrl)) {
        redirectToLoginIfRequired({
          ok: false,
          data: null,
          loginRequired: true,
          loginUrl: result.loginUrl,
        });
      }
      attachLocally(buildProposalPdf(input, allocation, advisorName));
      const classified = classifyCallToolError({
        ok: false,
        data: null,
        loginRequired: result.loginRequired,
        pending: result.pending,
        errorMessage: result.errorMessage,
      });
      toast(
        classified?.kind === "login" || classified?.kind === "pending"
          ? "Connect Gmail to send from this app. A message with both attachments was downloaded."
          : "A message with the PDF and CSV attached was downloaded — open it to send.",
      );
    } catch (err) {
      try {
        attachLocally(buildProposalPdf(input, allocation, advisorName));
      } catch {
        /* pdf build failed */
      }
      toast(err instanceof Error ? err.message : "Could not email the proposal.");
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div
      className="no-print fixed inset-0 z-[70] overflow-y-auto bg-foreground/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      onClick={building ? undefined : onClose}
    >
      <div
        className="mx-auto flex min-h-dvh max-w-lg items-start px-4 py-10 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full rounded-xl bg-card p-5 shadow-float sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {mode === "email" ? "Email proposal" : "Export proposal"}
              </p>
              <h2 id="share-title" className="font-display text-2xl font-medium tracking-tight">
                {client}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{allocation.policyTitle}</p>
            </div>
            <Button ref={closeRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X />
            </Button>
          </div>

          {mode === "email" ? (
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="proposal-to">Send to</Label>
                <Input
                  id="proposal-to"
                  type="email"
                  autoComplete="off"
                  placeholder="client@email.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <p className="whitespace-pre-wrap rounded-lg bg-secondary px-3 py-2.5 text-sm text-foreground">
                {proposalEmailBody()}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The email attaches both the proposal PDF and the holdings CSV.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Download a print-ready Letter PDF, or the look-through holdings as CSV.
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2">
            {mode === "email" ? (
              <Button type="button" disabled={!mailOk || building} onClick={() => void sendEmail()}>
                <Mail />
                {building ? "Sending…" : "Send email"}
              </Button>
            ) : null}
            <Button
              variant={mode === "email" ? "secondary" : "default"}
              disabled={building}
              onClick={() => void downloadPdf()}
            >
              <Download />
              {building && mode !== "email" ? "Building PDF…" : "Download proposal"}
            </Button>
            <Button variant="secondary" onClick={downloadCsv}>
              <Download />
              Download holdings CSV
            </Button>
            {allowPrint ? (
              <Button
                variant="ghost"
                className="no-print"
                onClick={() => {
                  onClose();
                  window.requestAnimationFrame(() => window.print());
                }}
              >
                <Printer />
                Print
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
