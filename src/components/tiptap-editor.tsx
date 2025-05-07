'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

interface MenuBarProps {
  editor: ReturnType<typeof useEditor>
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b">
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleBold().run()
        }}
        className={editor.isActive('bold') ? 'bg-secondary' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleItalic().run()
        }}
        className={editor.isActive('italic') ? 'bg-secondary' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleBulletList().run()
        }}
        className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleOrderedList().run()
        }}
        className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          editor.chain().focus().toggleBlockquote().run()
        }}
        className={editor.isActive('blockquote') ? 'bg-secondary' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function TipTapEditor({ content, onChange, className = '' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {
          HTMLAttributes: {
            class: 'font-bold'
          }
        },
        italic: {
          HTMLAttributes: {
            class: 'italic'
          }
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none'
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === 'Escape') {
            // Prevent Escape key from closing the dialog
            event.preventDefault()
            event.stopPropagation()
            return true
          }
          if ((event.ctrlKey || event.metaKey) && (event.key === 'b' || event.key === 'i')) {
            // Let TipTap handle the formatting shortcuts
            event.stopPropagation()
            return false
          }
          return false
        }
      }
    }
  })

  return (
    <div className={`border rounded-md ${className}`}>
      <MenuBar editor={editor} />
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
