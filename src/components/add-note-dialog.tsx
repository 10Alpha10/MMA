'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Note } from '@/types/types'
import dynamic from 'next/dynamic'

// Import TipTap editor dynamically to avoid SSR issues
const TipTapEditor = dynamic(() => import('./tiptap-editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (note: Note) => void
  initialNote?: Note
}

export default function AddNoteDialog({ isOpen, onClose, onAdd, initialNote }: AddNoteDialogProps) {
  const [title, setTitle] = useState(initialNote?.title || '')
  const [content, setContent] = useState(initialNote?.content || '')
  const [folder, setFolder] = useState(initialNote?.folder || 'General')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    const note: Note = {
      id: initialNote?.id || crypto.randomUUID(),
      title,
      content,
      folder,
      createdAt: initialNote?.createdAt || now,
      updatedAt: now
    }
    
    // Call the onAdd function provided by the parent component
    onAdd(note)
    
    // Also save to localStorage directly to ensure it's saved immediately
    try {
      const savedNotes = localStorage.getItem('studyNotes')
      let notesArray: Note[] = []
      
      if (savedNotes) {
        notesArray = JSON.parse(savedNotes)
        
        // If this is an edit, replace the existing note
        if (initialNote) {
          notesArray = notesArray.map(existingNote => 
            existingNote.id === note.id ? note : existingNote
          )
        } else {
          // If this is a new note, add it to the beginning of the array
          notesArray = [note, ...notesArray]
        }
      } else {
        // If there are no saved notes yet, create a new array with just this note
        notesArray = [note]
      }
      
      localStorage.setItem('studyNotes', JSON.stringify(notesArray))
    } catch (error) {
      console.error('Failed to save note to localStorage:', error)
    }
    
    onClose()
    
    // Reset form
    if (!initialNote) {
      setTitle('')
      setContent('')
      setFolder('General')
    }
  }

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent 
        className="max-w-3xl h-[80vh] bg-white dark:bg-gray-900" 
        hideCloseButton
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>{initialNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Input
                id="folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g., Math, History"
                required
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Label>Content</Label>
            <div className="mt-2 h-full">
              <TipTapEditor
                content={content}
                onChange={setContent}
                className="h-[calc(100%-2rem)] overflow-y-auto border rounded-md p-4"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialNote ? 'Save Changes' : 'Add Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
