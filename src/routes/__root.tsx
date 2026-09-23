import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Falcon Wealth";

function publicShareHost(): string {
  const raw = String(import.meta.env.VITE_PUBLIC_HOSTNAME ?? "").trim();
  const host = raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

const fetchAdvisorSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();
  } catch {
    return null;
  }
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
});

export const Route = createRootRoute({
  beforeLoad: async () => ({ advisorSession: await fetchAdvisorSession() }),
  head: () => {
    const host = publicShareHost();
    const ogImage = host ? `https://${host}/og.jpg` : "";
    const xBanner = host ? `https://${host}/x-banner.jpg` : "";
    return {
      meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Advisor core–satellite portfolio model. Select a Falcon Core mix from 100/0 to 0/100 in 5% steps, then optionally overlay a 10% or 20% satellite sleeve.",
      },
      { name: "theme-color", content: "#182e41" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
      ...(xBanner
        ? [
            { property: "x:game:image", content: xBanner },
            { property: "x:game:image:width", content: "1200" },
            { property: "x:game:image:height", content: "264" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap",
      },
    ],
  };
  },
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <Outlet />
            <Toaster
              theme="light"
              position="bottom-center"
              toastOptions={{
                className:
                  "bg-primary text-primary-foreground border-none font-sans text-sm",
              }}
            />
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
