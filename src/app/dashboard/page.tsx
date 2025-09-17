"use client";

import { useSession } from "@/lib/auth-client";
import { TodoList } from "@/components/todo-list";
import { AnimatedStatsCard } from "@/components/animated-stats-card";
import { Zap, Plus, Target, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  productivityChange: number;
  tasksChange: number;
  thisWeekCompleted: number;
}

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    completionRate: 0,
    productivityChange: 0,
    tasksChange: 0,
    thisWeekCompleted: 0,
  });

  // Fetch real stats data
  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard stats received:", data);
        setStats(data);
      } else {
        console.error("Failed to fetch stats. Status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsStatsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  // Function to refresh stats - will be passed to TodoList (without loading animation)
  const refreshStats = async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        console.log("Stats refreshed:", data);
        setStats(data);
      } else {
        console.error("Failed to refresh stats. Status:", response.status);
        const errorText = await response.text();
        console.error("Refresh error response:", errorText);
      }
    } catch (error) {
      console.error("Error refreshing stats:", error);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 animate-in slide-in-from-top duration-700 delay-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Your intelligent workspace is ready for maximum productivity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatsCard
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle={stats.tasksChange >= 0 ? `+${stats.tasksChange} from yesterday` : `${stats.tasksChange} from yesterday`}
            icon={Target}
            colorScheme="blue"
            delay={0}
            isLoading={isStatsLoading}
          />

          <AnimatedStatsCard
            title="Completed"
            value={stats.completedTasks}
            subtitle={`${stats.completionRate}% completion rate`}
            icon={CheckCircle}
            colorScheme="green"
            delay={150}
            isLoading={isStatsLoading}
          />

          <AnimatedStatsCard
            title="In Progress"
            value={stats.activeTasks}
            subtitle={`${stats.thisWeekCompleted} completed this week`}
            icon={Clock}
            colorScheme="orange"
            delay={300}
            isLoading={isStatsLoading}
          />

          <AnimatedStatsCard
            title="Productivity"
            value={stats.productivityChange}
            subtitle={stats.productivityChange >= 0 ? "increase vs last week" : "vs last week"}
            icon={TrendingUp}
            colorScheme="purple"
            delay={450}
            isLoading={isStatsLoading}
            isPercentage
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Todo List - Takes up 2/3 of the space */}
          <div className="lg:col-span-2 animate-in slide-in-from-left duration-600 delay-500">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Your Tasks
                    </CardTitle>
                    <CardDescription>
                      AI-powered task management with intelligent categorization
                    </CardDescription>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 text-white shadow-lg transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TodoList onStatsChange={refreshStats} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Takes up 1/3 of the space */}
          <div className="space-y-6 animate-in slide-in-from-right duration-600 delay-700">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Streamline your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10 transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Task
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10 transition-all duration-300">
                  <Target className="h-4 w-4 mr-2" />
                  Set Daily Goals
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10 transition-all duration-300">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Peak Productivity Time
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    You&apos;re most productive between 9-11 AM
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                    Completion Streak
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    5 days in a row! Keep it up!
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Category Focus
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Work tasks need attention today
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Completed &quot;Review proposals&quot;</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Added &quot;Team meeting prep&quot;</p>
                    <p className="text-muted-foreground text-xs">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Updated &quot;Project timeline&quot;</p>
                    <p className="text-muted-foreground text-xs">Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}