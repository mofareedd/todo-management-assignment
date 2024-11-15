CREATE TABLE IF NOT EXISTS "todo_task_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" integer,
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "todo_user" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "todo_user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo_task_assignments" ADD CONSTRAINT "todo_task_assignments_task_id_todo_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."todo_task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo_task_assignments" ADD CONSTRAINT "todo_task_assignments_user_id_todo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."todo_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
