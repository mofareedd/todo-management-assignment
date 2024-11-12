ALTER TABLE "todo_task" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "id" DROP IDENTITY;