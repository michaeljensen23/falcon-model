import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { isFalconAdvisorEmail } from "@/lib/advisor-access";
import { SIGN_IN_PATH } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FalconLockup } from "@/components/brand/falcon-mark";

export function AdvisorSessionGate({
  children,
  ssrEmail,
}: {
  children: ReactNode;
  ssrEmail?: string | null;
}) {
  const { user, isPending } = useCurrentUserState();
  const ssrAllowed = isFalconAdvisorEmail(ssrEmail);
  const clientAllowed = Boolean(user?.isDevFallback) || isFalconAdvisorEmail(user?.primaryEmail);

  if (isPending) {
    return ssrAllowed ? <>{children}</> : <SessionSkeleton />;
  }
  if (clientAllowed) return <>{children}</>;
  if (user) return <Navigate to="/login" search={{ denied: true }} />;
  return <Navigate to={SIGN_IN_PATH} />;
}

export function SessionSkeleton() {
  return (
    <main className="flex min-h-dvh flex-col bg-navy text-card">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <FalconLockup />
          <h1 className="sr-only">Falcon advisors</h1>
          <p className="mt-6 text-sm text-card/75">
            Confirming advisor access for @falconwp.com.
          </p>
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-navy-lift" />
      </div>
    </main>
  );
}
