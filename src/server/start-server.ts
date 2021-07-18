import config from "config";
import { Config, Server } from "onefx/lib/server";
import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

export type MyServer = Server & {
  config: Config;
  resolvers: NonEmptyArray<Function>;
};

export async function startServer(): Promise<Server> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const server: MyServer = new Server(config as any as Config) as MyServer;
  server.app.proxy = Boolean(config.get("server.proxy"));
  setMiddleware(server);
  setServerRoutes(server);

  const port = Number(process.env.PORT || config.get("server.port"));
  server.listen(port);
  return server;
}
