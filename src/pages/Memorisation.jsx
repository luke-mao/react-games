import { Button } from "@/components/ui/button";
import { useModal } from "@/hook/useModal";
import React, { useEffect, useState } from "react";

// Game mounts, and the user clicks YES to start, or NO to exit 
// until the reset button is clicked. 
// stage 1: 1 random cell flashes for 0.5 seconds, 
// and the user clicks that cell
// stage 2: the same cell in stage 1 flashes for 0.5, 
// and another random cell flashes for 0.5, then the user clicks both cells in order to advance.
// if fails, all cells flash with a red background, and repeat the stage 2.
// then stage 3, 4, 5
// and a dialog "won"
const STAGES = {
  START: "Start",
  STAGE_DEMO: "StageDemo",
  STAGE_USER_CLICK: "StageUserClick",
  STAGE_SUCCESS: "StageSuccess",
  STAGE_FAIL: "StageFail",
  STAGE_WIN: "StageWin",
  STAGE_END: "StageEnd",
}

export default function Memorisation() {
  const { openModal } = useModal();

  const initialState = {
    stage: STAGES.START,
    correctOrders: [],
    userOrders: [],
    currentStage: 0,
  }

  // the game layout is 4 cells 2 * 2
  const cells = [0, 1, 2, 3];

  const [gameStage, setGameStage] = useState(initialState);

  // get a list of random values between [0, 3], base on the number of values required
  const getRandom = (count) => {
    // the random number can be repeated
    const randomValues = [];
    for (let i = 0; i < count; i++) {
      randomValues.push(Math.floor(Math.random() * cells.length));
    }

    return randomValues;
  };




  useEffect(() => {
    // if the gameStage is START, then show the dialog
    if (gameStage.stage === STAGES.START) {
      openModal(
        "Would you like to play?",
        "This is a memorisation game. You will see a sequence of cells flashing, and you need to click them in the same order.",
        () => {
          // onYes
          setGameStage(prev => ({
            stage: STAGES.STAGE_DEMO,
            correctOrders: getRandom(1),
            userOrders: [],
            currentStage: 1,
          }));
        },
        "yesno",
        () => {
          // onNo
          setGameStage(prev => ({
            ...prev,
            stage: STAGES.STAGE_END,
          }));
        }
      )
    }

  }, [gameStage]);

  const getBackgroundColor = (cell) => {
    // START: "Start",  ok
    // STAGE_DEMO: "StageDemo",
    // STAGE_USER_CLICK: "StageUserClick",
    // STAGE_SUCCESS: "StageSuccess",
    // STAGE_FAIL: "StageFail",
    // STAGE_WIN: "StageWin",
    // STAGE_END: "StageEnd", ok

    if (gameStage.stage === STAGES.STAGE_DEMO || gameStage.stage === STAGES.STAGE_END) {
      return "bg-white";
    }





  }


  // reset game to the start
  const resetGame = () => {
    setGameStage(initialState);
  };

  return (
    <div className="w-full h-full flex flex-col gap-15 items-center justify-center">
      <div className="h-1/2 aspect-square flex flex-row flex-wrap items-center justify-center gap-0">
        {cells.map((cell, index) => (
          <div
            key={`cell-${cell}`}
            className={`h-1/2 aspect-square border-[rgb(255,0,255)] border-1 border-solid ${getBackgroundColor(cell)}`}
          />
        ))}
      </div>
      <Button
        variant="outline"
        onClick={resetGame}
      >
        Reset
      </Button>
    </div>

  );
}
