import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const STAGES = {
  PRESTART: "prestart",
  DISPLAY: "display",
  INPUT: "input",
  WIN: "win",
  LOSE: "lose",
};

// get a string of length n digits with random digits from 0 to 9
const getRandomDigits = (n) => {
  const digits = Array.from({ length: n }, () => Math.floor(Math.random() * 10));
  return digits.join("");
};

// the game only ends when the user makes wrong input,
// if the user has won 4 times, then he wins
export default function NumberMemory() {
  const navigate = useNavigate();

  const [stage, setStage] = useState(STAGES.PRESTART);
  const [numDigits, setNumDigits] = useState(0);
  const [displayNumber, setDisplayNumber] = useState("");
  const [userInput, setUserInput] = useState("");

  // advance the game
  const advanceGame = () => {
    setNumDigits(numDigits + 1);
    setDisplayNumber(getRandomDigits(numDigits + 1));
    setUserInput("");
    setStage(STAGES.DISPLAY);

    // after 3 seconds, move to the input stage
    setTimeout(() => {
      setStage(STAGES.INPUT);
    }, 2000);
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center"
      onClick={() => {
        if (stage === STAGES.LOSE) {
          navigate("/home");
        }
      }}
    >
      {stage === STAGES.PRESTART && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-3xl font-bold text-blue-500">
            Welcome to Number Memory!
          </div>
          <div className="text-2xl font-bold text-blue-500">
            Get a score of 4 to win!
          </div>
          <Button
            variant="outline"
            onClick={advanceGame}
          >
            START
          </Button>
        </div>
      )}
      {stage === STAGES.DISPLAY && (
        <div className="text-3xl font-bold">
          {displayNumber}
        </div>
      )}
      {stage === STAGES.INPUT && (
        <Input
          autoFocus
          className="w-[300px] text-center !text-3xl h-auto p-2"
          type="number"
          placeholder="Enter the number"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);

            // when the length are equal, do the compare
            if (e.target.value.length < displayNumber.length) {
              // wait for the input
              return;
            } else {
              // if the user input matches, then advance the game again
              if (e.target.value === displayNumber) {
                setTimeout(() => advanceGame(), 200);
              } else {
                // fail the game
                setTimeout(() => setStage(STAGES.LOSE), 200);
              }
            }

          }}
        />
      )}
      {stage === STAGES.LOSE && (
        <div className="flex flex-col items-center justify-center gap-4 text-2xl">
          <div>{`Score: ${numDigits - 1}`}</div>
          <div>{`Number: ${displayNumber}`}</div>
          <div>{`Your Answer: ${userInput}`}</div>
          <div>{numDigits >=4 ? "You've Won :)" : "You've Lost :("}</div>
          <div>Click anywhere to return</div>
        </div>
      )}
    </div>
  );
}
