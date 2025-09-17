"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SignInModalProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function SignInModal({
  children,
  title = "Welcome to TaskFlow AI",
  description = "Sign in to experience intelligent task management"
}: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    // Prevent multiple attempts
    if (isLoading || hasAttempted) return;

    setIsLoading(true);
    setIsAuthenticating(true);
    setError(null);
    setHasAttempted(true);

    try {
      // Clear the initialization flag to ensure loading screen shows
      localStorage.removeItem('todo-app-initialized');

      // Set a flag to prevent multiple attempts across browser tabs
      localStorage.setItem('taskflow-auth-in-progress', 'true');

      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            localStorage.removeItem('taskflow-auth-in-progress');
            // Don't close modal immediately - let the page navigation handle it
            // setOpen(false);
          },
          onError: (context) => {
            console.error("Sign in failed:", context.error);
            setError("Sign in failed. Please try again.");
            localStorage.removeItem('taskflow-auth-in-progress');
            setHasAttempted(false);
            setIsAuthenticating(false);
          },
        },
      });

      if (result?.error) {
        setError("Sign in failed. Please try again.");
        localStorage.removeItem('taskflow-auth-in-progress');
        setHasAttempted(false);
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setError("Sign in failed. Please try again.");
      localStorage.removeItem('taskflow-auth-in-progress');
      setHasAttempted(false);
      setIsAuthenticating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Prevent closing if currently authenticating
        if (!newOpen && isAuthenticating) {
          return;
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 border-0 bg-transparent shadow-none">
        <div className="bg-muted/80 backdrop-blur-sm rounded-lg p-6">
          <div className="flex flex-col gap-6">
            {/* Branding */}
            <div className="flex items-center justify-center gap-3 font-medium">
              <div className="bg-gradient-to-br from-primary via-blue-500 to-purple-600 text-white flex size-9 items-center justify-center rounded-xl shadow-lg">
                <Zap className="size-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow AI
              </span>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive text-center">{error}</p>
                    </div>
                  )}

                  {/* Google Sign In Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || hasAttempted}
                    className="w-full h-12 text-sm font-medium bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <svg
                        className="size-5 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {isLoading
                      ? "Signing in..."
                      : hasAttempted
                        ? "Processing..."
                        : "Continue with Google"
                    }
                  </Button>

                  {/* Alternative Sign-in Options (for future) */}
                  <div className="relative text-center text-xs">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted-foreground/20" />
                    </div>
                    <div className="relative flex justify-center text-muted-foreground">
                      <span className="bg-card px-2">
                        Quick & secure authentication
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2">
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Zap className="size-3 text-blue-500" />
                        AI Intelligence
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="size-3 text-purple-500" />
                        Smart Workflow
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <div className="text-muted-foreground text-center text-xs text-balance">
              By signing in, you agree to our{" "}
              <button className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </button>
              .
            </div>
          </div>
        </div>

        {/* Hidden for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to TaskFlow AI</DialogTitle>
          <DialogDescription>
            Sign in to access intelligent task management with AI-powered features
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}