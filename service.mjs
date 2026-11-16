import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";

export default compute({
  name: "web",
  deps: {},
  build: node({
    module: import.meta.url,
    dir: "build",
    entry: "server.mjs",
    dependencies: "external",
  }),
});
