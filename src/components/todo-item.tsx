"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit3, Sparkles } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  category: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onCategorize: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onCategorize }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(todo.id, !todo.completed);
    setIsToggling(false);
  };

  return (
    <Card className={`w-full ${todo.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggle}
            disabled={isToggling}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm mt-1 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {todo.category && (
                    <Badge variant="secondary" className="text-xs">
                      {todo.category}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10 transition-all duration-300"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>

                {!todo.category && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategorize(todo.id)}
                    className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10 transition-all duration-300"
                    title="Categorize with AI"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}