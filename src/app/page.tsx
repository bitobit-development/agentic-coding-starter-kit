"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Sparkles, Brain, Target, Users, Star, Clock } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const [showLoading, setShowLoading] = useState(false);
  const [wasJustAuthenticated, setWasJustAuthenticated] = useState(false);

  // Check for auth in progress to clear old flags
  useEffect(() => {
    const checkAuthProgress = () => {
      const inProgress = localStorage.getItem('taskflow-auth-in-progress') === 'true';
      // Clean up stale flags after timeout
      if (inProgress) {
        setTimeout(() => {
          localStorage.removeItem('taskflow-auth-in-progress');
        }, 30000); // 30 second timeout
      }
    };

    checkAuthProgress();
    const interval = setInterval(checkAuthProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track when user just authenticated
  useEffect(() => {
    if (session && !isPending && !wasJustAuthenticated) {
      // Check if this is a fresh authentication (no previous session state)
      const isNewSession = !localStorage.getItem('todo-app-initialized');
      if (isNewSession) {
        setWasJustAuthenticated(true);
        setShowLoading(true);
        localStorage.setItem('todo-app-initialized', 'true');
        localStorage.removeItem('taskflow-auth-in-progress');
      }
    }
  }, [session, isPending, wasJustAuthenticated]);

  // If user is authenticated and no loading screen, redirect to dashboard
  useEffect(() => {
    if (session && !showLoading && !isPending) {
      window.location.href = '/dashboard';
    }
  }, [session, showLoading, isPending]);

  // Handle loading completion - redirect to dashboard
  const handleLoadingComplete = () => {
    setShowLoading(false);
    setWasJustAuthenticated(false);
    // Redirect to dashboard after loading completes
    window.location.href = '/dashboard';
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading screen for new authentication
  if (session && showLoading) {
    return (
      <LoadingScreen
        userName={session.user.name || undefined}
        onComplete={handleLoadingComplete}
      />
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <div className="flex items-center justify-center mb-8">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by AI
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 shadow-2xl">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow AI
                </h1>
              </div>

              <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Where Productivity Meets Intelligence
              </p>

              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your daily workflow with AI-powered task management. Experience effortless organization,
                intelligent categorization, and seamless productivity like never before.
              </p>

              {/* CTA */}
              <div className="space-y-6 mb-16">
                <SignInModal
                  title="Ready to Transform Your Productivity?"
                  description="Join thousands of users who've revolutionized their workflow with TaskFlow AI"
                >
                  <Button size="lg" className="text-lg px-12 py-6 h-auto bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300">
                    Start Your Journey
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </SignInModal>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Free Forever
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    2 Minute Setup
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    10,000+ Users
                  </span>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-in fade-in duration-700 delay-500">
              <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-600">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">AI Intelligence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced AI automatically categorizes and prioritizes your tasks for maximum efficiency
                </p>
              </div>

              <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-700">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Smart Automation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intelligent workflow automation that learns from your patterns and preferences
                </p>
              </div>

              <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-800">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mb-6">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Goal Achievement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Strategic insights and recommendations to help you achieve your goals faster
                </p>
              </div>

              <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-600 delay-900">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mb-6">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Blazing fast performance with intuitive design for seamless productivity
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mb-16 animate-in fade-in duration-600 delay-1000">
              <p className="text-muted-foreground mb-8">Trusted by productivity enthusiasts worldwide</p>
              <div className="flex items-center justify-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">10K+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">1M+ Tasks Completed</span>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-600/10 rounded-3xl p-12 border animate-in slide-in-from-bottom duration-700 delay-1100">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Revolutionize Your Productivity?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the TaskFlow AI revolution and experience the future of task management today.
              </p>
              <SignInModal
                title="Welcome to the Future of Productivity"
                description="Sign in and let AI transform how you manage your tasks forever"
              >
                <Button size="lg" className="text-lg px-12 py-6 h-auto bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300">
                  Get Started Free
                  <Zap className="ml-3 h-6 w-6" />
                </Button>
              </SignInModal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show minimal content while redirecting
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
