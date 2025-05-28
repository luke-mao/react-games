import React, { useEffect, useState } from "react";
import Bird from "@/assets/bird.png";

const STAGES = {
  PRESTART: "prestart",
  PLAY: "play",
  OVER: "over",
};

const BIRD_SIZE = 20;
const BIRD_X = 50;

export default function FlappyBird() {
  const [stage, setStage] = useState(STAGES.PRESTART);

  // when the stage is PRESTART, the user hit the space key to start the game
  const startGame = () => setStage(STAGES.PLAY);

  // the bird has x fixed 50px from the left, and y should be in the center of the screen
  // consider use % to make it responsive
  const [birdY, setBirdY] = useState("50%");

  useEffect (() => {
    if (stage === STAGES.PRESTART) {
      const checkSpaceKey = (e) => {
        if (e.code === "Space") {
          startGame();
        }
      };

      window.addEventListener("keydown", checkSpaceKey);
      return () => window.removeEventListener("keydown", checkSpaceKey);
    }



  }, [stage]);


  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center"
      onClick={() => {
        if (stage === STAGES.PRESTART) {
          startGame();
        }
      }}
    >
      {stage === STAGES.PRESTART && (
        <div className="absolute top-5 left-5 text-left">
          <div className="text-2xl">Welcome to Flappy Bird!</div>
          <div className="text-xl">Get a score of 3 to win!</div>
        </div>
      )}
      {/* the gameplay screen */}
      <div
        className="
          relative 
          w-[380px] h-[600px] 
          sm:w-[600px] sm:h-[400px] 
          bg-[#eee]
          rounded
          flex items-center justify-center
        "
      >
        {/* show the text only in prestart stage */}
        {stage === STAGES.PRESTART && (
          <div className="text-xl">Hit space or click to begin</div>
        )}
        {/* show the bird */}
        <img
          src={Bird}
          alt="Bird"
          className="absolute object-fill"
          style={{
            width: `${BIRD_SIZE}px`,
            height: `${BIRD_SIZE}px`,
            left: `${BIRD_X}px`,
            // top is in percentage
            top: birdY,
          }}
        />
      </div>
    </div>
  );
}
