import fileExtension from "file-extension"
import { types } from "./constants"
import type { LinkType } from "./types"

export const typeChecker = (path: string): LinkType | undefined => {
  try {
    const url = new URL(path)
    const hostname = url.hostname.replace("www.", "")
    return types[hostname]
  } catch (err) {
    // swallow the error, no need to do anything
  }

  const extension = fileExtension(path)
  if (extension) {
    return types[extension]
  }

  return undefined
}

export const linkType = (link: string, isReaderable?: boolean): LinkType => {
  const urlIsKnownFileType = typeChecker(link)
  if (urlIsKnownFileType) {
    return urlIsKnownFileType
  }

  if (isReaderable) {
    return "article"
  }

  return "link"
}
