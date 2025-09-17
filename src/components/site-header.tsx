import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { Zap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              TaskFlow AI
            </span>
          </Link>
        </h1>
        <div className="flex items-center gap-4">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
