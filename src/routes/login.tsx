import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FalconLockup } from "@/components/brand/falcon-mark";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { SessionSkeleton } from "@/components/auth/advisor-gate";
import { advisorEmailHint, isFalconAdvisorEmail } from "@/lib/advisor-access";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

type LoginSearch = { denied?: boolean };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    if (search.denied === "1" || search.denied === true) return { denied: true };
    return {};
  },
  component: Login,
});

function Login() {
  const { denied } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();

  if (isPending) return <SessionSkeleton />;
  if (user?.isDevFallback || (user && isFalconAdvisorEmail(user.primaryEmail))) {
    return <Navigate to="/" />;
  }

  const wrongAccount = Boolean(user) && !isFalconAdvisorEmail(user?.primaryEmail);
  const showDenied = denied || wrongAccount;

  return (
    <DeniedScreen showDenied={showDenied} wrongAccount={wrongAccount} />
  );
}

function DeniedScreen({
  showDenied,
  wrongAccount,
}: {
  showDenied: boolean;
  wrongAccount: boolean;
}) {
  useEffect(() => {
    if (!wrongAccount) return;
    void signOut("/login?denied=1").catch(() => {
      /* stay on the denied screen so they can retry */
    });
  }, [wrongAccount]);

  return (
    <main className="flex min-h-dvh flex-col bg-navy text-card">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <FalconLockup />
          <h1 className="sr-only">Falcon advisors</h1>
          <p className="mt-6 text-sm text-card/75">
            The portfolio model is limited to Google accounts on{" "}
            <span className="font-medium text-card">{advisorEmailHint()}</span>.
          </p>
        </div>

        <div className="rounded-xl bg-card p-6 text-card-foreground shadow-card">
          {showDenied ? (
            <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              That Google account is not on the Falcon allowlist. Use your{" "}
              {advisorEmailHint()} Workspace login.
            </p>
          ) : null}

          {authEnabled ? (
            <GoogleSignInButton callbackURL="/" />
          ) : (
            <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Personal Gmail, X, and other domains cannot open this model. After
            Google confirms the account, only {advisorEmailHint()} mailboxes are
            admitted.
          </p>
        </div>
      </div>
    </main>
  );
}
