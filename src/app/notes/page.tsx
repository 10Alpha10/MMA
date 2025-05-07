'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Folder } from 'lucide-react'
import AddNoteDialog from '@/components/add-note-dialog'
import NotesList from '@/components/notes-list'
import { Note } from '@/types/types'

import { AppLayout } from '@/components/app-layout'
import { ModeToggle } from '@/components/ModeToggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Custom hook for managing notes with localStorage
function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('studyNotes')
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error)
      setIsLoaded(true)
    }
  }, [])

  // Function to save notes to localStorage
  const saveNotes = (notesToSave: Note[]) => {
    try {
      localStorage.setItem('studyNotes', JSON.stringify(notesToSave))
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error)
    }
  }

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes)
    }
  }, [notes, isLoaded])

  const addNote = (note: Note) => {
    const updatedNotes = [note, ...notes]
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    )
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  return { notes, addNote, deleteNote, updateNote, isLoaded }
}

export default function NotesPage() {
  const router = useRouter()
  const { notes, addNote, deleteNote, updateNote, isLoaded } = useNotes()
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('All')
  const [isClient, setIsClient] = useState(false)

  // Set client-side rendering flag and add beforeunload event listener
  useEffect(() => {
    setIsClient(true)
    
    // Add beforeunload event listener to save notes before page unload
    const handleBeforeUnload = () => {
      if (isLoaded && notes.length > 0) {
        localStorage.setItem('studyNotes', JSON.stringify(notes))
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoaded, notes])

  // Handle navigation - ensure notes are saved before navigating
  const handleNavigation = (href: string) => {
    // Force a save to localStorage before navigation
    if (isLoaded && notes.length > 0) {
      localStorage.setItem('studyNotes', JSON.stringify(notes))
    }
    router.push(href)
  }

  const folders = ['All', ...new Set(notes.map(note => note.folder))]
  const filteredNotes = notes.filter(note => 
    (selectedFolder === 'All' || note.folder === selectedFolder) &&
    (note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <AppLayout onNavigate={handleNavigation}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => handleNavigation('/generate')}
          >
            ← Back
          </Button>
          {/* <ModeToggle /> */}
        </div>

        <div className="space-y-4 mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-zinc-100 dark:to-white">
            Study Notes
          </h1>
          <p className="text-lg text-muted-foreground dark:text-zinc-300">
            Create and organize your study materials
          </p>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-48">
                  <Folder className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full pl-10 h-10 rounded-md border border-input bg-transparent px-3 py-2"
                  >
                    {folders.map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={() => setIsAddNoteOpen(true)} 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </div>
            </div>

            {!isClient ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <NotesList
                notes={filteredNotes}
                onDelete={deleteNote}
                onUpdate={updateNote}
              />
            )}
          </div>

          <AddNoteDialog
            isOpen={isAddNoteOpen}
            onClose={() => setIsAddNoteOpen(false)}
            onAdd={addNote}
          />
        </div>
      </div>
    </AppLayout>
  )
}
