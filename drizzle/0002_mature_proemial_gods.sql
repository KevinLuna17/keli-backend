CREATE TYPE "public"."workspace_member_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."workspace_type" AS ENUM('personal', 'shared');--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "workspace_member_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "type" "transaction_type" DEFAULT 'expense' NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "type" "workspace_type" DEFAULT 'personal' NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_members_workspace_user_idx" ON "workspace_members" USING btree ("workspace_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_workspace_name_type_idx" ON "categories" USING btree ("workspace_id","name","type") WHERE "categories"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_owner_personal_idx" ON "workspaces" USING btree ("owner_id") WHERE "workspaces"."type" = 'personal' AND "workspaces"."deleted_at" IS NULL;