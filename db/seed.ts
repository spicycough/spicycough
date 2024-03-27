import { db, ContentItem } from "astro:db"
import { nanoid } from "nanoid"

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(ContentItem).values({
    id: nanoid(),
    kind: "article",
    url: "https://www.nature.com/articles/s41591-022-02001-z",
    title: "Long-term neurologic outcomes of COVID-19",
    author: "Ziyad Al-Aly",
    slug: "long-term-neurologic-outcomes-of-covid-19",
    publishedDate: new Date("2022-03-01"),
  })
}
