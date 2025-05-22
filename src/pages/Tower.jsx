import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

// game stage
const STAGE = {
  INPUT: "input",
  PLAYING: "playing",
  OVER: "over",
}

const NumberBlockDialog = ({ open, setNumBlocks, setStage }) => (
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
        <Button variant="secondary" className="w-fit" onClick={() => setStage(STAGE.PLAYING)}>
          Start
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);


export default function Tower() {
  // the game stage: 
  const [stage, setStage] = useState(STAGE.INPUT);
  const [isWin, setIsWin] = useState(false);

  // ask for the number of blocks
  const [numBlocks, setNumBlocks] = useState(3);

  console.log(stage, numBlocks);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {stage === STAGE.INPUT && (
        <NumberBlockDialog open={true} setNumBlocks={setNumBlocks} setStage={setStage} />
      )}
      <Button variant="secondary" className="w-fit">
        Reset
      </Button>
    </div>
  );
}
