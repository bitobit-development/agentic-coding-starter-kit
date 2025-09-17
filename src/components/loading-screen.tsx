"use client";

import { useState, useEffect } from "react";
import { Zap, Sparkles, Brain, Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingStage {
  progress: number;
  message: string;
  icon: React.ReactNode;
  duration: number;
}

interface LoadingScreenProps {
  userName?: string;
  onComplete?: () => void;
}

const loadingStages: LoadingStage[] = [
  {
    progress: 0,
    message: "Initializing TaskFlow AI...",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    duration: 800,
  },
  {
    progress: 25,
    message: "Loading your tasks...",
    icon: <Rocket className="h-5 w-5 text-green-500" />,
    duration: 1000,
  },
  {
    progress: 60,
    message: "AI analyzing patterns...",
    icon: <Brain className="h-5 w-5 text-purple-500" />,
    duration: 1200,
  },
  {
    progress: 85,
    message: "Optimizing your workflow...",
    icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
    duration: 800,
  },
  {
    progress: 100,
    message: "TaskFlow ready!",
    icon: <Zap className="h-5 w-5 text-green-500" />,
    duration: 500,
  },
];

export function LoadingScreen({ userName, onComplete }: LoadingScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const stage = loadingStages[currentStage];
    if (!stage) return;

    // Animate progress to current stage
    const progressTimer = setTimeout(() => {
      setProgress(stage.progress);
    }, 100);

    // Move to next stage after duration
    const stageTimer = setTimeout(() => {
      if (currentStage < loadingStages.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        setIsComplete(true);
        // Wait a bit before calling onComplete to show final state
        setTimeout(() => {
          onComplete?.();
        }, 800);
      }
    }, stage.duration);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(stageTimer);
    };
  }, [currentStage, onComplete]);

  const currentStageData = loadingStages[currentStage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-600 delay-200">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 ring-4 ring-primary/20 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {userName ? `Welcome back, ${userName}!` : "Welcome to TaskFlow AI"}
          </h1>

          <p className="text-muted-foreground">
            Preparing your intelligent workspace
          </p>
        </div>

        {/* Loading Content */}
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3 animate-in slide-in-from-left duration-500 delay-500">
            <Progress
              value={progress}
              className="h-3 bg-muted/50 border border-border/50 transition-all duration-300"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium transition-all duration-200">{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Current Stage */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 animate-in slide-in-from-right duration-500 delay-700 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/80 ring-2 ring-primary/20 transition-all duration-300">
                <div className="animate-in zoom-in duration-300">
                  {currentStageData?.icon}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground transition-all duration-300">
                  {currentStageData?.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 200}ms`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Please wait
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center gap-2">
            {loadingStages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStage
                    ? 'bg-primary shadow-sm shadow-primary/50'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Completion Animation */}
          {isComplete && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <Zap className="h-5 w-5" />
                <span className="font-medium">All set! Redirecting...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by AI • Intelligent automation • Effortless productivity
          </p>
        </div>
      </div>
    </div>
  );
}