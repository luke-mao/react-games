import React from 'react'
import Modal from '@/components/Modal'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="w-full h-screen bg-amber-50">
      <Modal/>
      <div className="w-full h-screen">
        <Sidebar/>
        <Footer/>
      </div>
    </div>
  )
}
