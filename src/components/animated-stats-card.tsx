"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNumberAnimation } from "@/hooks/use-number-animation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: "blue" | "green" | "orange" | "purple";
  delay?: number;
  isLoading?: boolean;
  isPercentage?: boolean;
}

const colorSchemes = {
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800",
    title: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-900 dark:text-blue-100",
    subtitle: "text-blue-600 dark:text-blue-400",
    hover: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
  },
  green: {
    card: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800",
    title: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
    value: "text-green-900 dark:text-green-100",
    subtitle: "text-green-600 dark:text-green-400",
    hover: "hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
  },
  orange: {
    card: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800",
    title: "text-orange-700 dark:text-orange-300",
    icon: "text-orange-600 dark:text-orange-400",
    value: "text-orange-900 dark:text-orange-100",
    subtitle: "text-orange-600 dark:text-orange-400",
    hover: "hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50"
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800",
    title: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400",
    value: "text-purple-900 dark:text-purple-100",
    subtitle: "text-purple-600 dark:text-purple-400",
    hover: "hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50"
  }
};

export function AnimatedStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  delay = 0,
  isLoading = false,
  isPercentage = false
}: AnimatedStatsCardProps) {
  const colors = colorSchemes[colorScheme];

  // Extract numeric value for animation
  const numericValue = typeof value === 'string' ?
    parseInt(value.replace(/[^0-9.-]/g, '')) || 0 :
    value;

  const { value: animatedValue } = useNumberAnimation({
    to: numericValue,
    duration: 1200,
    delay: delay + 300, // Add base delay for entrance animation
    formatter: (val) => {
      if (isPercentage) {
        return val >= 0 ? `+${val}%` : `${val}%`;
      }
      return val.toString();
    }
  });

  if (isLoading) {
    return (
      <Card className={cn(
        colors.card,
        "animate-in slide-in-from-bottom duration-600",
        "transform transition-all duration-300 ease-out"
      )}
      style={{ animationDelay: `${delay}ms` }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        colors.card,
        colors.hover,
        "animate-in slide-in-from-bottom duration-600",
        "transform transition-all duration-300 ease-out",
        "hover:scale-105 hover:shadow-lg",
        "motion-reduce:hover:scale-100 motion-reduce:animate-none motion-reduce:transition-none"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", colors.title)}>
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", colors.icon)} />
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold transition-all duration-300",
          colors.value
        )}>
          {animatedValue}
        </div>
        <p className={cn("text-xs", colors.subtitle)}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}