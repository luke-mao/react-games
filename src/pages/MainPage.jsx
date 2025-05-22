import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Snek from '@/pages/Snek'
import Tictac from '@/pages/Tictac'
import Tower from '@/pages/Tower'

export default function MainPage() {
  return (
    <div
      className="
        fixed top-0
        h-[calc(100%-50px)]
        left-[30px] w-[calc(100%-30px)]
        md:left-[60px] md:w-[calc(100%-60px)]
        lg:left-[100px] lg:w-[calc(100%-100px)]
        bg-blue
        "
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/games/snek" element={<Snek />} />
        <Route path="/games/tictactoe" element={<Tictac />} />
        <Route path="/games/tower" element={<Tower />} />
      </Routes>
    </div>
  )
}
