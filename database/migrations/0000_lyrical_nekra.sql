CREATE TABLE `content_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_type` text NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`publication_date` text NOT NULL,
	`source_url` text NOT NULL,
	`abstract` text,
	`full_text` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
