import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todo } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, count, and, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";

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

    // Get current date boundaries
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // This week starts 7 days ago
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    // Last week starts 14 days ago
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    // Get total tasks count
    const [totalTasksResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(eq(todo.userId, user.id));

    // Get completed tasks count
    const [completedTasksResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(eq(todo.userId, user.id), eq(todo.completed, true)));

    // Get in progress (active) tasks count
    const [activeTasksResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(eq(todo.userId, user.id), eq(todo.completed, false)));

    // Get tasks created today
    const [todayTasksResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(eq(todo.userId, user.id), gte(todo.createdAt, today)));

    // Get tasks created yesterday
    const [yesterdayTasksResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(
        eq(todo.userId, user.id),
        gte(todo.createdAt, yesterday),
        lt(todo.createdAt, today)
      ));

    // Get tasks completed this week
    const [thisWeekCompletedResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(
        eq(todo.userId, user.id),
        eq(todo.completed, true),
        gte(todo.updatedAt, thisWeekStart)
      ));

    // Get tasks completed last week
    const [lastWeekCompletedResult] = await db
      .select({ count: count() })
      .from(todo)
      .where(and(
        eq(todo.userId, user.id),
        eq(todo.completed, true),
        gte(todo.updatedAt, lastWeekStart),
        lt(todo.updatedAt, thisWeekStart)
      ));

    // Calculate statistics
    const totalTasks = totalTasksResult.count;
    const completedTasks = completedTasksResult.count;
    const activeTasks = activeTasksResult.count;
    const todayTasks = todayTasksResult.count;
    const yesterdayTasks = yesterdayTasksResult.count;
    const thisWeekCompleted = thisWeekCompletedResult.count;
    const lastWeekCompleted = lastWeekCompletedResult.count;

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate productivity change (based on completed tasks this week vs last week)
    let productivityChange = 0;
    if (lastWeekCompleted > 0) {
      productivityChange = Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100);
    } else if (thisWeekCompleted > 0) {
      productivityChange = 100; // If no tasks last week but some this week, it's 100% improvement
    }

    // Calculate tasks change from yesterday
    const tasksChange = todayTasks - yesterdayTasks;

    const stats = {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      productivityChange,
      tasksChange,
      thisWeekCompleted,
    };

    // Debug logging
    console.log("Dashboard stats calculated:", {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      productivityChange,
      userId: user.id
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}