import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatUsd, MAX_CLIENT_NAME, parseMoney } from "@/lib/portfolio";

type Props = {
  clientName: string;
  accountValue: number | null;
  onClientName: (value: string) => void;
  onAccountValue: (value: number | null) => void;
};

export function AccountFields({
  clientName,
  accountValue,
  onClientName,
  onAccountValue,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const display =
    focused
      ? draft
      : accountValue === null
        ? ""
        : formatUsd(accountValue);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="client-name">Client</Label>
        <Input
          id="client-name"
          autoComplete="off"
          maxLength={MAX_CLIENT_NAME}
          placeholder="Household or account name"
          value={clientName}
          onChange={(e) => onClientName(e.target.value.slice(0, MAX_CLIENT_NAME))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="account-value">Account value</Label>
        <Input
          id="account-value"
          inputMode="decimal"
          autoComplete="off"
          placeholder="$1,000,000"
          value={display}
          onFocus={() => {
            setDraft(accountValue === null ? "" : String(accountValue));
            setFocused(true);
          }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            const parsed = parseMoney(draft);
            if (parsed !== null) onAccountValue(parsed);
            else if (!draft.trim()) onAccountValue(null);
            setFocused(false);
          }}
        />
      </div>
    </div>
  );
}
