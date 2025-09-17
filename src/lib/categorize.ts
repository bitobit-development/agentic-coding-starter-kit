import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const categorizeSchema = z.object({
  category: z.string().describe("A single word category for the todo item"),
  confidence: z.number().min(0).max(1).describe("Confidence score for the categorization"),
});

export async function categorizeTodo(title: string, description?: string | null): Promise<string> {
  try {
    const result = await generateObject({
      model: openai(process.env.OPENAI_MODEL || "gpt-5-mini"),
      prompt: `Categorize this todo item into a single word category that best describes its type or domain.

      Todo: "${title}"
      ${description ? `Description: "${description}"` : ""}

      Common categories include: work, personal, health, shopping, learning, finance, travel, home, social, etc.
      Choose the most appropriate single word category.`,
      schema: categorizeSchema,
    });

    return result.object.category;
  } catch (error) {
    console.error("Error categorizing todo:", error);
    return "general";
  }
}