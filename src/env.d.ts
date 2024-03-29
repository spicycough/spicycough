/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />
type Runtime = import("@astrojs/cloudflare").Runtime<Env>

declare module "file-extension" {
  const fileExtension: (value: string) => string
  export default fileExtension
}

declare module "top-user-agents"

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: {
      test: string
    }
  }
}
