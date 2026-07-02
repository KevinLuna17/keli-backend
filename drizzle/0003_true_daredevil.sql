ALTER TABLE "categories" ADD COLUMN "icon_key" text DEFAULT 'folder' NOT NULL;--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'food' WHERE "name" = 'Food' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'transport' WHERE "name" = 'Transport' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'housing' WHERE "name" = 'Housing' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'utilities' WHERE "name" = 'Utilities' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'healthcare' WHERE "name" = 'Healthcare' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'shopping' WHERE "name" = 'Shopping' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'entertainment' WHERE "name" = 'Entertainment' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'education' WHERE "name" = 'Education' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'travel' WHERE "name" = 'Travel' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'subscriptions' WHERE "name" = 'Subscriptions' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'other' WHERE "name" = 'Other' AND "type" = 'expense';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'salary' WHERE "name" = 'Salary' AND "type" = 'income';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'freelance' WHERE "name" = 'Freelance' AND "type" = 'income';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'bonus' WHERE "name" = 'Bonus' AND "type" = 'income';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'investment' WHERE "name" = 'Investment' AND "type" = 'income';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'gift' WHERE "name" = 'Gift' AND "type" = 'income';--> statement-breakpoint
UPDATE "categories" SET "icon_key" = 'other' WHERE "name" = 'Other' AND "type" = 'income';
