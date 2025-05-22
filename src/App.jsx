import React from 'react'
import Modal from '@/components/Modal'
import Sidebar from '@/components/ui/Sidebar'

export default function App() {
  return (
    <div className="w-full h-screen bg-amber-50">
      <Modal/>
      <div className="w-full h-screen">
        <Sidebar/>
      </div>
    </div>
  )
}
