'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ModeToggle } from '@/components/ModeToggle'
import { AppLayout } from '@/components/app-layout'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const storedTodos = localStorage.getItem('nextjs_todo_list_items')
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos)
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos)
        }
      }
    } catch (error) {
      console.error('Failed to load todos:', error)
      localStorage.removeItem('nextjs_todo_list_items')
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('nextjs_todo_list_items', JSON.stringify(todos))
    }
  }, [todos, isClient])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <Link href="/generate">
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back
              </Button>
            </Link>
            {/* <ModeToggle /> */}
          </div>

          <div className="space-y-4 mb-12 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-zinc-100 dark:to-white">
              Todo List
            </h1>
            <p className="text-lg text-muted-foreground dark:text-zinc-300">
              Manage your tasks efficiently
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card">
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 bg-background"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Add Todo
              </Button>
            </form>

            <div className="space-y-3">
              {!isClient ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">No todos yet. Add one above!</p>
                </div>
              ) : (
                todos.map(todo => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                      todo.completed 
                        ? 'border-muted bg-muted/50' 
                        : 'border-border bg-background'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 rounded border-primary text-primary focus:ring-primary"
                    />
                    <span className={`flex-1 ${
                      todo.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {todo.text}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </AppLayout>
  )
}
