import { defineDb, defineTable, column, NOW } from "astro:db"
import { nanoid } from "nanoid"

export const ContentItemKind = {
  ARTICLE: "article",
  REPORT: "report",
  STUDY: "study",
  THREAD: "thread",
} as const

const ContentItem = defineTable({
  columns: {
    id: column.text({ name: "id", primaryKey: true, default: nanoid(), unique: true }),
    kind: column.text({ name: "kind", default: ContentItemKind.ARTICLE }), // convert to enum?
    permalink: column.text({ name: "permalink" }),
    title: column.text({ name: "title" }),
    authors: column.json({ name: "authors", optional: true }),
    imageUrl: column.text({ name: "image_url", optional: true }),
    abstract: column.text({ name: "abstract", optional: true }),
    fullText: column.text({ name: "full_text", optional: true }),
    slug: column.text({ name: "slug" }),
    publishedAt: column.date({ name: "published_at" }),
    createdAt: column.date({ name: "created_at", default: NOW }),
    updatedAt: column.date({ name: "updated_at", default: NOW }),
  },
})

export const ContentItemMetadata = defineTable({
  columns: {
    contentId: column.text({ name: "content_id", references: () => ContentItem.columns.id }),
    author: column.text({ name: "author" }),
    description: column.text({ name: "description" }),
    institution: column.text({ name: "institutions" }),
    newsKeywords: column.text({ name: "news_keywords" }),
    searchType: column.text({ name: "search_type" }),
    originalSource: column.text({ name: "original_source" }),
    pubdate: column.date({ name: "pubdate" }),
    // OpenGraph
    ogDescription: column.text({ name: "og_description", label: "og:description" }),
    ogImage: column.text({ name: "og_image", label: "og:image" }),
    ogSiteName: column.text({ name: "og_site_name", label: "og:site_name" }),
    ogTitle: column.text({ name: "og_title", label: "og:title" }),
    ogType: column.text({ name: "type", label: "og:type" }),
    ogUpdatedTime: column.date({ name: "og_updated_time", label: "og:updated_time" }),
    ogUrl: column.text({ name: "og_url", label: "og:url" }),
    // Twitter
    twtCard: column.text({ name: "twitter_card", label: "twitter:card" }),
    twtCreator: column.text({ name: "twitter_creator", label: "twitter:creator" }),
    twtSite: column.text({ name: "twitter_site", label: "twitter:site" }),
    // Facebook
    fbAppId: column.text({ name: "facebook_app_id", label: "fb:app_id" }),
    fbPages: column.text({ name: "facebook_pages", label: "fb:pages" }),
    // Misc
    rest: column.json({ name: "rest", optional: true }),
  },
})

export default defineDb({
  tables: {
    ContentItem,
    ContentItemMetadata,
  },
})
