'use client'

import { useState } from 'react'
import { Note } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import AddNoteDialog from './add-note-dialog'

interface NotesListProps {
  notes: Note[]
  onDelete: (id: string) => void
  onUpdate: (note: Note) => void
}

export default function NotesList({ notes, onDelete, onUpdate }: NotesListProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleExpand = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId)
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
  }

  const handleUpdate = (updatedNote: Note) => {
    onUpdate(updatedNote)
    setEditingNote(null)
  }
  
  const handleDelete = (id: string) => {
    // Call the onDelete function provided by the parent component
    onDelete(id)
    
    // Also remove from localStorage directly to ensure it's saved immediately
    try {
      const savedNotes = localStorage.getItem('studyNotes')
      if (savedNotes) {
        const notesArray: Note[] = JSON.parse(savedNotes)
        const updatedNotes = notesArray.filter(note => note.id !== id)
        localStorage.setItem('studyNotes', JSON.stringify(updatedNotes))
      }
    } catch (error) {
      console.error('Failed to delete note from localStorage:', error)
    }
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes yet. Click &quot;New Note&quot; to create one.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-lg font-semibold truncate">{note.title}</h3>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{note.folder}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(note)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExpand(note.id)}
                >
                  {expandedNoteId === note.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {expandedNoteId === note.id ? 'Collapse' : 'Expand'}
                  </span>
                </Button>
              </div>
            </div>
            {expandedNoteId === note.id && (
              <div 
                className="mt-4 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            )}
          </div>
        ))}
      </div>

      <AddNoteDialog
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        onAdd={handleUpdate}
        initialNote={editingNote || undefined}
      />
    </>
  )
}
