"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Filter, Loader2 } from "lucide-react";

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

type TodoFormData = {
  title: string;
  description?: string;
};

type FilterType = "all" | "active" | "completed";

interface TodoListProps {
  onStatsChange?: () => void;
}

export function TodoList({ onStatsChange }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (data: TodoFormData) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos(prev => [newTodo, ...prev]);
        onStatsChange?.(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!editingTodo) return;

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        setEditingTodo(null);
        onStatsChange?.(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo))
        );
        onStatsChange?.(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        onStatsChange?.(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleCategorizeTodo = async (id: string) => {
    try {
      const response = await fetch("/api/todos/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todoId: id }),
      });

      if (response.ok) {
        const { todo: updatedTodo } = await response.json();
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo))
        );
        onStatsChange?.(); // Refresh dashboard stats
      }
    } catch (error) {
      console.error("Error categorizing todo:", error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);

    const matchesCategory =
      !selectedCategory || todo.category === selectedCategory;

    return matchesFilter && matchesCategory;
  });

  const categories = Array.from(new Set(todos.map(todo => todo.category).filter(Boolean)));
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TodoForm
        todo={editingTodo || undefined}
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        onCancel={editingTodo ? () => setEditingTodo(null) : undefined}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Todos
              </span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={`capitalize transition-all duration-300 ${
                    filter === filterType
                      ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10"
                  }`}
                >
                  {filterType === "active" && <Circle className="h-3 w-3 mr-1" />}
                  {filterType === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {filterType === "all" && <Filter className="h-3 w-3 mr-1" />}
                  {filterType}
                </Button>
              ))}
            </div>

            {categories.length > 0 && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={`transition-all duration-300 ${
                      selectedCategory === null
                        ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-lg"
                        : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10"
                    }`}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-md"
                          : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-blue-600/10 hover:to-purple-600/10"
                      }`}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filter === "completed"
                  ? "No completed todos yet"
                  : filter === "active"
                  ? "No active todos"
                  : "No todos yet. Add one above to get started!"}
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={setEditingTodo}
                  onCategorize={handleCategorizeTodo}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}