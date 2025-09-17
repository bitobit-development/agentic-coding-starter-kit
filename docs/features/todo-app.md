# Todo App Features

This document describes the features and implementation of the AI-powered Todo App that has been built to replace the original boilerplate.

## Overview

The Todo App is a complete task management application with AI-powered categorization. It provides users with an intuitive interface to manage their tasks while automatically organizing them using artificial intelligence.

## Core Features

### 1. Authentication
- **Google OAuth Integration**: Users can sign in with their Google accounts
- **Session Management**: Secure session handling using Better Auth
- **Protected Routes**: All todo functionality requires authentication

### 2. Todo Management (CRUD Operations)
- **Create Todos**: Add new tasks with title and optional description
- **Read Todos**: View all todos with filtering and categorization
- **Update Todos**: Edit todo titles, descriptions, and completion status
- **Delete Todos**: Remove todos permanently

### 3. AI-Powered Categorization
- **Automatic Categorization**: New todos are automatically categorized using OpenAI
- **Manual Categorization**: Users can trigger re-categorization for existing todos
- **Smart Categories**: AI generates relevant single-word categories (work, personal, health, shopping, etc.)
- **Category Filtering**: Filter todos by category for better organization

### 4. User Interface
- **Modern Design**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Immediate feedback for all user actions
- **Filter Options**: Filter by completion status (all, active, completed) and category
- **Progress Tracking**: Visual indication of completion progress

## Technical Implementation

### Database Schema
```sql
-- Todo table structure
CREATE TABLE "todo" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "completed" boolean DEFAULT false NOT NULL,
  "category" text,
  "userId" text NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
);
```

### API Endpoints

#### GET /api/todos
- **Purpose**: Fetch all todos for the authenticated user
- **Authentication**: Required
- **Response**: Array of todo objects ordered by creation date

#### POST /api/todos
- **Purpose**: Create a new todo with automatic AI categorization
- **Authentication**: Required
- **Body**: `{ title: string, description?: string }`
- **Response**: Created todo object with AI-generated category

#### PUT /api/todos/[id]
- **Purpose**: Update an existing todo
- **Authentication**: Required (user can only update their own todos)
- **Body**: `{ title?: string, description?: string, completed?: boolean, category?: string }`
- **Response**: Updated todo object

#### DELETE /api/todos/[id]
- **Purpose**: Delete a todo
- **Authentication**: Required (user can only delete their own todos)
- **Response**: Success message

#### POST /api/todos/categorize
- **Purpose**: Manually trigger AI categorization for an existing todo
- **Authentication**: Required
- **Body**: `{ todoId: string }`
- **Response**: Updated todo with new category and confidence score

### Key Components

#### TodoList (`/src/components/todo-list.tsx`)
- Main container component managing todo state
- Handles API communication
- Provides filtering and categorization features
- Manages form state for adding/editing todos

#### TodoItem (`/src/components/todo-item.tsx`)
- Individual todo display component
- Handles completion toggling
- Provides edit, delete, and categorize actions
- Shows category badges and creation dates

#### TodoForm (`/src/components/todo-form.tsx`)
- Form component for adding and editing todos
- Uses react-hook-form with Zod validation
- Handles both create and update operations
- Provides proper error handling and loading states

### AI Categorization Service

#### categorizeTodo (`/src/lib/categorize.ts`)
- Utility function for AI-powered categorization
- Uses OpenAI with structured output (Zod schema)
- Generates single-word categories with confidence scores
- Fallback to "general" category on errors

#### Category Generation Prompt
The AI categorization uses a carefully crafted prompt to ensure consistent, useful categories:
- Analyzes both title and description
- Suggests common category types (work, personal, health, shopping, etc.)
- Returns confidence score for categorization quality

## Usage Instructions

### Getting Started
1. **Sign In**: Use the Google OAuth button to authenticate
2. **Add Your First Todo**: Use the form at the top to create a new task
3. **Watch AI Categorization**: New todos are automatically categorized
4. **Manage Tasks**: Use the interface to complete, edit, or delete todos
5. **Filter and Organize**: Use category and status filters to organize your view

### Features in Detail

#### Adding Todos
- Enter a descriptive title (required)
- Add optional description for more context
- AI will automatically categorize the todo upon creation

#### Managing Todos
- Check the checkbox to mark todos as completed
- Click the edit icon to modify title or description
- Click the sparkles icon to re-categorize with AI (if not already categorized)
- Click the trash icon to delete todos

#### Filtering and Organization
- Use status filters: All, Active, Completed
- Click category badges to filter by specific categories
- View completion progress in the header

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for AI categorization
- `OPENAI_MODEL`: Model to use (defaults to "gpt-5-mini")
- `POSTGRES_URL`: Database connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials

### Model Configuration
The app uses the `OPENAI_MODEL` environment variable consistently across all AI features, making it easy to switch models without code changes.

## Performance Considerations

- **Optimistic Updates**: UI updates immediately before API confirmation
- **Error Handling**: Graceful degradation when AI services are unavailable
- **Database Indexing**: Proper indexing on userId and createdAt for performance
- **Category Caching**: Categories are persisted to avoid repeated AI calls

## Future Enhancements

Potential improvements for the todo app:
- **Due Dates**: Add deadline management
- **Priority Levels**: High/Medium/Low priority classification
- **Subtasks**: Nested todo items
- **Tags**: Multiple tags per todo
- **Sharing**: Collaborative todo lists
- **Reminders**: Email or push notifications
- **Analytics**: Usage statistics and productivity insights

## Security

- **Authentication Required**: All todo operations require valid session
- **User Isolation**: Users can only access their own todos
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Prevention**: Using Drizzle ORM with parameterized queries
- **XSS Protection**: React's built-in XSS protection for user content