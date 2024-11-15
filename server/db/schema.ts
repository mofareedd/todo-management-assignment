import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `todo_${name}`);

export const tasksTable = createTable("task", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 256 }),
  completed: boolean().default(false),
  order: integer("order").default(0),
  createdById: varchar("created_by")
    .references(() => usersTable.id)
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [tasksTable.createdById],
    references: [usersTable.id],
  }),
  assigned: many(taskAssignments),
}));

export const usersTable = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(tasksTable, ({ many }) => ({
  tasks: many(taskAssignments),
}));

export const taskAssignments = createTable(
  "task_assignments",
  {
    task_id: varchar("task_id").references(() => tasksTable.id),
    user_id: varchar("user_id").references(() => usersTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.task_id, t.user_id] }),
  })
);

export const tasksOnUsersRelations = relations(taskAssignments, ({ one }) => ({
  task: one(tasksTable, {
    fields: [taskAssignments.task_id],
    references: [tasksTable.id],
  }),
  user: one(usersTable, {
    fields: [taskAssignments.user_id],
    references: [usersTable.id],
  }),
}));

export type UserType = InferSelectModel<typeof usersTable>;
export type TaskType = InferSelectModel<typeof tasksTable>;
export type TaskWithAssignmentType = InferSelectModel<typeof taskAssignments>;
export type TaskWithUser = InferSelectModel<typeof tasksTable> & {
  assigned?: {
    task_id: string;
    user: UserType;
    user_id: string;
  }[];
};
