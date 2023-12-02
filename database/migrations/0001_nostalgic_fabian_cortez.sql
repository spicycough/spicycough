ALTER TABLE `content_items` RENAME COLUMN `publication_date` TO `published_at`;--> statement-breakpoint
ALTER TABLE content_items ADD `slug` text NOT NULL;