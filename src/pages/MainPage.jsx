import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Snek from "@/pages/Snek";
import Tictac from "@/pages/Tictac";
import Tower from "@/pages/Tower";
import MathGame from "@/pages/MathGame";
import Connect4 from "@/pages/Connect4";
import Memorisation from "@/pages/Memorisation";
import Operations from "@/pages/Operations";
import Memory from "@/pages/Memory";
import Space from "@/pages/Space";
import NumberMemory from "@/pages/NumberMemory";
import TreasureHunt from "@/pages/TreasureHunt";
import FlappyBird from "@/pages/FlappyBird";

export default function MainPage() {

  return (
    <div
      className="
        fixed top-0
        h-[calc(100%-50px)]
        left-[40px] w-[calc(100%-40px)]
        md:left-[70px] md:w-[calc(100%-70px)]
        lg:left-[110px] lg:w-[calc(100%-110px)]
        bg-blue
      "
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/snek" element={<Snek />} />
        <Route path="/game/tictactoe" element={<Tictac />} />
        <Route path="/game/tower" element={<Tower />} />
        <Route path="/game/math" element={<MathGame />} />
        <Route path="/game/connect" element={<Connect4 />} />
        <Route path="/game/memorisation" element={<Memorisation />} />
        <Route path="/game/operations" element={<Operations />} />
        <Route path="/game/memory" element={<Memory />} />
        <Route path="/game/space" element={<Space />} />
        <Route path="/game/numbermemory" element={<NumberMemory />} />
        <Route path="/game/treasurehunt" element={<TreasureHunt />} />
        <Route path="/game/flappybird" element={<FlappyBird />} />

        {/* match 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
