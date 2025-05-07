'use client'

import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Course {
  name: string
  location: string
  span: number
}

interface TimeSlot {
  course: Course | null
  isStart: boolean
}

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']
const PERIODS = [
  { id: 1, start: '9:00', end: '9:45' },
  { id: 2, start: '9:45', end: '10:30' },
  { id: 3, start: '10:40', end: '11:25' },
  { id: 4, start: '11:25', end: '12:10' },
  { id: 5, start: '12:20', end: '1:05' },
  { id: 6, start: '1:05', end: '1:50' },
  { id: 7, start: '2:00', end: '2:45' },
  { id: 8, start: '2:45', end: '3:30' }
]

export function TimeTableCreator() {
  const tableRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = async () => {
    if (!tableRef.current) return

    try {
      // Create a clone of the table for export
      const clone = tableRef.current.cloneNode(true) as HTMLElement
      clone.style.background = 'white'
      
      // Remove delete buttons from clone
      const buttons = clone.getElementsByTagName('button')
      Array.from(buttons).forEach(button => button.remove())

      // Style all elements for PDF export
      const elements = clone.getElementsByTagName('*')
      Array.from(elements).forEach((el: Element) => {
        const element = el as HTMLElement
        element.style.color = 'black'
        
        // Add extra padding and height to cells
        if (element.tagName === 'TD' || element.tagName === 'TH') {
          element.style.padding = '12px 8px'
          element.style.minHeight = '80px'
          element.style.height = 'auto'
          element.style.verticalAlign = 'middle'
        }

        // Set white background only for normal cells, not headers
        if (element.tagName === 'TD') {
          element.style.background = 'white'
        }
        
        // Special styling for header cells
        if (element.tagName === 'TH') {
          element.style.backgroundColor = 'rgb(241 245 249)' // Keep the original bg-secondary/50 color
          element.style.minHeight = '90px'
          element.style.height = 'auto'
          element.style.whiteSpace = 'normal'
          element.style.fontSize = '14px'
          
          // If this is a period header cell (contains time)
          const timeElement = element.querySelector('.text-sm')
          if (timeElement) {
            element.style.padding = '16px 8px'
            
            // Style the period number
            const periodNum = element.querySelector('.font-bold')
            if (periodNum) {
              const periodElement = periodNum as HTMLElement
              periodElement.style.marginBottom = '8px'
              periodElement.style.display = 'block'
            }
            
            // Style the time text
            if (timeElement) {
              const timeTextElement = timeElement as HTMLElement
              timeTextElement.style.display = 'block'
              timeTextElement.style.marginTop = '4px'
              timeTextElement.style.lineHeight = '1.2'
            }
          }
        }
        
        // Style course containers
        if (element.classList.contains('group')) {
          element.style.minHeight = '70px'
          element.style.padding = '8px 4px'
        }

        if (element.classList.contains('text-gray-500')) {
          element.style.color = '#4B5563'
          element.style.marginTop = '4px'
        }
      })

      // Ensure table is full width and cells have proper height
      const table = clone.querySelector('table') as HTMLTableElement
      if (table) {
        table.style.width = '100%'
        table.style.borderCollapse = 'collapse'
        
        // Adjust row heights
        const rows = table.getElementsByTagName('tr')
        Array.from(rows).forEach((row: Element) => {
          const rowElement = row as HTMLElement
          rowElement.style.minHeight = '80px'
        })
      }

      // Position clone off-screen
      clone.style.position = 'fixed'
      clone.style.top = '-9999px'
      clone.style.width = '1024px'
      document.body.appendChild(clone)

      // Generate canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: 1024,
        windowHeight: clone.scrollHeight
      })

      // Generate PDF
      const imgWidth = 280
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Add image to PDF with margins
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        10,
        10,
        imgWidth,
        imgHeight
      )

      // Save the PDF
      pdf.save('timetable.pdf')

      // Cleanup
      document.body.removeChild(clone)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }
  // Initialize timetable from localStorage or create empty one
  const [timetable, setTimetable] = useState<TimeSlot[][]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timetable')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Error loading saved timetable:', e)
        }
      }
    }
    return DAYS.map(() => PERIODS.map(() => ({ course: null, isStart: false })))
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0)
  const [newCourse, setNewCourse] = useState({ name: '', location: '', span: 1 })

  const handleCellClick = (dayIndex: number, periodIndex: number) => {
    if (timetable[dayIndex][periodIndex].course) return
    setSelectedDay(dayIndex)
    setSelectedPeriod(periodIndex)
    setNewCourse({ name: '', location: '', span: 1 })
    setDialogOpen(true)
  }

  const handleDeleteCourse = (dayIndex: number, periodIndex: number) => {
    const slot = timetable[dayIndex][periodIndex]
    if (!slot.course) return

    const updatedTimetable = [...timetable]
    const span = slot.course.span

    // Remove all slots for this course
    for (let i = 0; i < span; i++) {
      updatedTimetable[dayIndex][periodIndex + i] = {
        course: null,
        isStart: false
      }
    }

    setTimetable(updatedTimetable)
    localStorage.setItem('timetable', JSON.stringify(updatedTimetable))
  }

  const handleAddCourse = () => {
    if (!newCourse.name) return

    const updatedTimetable = [...timetable]
    const rowSlots = updatedTimetable[selectedDay]

    // Check if we have enough space
    if (selectedPeriod + newCourse.span > PERIODS.length) {
      alert('Not enough periods available')
      return
    }

    // Check if slots are available
    for (let i = 0; i < newCourse.span; i++) {
      if (rowSlots[selectedPeriod + i].course) {
        alert('Some periods are already occupied')
        return
      }
    }

    // Add course
    for (let i = 0; i < newCourse.span; i++) {
      rowSlots[selectedPeriod + i] = {
        course: newCourse,
        isStart: i === 0
      }
    }

    setTimetable(updatedTimetable)
    // Save to localStorage
    localStorage.setItem('timetable', JSON.stringify(updatedTimetable))
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div ref={tableRef} className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-1 md:p-2 bg-secondary/50 whitespace-normal">Time/Day</th>
              {PERIODS.map((period) => (
                <th key={period.id} className="border p-1 md:p-2 bg-secondary/50 w-[80px] md:w-[120px]">
                  <div className="font-bold text-xs md:text-base">{period.id}</div>
                  <div className="text-[10px] md:text-sm">{period.start} - {period.end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIndex) => (
              <tr key={day}>
                <th className="border p-1 md:p-2 font-medium bg-secondary/50 w-[70px] md:w-[100px] text-xs md:text-base whitespace-normal">{day}</th>
                {timetable[dayIndex].map((slot, periodIndex) => {
                  if (slot.course && !slot.isStart) return null
                  return (
                    <td
                      key={periodIndex}
                      className={`border p-2 ${slot.course ? 'bg-primary/10' : 'hover:bg-secondary/20 cursor-pointer'}`}
                      onClick={() => !slot.course && handleCellClick(dayIndex, periodIndex)}
                      colSpan={slot.course?.span || 1}
                    >
                      {slot.course && (
                        <div className="group relative flex flex-col items-center justify-center h-full min-h-[40px] md:min-h-[60px]">
                          <div className="font-medium text-center text-xs md:text-base break-words w-full px-1">{slot.course.name}</div>
                          <div className="text-[10px] md:text-sm text-gray-500 text-center break-words w-full px-1">{slot.course.location}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(dayIndex, periodIndex);
                            }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleExportPDF}
          className="bg-primary hover:bg-primary/90"
        >
          Export to PDF
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-gray-900 bg-white">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Name</label>
              <Input
                value={newCourse.name}
                onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter course name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={newCourse.location}
                onChange={(e) => setNewCourse(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter lecture hall/room"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Periods</label>
              <Input
                type="number"
                min={1}
                max={8}
                value={newCourse.span}
                onChange={(e) => setNewCourse(prev => ({ ...prev, span: Math.max(1, Math.min(8, parseInt(e.target.value) || 1)) }))}
              />
            </div>
            <Button onClick={handleAddCourse} className="w-full">Add Course</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
