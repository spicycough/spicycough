/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

declare module "file-extension" {
  const fileExtension: (value: string) => string
  export default fileExtension
}

declare module "top-user-agents"
