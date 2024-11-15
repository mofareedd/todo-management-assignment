CREATE TABLE IF NOT EXISTS "todo_task_assignments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"task_id" varchar,
	"user_id" varchar
);
--> statement-breakpoint
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
