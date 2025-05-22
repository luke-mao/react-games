import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModal } from "@/hook/useModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// game stage
const STAGE = {
  INPUT: "input",
  PLAYING: "playing",
  OVER: "over",
};

// maximum 5 blocks
const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
];

const NumberBlockDialog = ({ setNumBlocks, startGame }) => (
  <Dialog open={true}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          How many blocks do you want to start with?
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-row items-center justify-center md:justify-start">
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number of Blocks</SelectLabel>
              <SelectItem value={3} onClick={() => setNumBlocks(3)}>3</SelectItem>
              <SelectItem value={4} onClick={() => setNumBlocks(4)}>4</SelectItem>
              <SelectItem value={5} onClick={() => setNumBlocks(5)}>5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row items-center justify-center md:justify-end">
        <Button variant="secondary" className="w-fit cursor-pointer" onClick={startGame}>
          Start
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default function Tower() {
  const { openModal } = useModal();
  const navigate = useNavigate();

  // the game stage.
  // this game does not need to check isWin, 
  // because the game is over when the user moves all blocks and win
  const [stage, setStage] = useState(STAGE.INPUT);

  // ask for the number of blocks
  const [numBlocks, setNumBlocks] = useState(3);

  // 3 towers
  const [towers, setTowers] = useState(Array(3).fill([]));

  // in one turn, we have the tower "from" and the tower "to"
  const [move, setMove] = useState({from: null, to: null});

  // count how many moves
  const [moveCount, setMoveCount] = useState(0);

  // start the game
  const startGame = () => {
    setStage(STAGE.PLAYING);

    // put all blocks to the first tower
    const tower1 = Array.from({ length: numBlocks }, (_, i) => i + 1);
    const tower2 = [];
    const tower3 = [];
    setTowers([tower1, tower2, tower3]);
  };

  console.log(stage, numBlocks, towers);

  // reset the game
  const resetGame = () => {
    setStage(STAGE.INPUT);
    setNumBlocks(3);
    setTowers(Array(3).fill([]));
    setMove({from: null, to: null});
  };

  // click the tower
  const clickTower = (towerIndex) => {
    // copy the current move
    const newMove = {...move};

    // if the from tower is null, set it to the clicked tower
    if (newMove.from === null) {
      newMove.from = towerIndex;
      setMove(newMove);
      return;
    }

    // now the from tower is set, then this is for the to tower
    newMove.to = towerIndex;

    // check if the "from" can give one piece to the "to"
    // the first element in the "from" is transferred to the "to",
    // require that element to be smaller than the first element in the "to"
    const isValid = towers[newMove.from].length > 0
      && (towers[newMove.to].length === 0 || towers[newMove.from][0] < towers[newMove.to][0]);

    if (isValid) {
      // move that
      const newTowers = [...towers];
      const block = newTowers[newMove.from].shift();
      newTowers[newMove.to].unshift(block);
      setTowers(newTowers);

      // this is a valid move, increase the count
      setMoveCount(moveCount + 1);

      // check if the game is over: when all the blocks are in tower 3
      if (newTowers[2].length === numBlocks) {
        setStage(STAGE.OVER);
      }
    }

    // clear the move
    setMove({from: null, to: null});
  };

  // when the game is over, show the dialog
  useEffect(() => {
    if (stage === STAGE.OVER) {
      const title = "You win!";
      const description = `Success in ${moveCount} moves!`;
      const onClose = () => navigate("/home");
      openModal(title, description, onClose);
    }
  }, [stage]);



  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {stage === STAGE.INPUT && (
        <NumberBlockDialog setNumBlocks={setNumBlocks} startGame={startGame} />
      )}
      <div className="w-full flex flex-row gap-12 items-center justify-center">
        {towers.map((tower, index) => (
          <div
            key={index}
            className="relative w-1/4 h-[300px] border-[2px] border-dashed border-[#999] cursor-pointer"
            onClick={() => clickTower(index)}
          >
            {/* bottom has a horizontal line about 3px thick */}
            <div className="absolute bottom-0 w-full h-[5px] translate-y-1/2 bg-[#999]"/>

            {/* has a vertical line extending upward from the middle of the horizontal line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[5px] bg-[#999]"/>
            
            {/* the number of blocks add from the bottom up */}
            {[...tower].reverse().map((block, blockIndex) => (
              <div
                key={`tower-${index}-block-${blockIndex}`}
                className={`absolute left-1/2 h-[30px] ${COLORS[block - 1]}`}
                style={{
                  bottom: `${blockIndex * 30 + 2.5}px`,
                  transform: "translateX(-50%)",
                  width: `${block * 20}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <Button variant="secondary" className="w-fit cursor-pointer" onClick={resetGame}>
        Reset
      </Button>
    </div>
  );
}
