ALTER TABLE "todo_task_assignments" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "todo_task_assignments" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todo_task_assignments" ALTER COLUMN "task_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "todo_task_assignments" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "created_by" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "todo_user" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "todo_user" ALTER COLUMN "id" DROP DEFAULT;