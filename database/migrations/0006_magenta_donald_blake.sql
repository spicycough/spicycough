ALTER TABLE `content_items` RENAME COLUMN `content_kind` TO `kind`;--> statement-breakpoint
ALTER TABLE content_item_summaries ADD `kind` text NOT NULL;--> statement-breakpoint
ALTER TABLE `content_item_summaries` DROP COLUMN `mini`;--> statement-breakpoint
ALTER TABLE `content_item_summaries` DROP COLUMN `short`;--> statement-breakpoint
ALTER TABLE `content_item_summaries` DROP COLUMN `long`;--> statement-breakpoint
ALTER TABLE `content_item_summaries` DROP COLUMN `paragraph`;