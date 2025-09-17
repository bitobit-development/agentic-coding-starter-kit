import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todo } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { categorizeTodo } from "@/lib/categorize";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session.user;
}

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todos = await db
      .select()
      .from(todo)
      .where(eq(todo.userId, user.id))
      .orderBy(desc(todo.createdAt));

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Generate category using AI
    const category = await categorizeTodo(title, description);

    const newTodo = {
      id: nanoid(),
      title,
      description: description || null,
      completed: false,
      category,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdTodo] = await db.insert(todo).values(newTodo).returning();

    return NextResponse.json(createdTodo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}