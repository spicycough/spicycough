import { NOW, column, defineDb, defineTable } from "astro:db"

import { nanoid } from "nanoid"

export const ContentItemKind = {
  ARTICLE: "article",
  REPORT: "report",
  STUDY: "study",
  THREAD: "thread",
} as const

export const ContentItem = defineTable({
  columns: {
    id: column.text({ name: "id", primaryKey: true }),
    kind: column.text({ name: "kind", default: ContentItemKind.ARTICLE }), // convert to enum?
    author: column.text({ name: "author", optional: true }),
    description: column.text({ name: "description", optional: true }),
    imageUrl: column.text({ name: "image_url", optional: true }),
    lang: column.text({ name: "lang", optional: true }),
    logo: column.text({ name: "logo", optional: true }),
    publisher: column.text({ name: "publisher", optional: true }),
    title: column.text({ name: "title", optional: true }),
    url: column.text({ name: "url", optional: true }),
    publishedDate: column.date({ name: "published_date" }),
    // Derived
    slug: column.text({ name: "slug" }),
    fullText: column.text({ name: "full_text", optional: true }),
    abstract: column.text({ name: "abstract", optional: true }),
    // ETL
    createdAt: column.date({ name: "created_at", default: NOW }),
    updatedAt: column.date({ name: "updated_at", default: NOW }),
  },
})

const ContentItemMetadata = defineTable({
  columns: {
    contentId: column.text({ name: "content_id", references: () => ContentItem.columns.id }),
    // author: column.text({ name: "author" }),
    // description: column.text({ name: "description" }),
    // institution: column.text({ name: "institutions" }),
    // newsKeywords: column.text({ name: "news_keywords" }),
    // searchType: column.text({ name: "search_type" }),
    // originalSource: column.text({ name: "original_source" }),
    // pubdate: column.date({ name: "pubdate" }),
    // OpenGraph
    ogDescription: column.text({ name: "og_description", label: "og:description", optional: true }),
    ogImage: column.text({ name: "og_image", label: "og:image", optional: true }),
    ogSiteName: column.text({ name: "og_site_name", label: "og:site_name", optional: true }),
    ogTitle: column.text({ name: "og_title", label: "og:title", optional: true }),
    ogType: column.text({ name: "type", label: "og:type", optional: true }),
    ogUpdatedTime: column.date({
      name: "og_updated_time",
      label: "og:updated_time",
      optional: true,
    }),
    ogUrl: column.text({ name: "og_url", label: "og:url", optional: true }),
    // Twitter
    twtCard: column.text({ name: "twitter_card", label: "twitter:card", optional: true }),
    twtCreator: column.text({ name: "twitter_creator", label: "twitter:creator", optional: true }),
    twtSite: column.text({ name: "twitter_site", label: "twitter:site", optional: true }),
    // Facebook
    fbAppId: column.text({ name: "facebook_app_id", label: "fb:app_id", optional: true }),
    fbPages: column.text({ name: "facebook_pages", label: "fb:pages", optional: true }),
    // Misc
    rest: column.json({ name: "rest", optional: true }),
  },
})

export const ContentItemSummary = defineTable({
  columns: {
    contentItemId: column.text({ name: "content_id", references: () => ContentItem.columns.id }),
    type: column.text({ name: "type", optional: true }),
    summary: column.text({ name: "summary" }),
    createdAt: column.date({ name: "created_at", default: NOW }),
    updatedAt: column.date({ name: "updated_at", default: NOW }),
  },
})

export default defineDb({
  tables: {
    ContentItem,
    ContentItemMetadata,
    ContentItemSummary,
  },
})