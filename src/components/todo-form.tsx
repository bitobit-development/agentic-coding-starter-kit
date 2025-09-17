"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit3 } from "lucide-react";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

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

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: TodoFormData) => Promise<void>;
  onCancel?: () => void;
}

export function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
    },
  });

  const handleFormSubmit = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      if (!todo) {
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {todo ? (
            <>
              <Edit3 className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Todo
              </span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Todo
              </span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Add more details..."
              disabled={isSubmitting}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 text-white shadow-lg transition-all duration-300"
            >
              {isSubmitting ? "Saving..." : todo ? "Update Todo" : "Add Todo"}
            </Button>
            {todo && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}