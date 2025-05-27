import { Button } from "@/components/ui/button";
import { useModal } from "@/hook/useModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  WIN: "Win",
  END: "End",
};

export default function Memorisation() {
  const { openModal } = useModal();
  const navigate = useNavigate();

  const initialState = {
    stage: STAGES.START,
    correctOrders: [],
    userOrders: [],
    currentStage: 0,
  };

  // the game layout is 4 cells 2 * 2
  const cells = [0, 1, 2, 3];

  const [gameStage, setGameStage] = useState(initialState);

  // track the cells to be flashed
  const [flashedCells, setFlashedCells] = useState([]);

  // get a list of random values between [0, 3], base on the number of values required
  const getRandom = (count) => {
    // the random number can be repeated,
    // but since we are using flashing, 
    // the adjacent cells should not be the same
    const randomValues = [];
    for (let i = 0; i < count; i++) {
      // randomValues.push(Math.floor(Math.random() * cells.length));
      let newV;
      do {
        newV = Math.floor(Math.random() * cells.length);
      } while (randomValues.length > 0 && randomValues[randomValues.length - 1] === newV);

      // now add this newV to the orders. 
      randomValues.push(newV);
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
          setGameStage({
            stage: STAGES.STAGE_DEMO,
            correctOrders: getRandom(1),
            userOrders: [],
            currentStage: 1,
          });
        },
        "yesno",
        () => {
          // onNo
          setGameStage(prev => ({
            ...prev,
            stage: STAGES.STAGE_END,
          }));
        }
      );
    } else if (gameStage.stage === STAGES.STAGE_DEMO) {
      // maximum 5 stages
      if (gameStage.currentStage > 5) {
        setGameStage(prev => ({
          ...prev,
          stage: STAGES.WIN,
        }));
      } else {
        let i = 0;
        
        const makeFlash = () => {
          if (i < gameStage.correctOrders.length) {
            // set this cell to flash
            setFlashedCells([gameStage.correctOrders[i]]);
            i++;

            // set the cells to empty after 0.5 seconds
            setTimeout(() => {
              setFlashedCells([]);
              makeFlash();
            }, 500);
          } else {
            // no cell flash, move to the user click stage
            setGameStage(prev => ({
              ...prev,
              stage: STAGES.STAGE_USER_CLICK,
              userOrders: [],
            }));

            setFlashedCells([]);
          }
        };

        // wait for 0.2 seconds, then start flashing
        setTimeout(() => makeFlash(), 200);
      }
    } else if (gameStage.stage === STAGES.WIN) {
      // open modal to show the win message and direct to the home page
      openModal(
        "Congratulations!",
        "You have won the memorisation game.",
        () => navigate("/home")
      );
    }

  }, [gameStage]);

  // cells have different background colors based on the game stage and the flashing.
  const getBackgroundColor = (cell) => {
    if (gameStage.stage === STAGES.START || gameStage.stage === STAGES.END) {
      return "bg-white";
    } else if (gameStage.stage === STAGES.STAGE_DEMO) {
      // only flash the cells in the flashedCells array
      return flashedCells.includes(cell) ? "bg-[#999]" : "bg-white";
    } else if (gameStage.stage === STAGES.STAGE_USER_CLICK) {
      // do not flash
      return "bg-white";
    } else if (gameStage.stage === STAGES.STAGE_SUCCESS) {
      // move to the next stage
      return "bg-white";
    } else if (gameStage.stage === STAGES.STAGE_FAIL) {
      // flash all cells in red
      return "bg-red-500";
    } else if (gameStage.stage === STAGES.WIN) {
      // show nothing
      return "bg-white";
    }
  };

  // reset game to the start
  const resetGame = () => {
    setGameStage(initialState);
    setFlashedCells([]);
  };

  // click on the cell
  const clickCell = (cell) => {
    // only when the gameStage is STAGE_USER_CLICK, then the click is working
    if (gameStage.stage !== STAGES.STAGE_USER_CLICK) {
      return;
    }

    // if the userOrders is shorter than the correctOrders, wait
    const newUserOrders = [...gameStage.userOrders, cell];

    if (newUserOrders.length < gameStage.correctOrders.length) {
      // just set the newUserOrders, and wait for more clicks
      setGameStage(prev => ({
        ...prev,
        userOrders: newUserOrders,
      }));
    } else {
      // check if match
      const isMatch = newUserOrders.every((order, index) => order === gameStage.correctOrders[index]);

      if (isMatch) {
        setGameStage(prev => ({
          stage: STAGES.STAGE_DEMO,
          correctOrders: getRandom(prev.currentStage + 1),
          userOrders: [],
          currentStage: prev.currentStage + 1,
        }));
      } else {
        setGameStage(prev => ({
          ...prev,
          stage: STAGES.STAGE_FAIL,
        }));

        // flash all cells
        setFlashedCells(cells);

        // after 0.5 seconds, reset the flashedcells, 
        // and set the gamestage to the demo again (show the same sequence again)
        setTimeout(() => {
          setFlashedCells([]);
          setGameStage(prev => ({
            ...prev,
            stage: STAGES.STAGE_DEMO,
            userOrders: [],
          }));
        }, 500);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-15 items-center justify-center">
      <div className="h-1/2 aspect-square flex flex-row flex-wrap items-center justify-center gap-0">
        {cells.map((cell) => (
          <div
            key={`cell-${cell}`}
            className={`h-1/2 aspect-square border-[rgb(255,0,255)] border-1 border-solid ${getBackgroundColor(cell)}`}
            onClick={() => clickCell(cell)}
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
