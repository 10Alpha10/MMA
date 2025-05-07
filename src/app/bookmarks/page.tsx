'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/app-layout'

interface Bookmark {
  id: number
  title: string
  url: string
  category: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const storedBookmarks = localStorage.getItem('nextjs_bookmarks')
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks)
        if (Array.isArray(parsedBookmarks)) {
          setBookmarks(parsedBookmarks)
        }
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
      localStorage.removeItem('nextjs_bookmarks')
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('nextjs_bookmarks', JSON.stringify(bookmarks))
    }
  }, [bookmarks, isClient])

  const addBookmark = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim() && newUrl.trim()) {
      const bookmark: Bookmark = {
        id: Date.now(),
        title: newTitle.trim(),
        url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
        category: newCategory
      }
      setBookmarks([...bookmarks, bookmark])
      setNewTitle('')
      setNewUrl('')
      setNewCategory('general')
    }
  }

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
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
              Bookmarks
            </h1>
            <p className="text-lg text-muted-foreground dark:text-zinc-300">
              Save and organize your favorite websites
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-xl border border-border bg-card">
              <form onSubmit={addBookmark} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                    <Input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter bookmark title"
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-medium">URL</Label>
                    <Input
                      id="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Enter website URL"
                      className="bg-background"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select
                      value={newCategory}
                      onValueChange={setNewCategory}
                    >
                      <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add Bookmark
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {!isClient ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">No bookmarks yet. Add one above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookmarks.map(bookmark => (
                    <div
                      key={bookmark.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {bookmark.title}
                        </h3>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/90 hover:underline text-sm truncate block"
                        >
                          {bookmark.url}
                        </a>
                        <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground mt-2">
                          {bookmark.category}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBookmark(bookmark.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </AppLayout>
  )
}
