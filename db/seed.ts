import { db, ContentItem } from "astro:db"

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(ContentItem).values({
    kind: "article",
    permalink: "https://www.nature.com/articles/s41591-022-02001-z",
    title: "Long-term neurologic outcomes of COVID-19",
    author: "Ziyad Al-Aly",
    slug: "long-term-neurologic-outcomes-of-covid-19",
    publishedDate: new Date("2022-03-01"),
  })
}
