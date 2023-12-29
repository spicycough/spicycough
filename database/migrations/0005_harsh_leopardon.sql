CREATE TABLE `content_item_publishers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`publisher` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_item_summaries` (
	`content_item_id` integer PRIMARY KEY NOT NULL,
	`mini` text NOT NULL,
	`short` text NOT NULL,
	`long` text NOT NULL,
	`paragraph` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `content_item_queue`;--> statement-breakpoint
DROP TABLE `content_item_staging`;--> statement-breakpoint
ALTER TABLE `content_items` RENAME COLUMN `source_url` TO `permalink`;--> statement-breakpoint
ALTER TABLE content_items ADD `image_url` text;