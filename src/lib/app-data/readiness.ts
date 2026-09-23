import { createServerFn } from "@tanstack/react-start";

export type ConnectorReadiness = { ready: boolean };

export const getConnectorReadiness = createServerFn({ method: "POST" }).handler(
  async (): Promise<ConnectorReadiness> => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();
    const { isConnectorTokenReady } = await import("./client.server.ts");
    return { ready: isConnectorTokenReady() };
  },
);
