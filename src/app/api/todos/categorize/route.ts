import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todo } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session.user;
}

const categorizeSchema = z.object({
  category: z.string().describe("A single word category for the todo item"),
  confidence: z.number().min(0).max(1).describe("Confidence score for the categorization"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { todoId } = body;

    if (!todoId) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    // Find the todo
    const [foundTodo] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, todoId), eq(todo.userId, user.id)));

    if (!foundTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Generate category using AI
    const result = await generateObject({
      model: openai(process.env.OPENAI_MODEL || "gpt-5-mini"),
      prompt: `Categorize this todo item into a single word category that best describes its type or domain.

      Todo: "${foundTodo.title}"
      ${foundTodo.description ? `Description: "${foundTodo.description}"` : ""}

      Common categories include: work, personal, health, shopping, learning, finance, travel, home, social, etc.
      Choose the most appropriate single word category.`,
      schema: categorizeSchema,
    });

    // Update the todo with the generated category
    const [updatedTodo] = await db
      .update(todo)
      .set({
        category: result.object.category,
        updatedAt: new Date(),
      })
      .where(and(eq(todo.id, todoId), eq(todo.userId, user.id)))
      .returning();

    return NextResponse.json({
      todo: updatedTodo,
      category: result.object.category,
      confidence: result.object.confidence,
    });
  } catch (error) {
    console.error("Error categorizing todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}