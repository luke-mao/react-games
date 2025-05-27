import { Button } from "@/components/ui/button";
import { useModal } from "@/hook/useModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// game has 3 stages: DISPLAY, CLICK, WIN, LOSE
const STAGES = {
  DISPLAY: "DISPLAY",
  CLICK: "CLICK",
  WIN: "WIN",
  LOSE: "LOSE",
};

export default function Memory() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  // ABCD 4 cells
  const cells = ["A", "B", "C", "D"];

  // get some random characters from the cells based on the number
  const getRandom = (num) => {
    const result = [];

    for (let i = 0; i < num; i++) {
      let value;
      do {
        value = cells[Math.floor(Math.random() * cells.length)];
      } while (result.length < num && result[result.length - 1] === value);

      // add this value
      result.push(value);
    }

    return result;
  };

  // the game
  const initialGame = {
    instructions: getRandom(1),
    clicks: [],
    round: 1,
    stage: STAGES.DISPLAY,
  };

  const [game, setGame] = useState(initialGame);

  // a instruction variable
  const [instruction, setInstruction] = useState("");

  // when the game starts, display the instruction one by one
  useEffect(() => {
    if (game.stage === STAGES.DISPLAY) {
      // if the game.round > 5, then show the win
      if (game.round > 5) {
        openModal(
          "You Won!",
          "Would you like to play again?",
          () => setGame(initialGame),
          "yesno",
          () => navigate("/home"),
        );
        return;
      }

      // show the instructions one by one
      let index = 0;
      
      const showInstruction = () => {
        if (index < game.instructions.length) {
          setInstruction(game.instructions[index]);
          index++;

          // call the showInstruction again after 1 second
          setTimeout(showInstruction, 1000);
        } else {
          // move to the click stage
          setGame((prev) => ({ ...prev, stage: STAGES.CLICK }));

          // clear the instruction after displaying all
          setInstruction(""); 
        }
      };

      // call the showInstruction function
      showInstruction();
    } else if (game.stage === STAGES.CLICK) {
      // do nothing
    }

  }, [game]);

  // handle click on a cell
  const click = (cell) => {
    if (game.stage === STAGES.CLICK) {
      // only at this time it is clickable
      const newClicks = [...game.clicks, cell];

      if (newClicks.length === game.instructions.length) {
        // compare if exactly the same
        const isSame = game.clicks.every((click, index) => click === game.instructions[index]);

        if (isSame) {
          // move to the next stage
          setGame((prev) => ({
            clicks: [],
            round: prev.round + 1,
            stage: STAGES.DISPLAY,
            instructions: getRandom(prev.round + 1),
          }));
        } else {
          // open modal for losing, and reset the game
          openModal(
            "You Lost!",
            "Would you like to try again?",
            () => setGame(initialGame),
            "yesno",
            () => navigate("/home"),
          );
        }
      } else {
        setGame((prev) => ({
          ...prev,
          clicks: newClicks,
        }));
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 4 buttons */}
      <div className="w-full h-1/2 flex flex-row items-center justify-center">
        {cells.map((cell) => (
          <div
            key={cell}
            className={`h-full w-1/4 flex items-center justify-center text-6xl border-2 rounded ${game.stage === STAGES.CLICK ? "cursor-pointer hover:bg-[#cccccc]" : "bg-[#eee]"}`}
            onClick={() => click(cell)}
          >
            {cell}
          </div>
        ))}
      </div>
      {/* an instruction box */}
      <div className="w-full h-1/2 flex items-center justify-center">
        <div
          className="bg-[#cccccc] w-1/8 aspect-square text-5xl flex items-center justify-center rounded"
        >
          {instruction}
        </div>
      </div>
    </div>
  );
}
