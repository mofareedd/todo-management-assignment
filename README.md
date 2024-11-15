# Todo Management App

## Live Demo

You can view the live version of the Todo Management App [here](https://todo.mofareed.com).

## Overview

This Todo Management app is designed to allow users to create, update, and delete tasks with ease. It provides features for task management such as:
- Authentication
- Creating new tasks
- Marking tasks as completed
- Deleting tasks
- Task management with a user-friendly interface

## Technologies Used
- Next.js
- TypeScript
- NextAuth ( Authehntication library )
- Shadcn ( UI library )
- Playwright for testing ( E2E Testing)
- Drizzle (SQL Database ORM)
- Docker (Deployment)
- Fly.io (Self-hosting)

## Running the Application
### Clone the Repository
First, clone the repository to your local machine:
```bash
git clone https://github.com/mofareedd/todo-management-assignment.git todo-management-app
cd todo-management-app
```

### Option 1: Using `pnpm`
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the application:
   ```bash
   pnpm dev
   ```
### Option 2: Using `Docker Compose`
1. Build and start the application containers:
   ```bash
   docker-compose up --build
   ```
2. Access the application at http://localhost:3000.
