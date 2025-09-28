CREATE TABLE `logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ts` text DEFAULT 'CURRENT_TIMESTAMP',
	`level` text,
	`trace_id` text,
	`request_id` text,
	`route` text,
	`user` text,
	`message` text,
	`error_stack` text,
	`meta` text
);
