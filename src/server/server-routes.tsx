import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { Context } from "onefx/lib/types";
import * as React from "react";
import { AppContainer } from "@/shared/app-container";
import { apolloSSR } from "@/shared/common/apollo-ssr";
import { setApiGateway } from "../api-gateway/api-gateway";
import { MyServer } from "./start-server";

export function setServerRoutes(server: MyServer): void {
  // Health checks
  server.get("health", "/health", (ctx: Context) => {
    ctx.body = "OK";
  });

  setApiGateway(server);

  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: Context) => {
    ctx.setState("base.nonce", ctx.state.nonce);
    ctx.setState(
      "base.analytics.gaMeasurementId",
      server.config.analytics.gaMeasurementId
    );

    ctx.body = await apolloSSR(ctx, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js",
    });
  });
}
