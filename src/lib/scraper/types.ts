export type LinkType =
  | "link"
  | "video"
  | "audio"
  | "recipe"
  | "image"
  | "document"
  | "article"
  | "game"
  | "book"
  | "event"
  | "product"
  | "note"
  | "file"

export type TypeDictionary = Record<string, LinkType>
