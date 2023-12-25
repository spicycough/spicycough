CREATE TABLE `content_item_queue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `content_item_staging` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_kind` text NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`source_url` text NOT NULL,
	`abstract` text,
	`full_text` text,
	`slug` text NOT NULL,
	`published_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
