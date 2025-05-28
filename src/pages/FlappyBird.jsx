import React, { use, useEffect, useRef, useState } from "react";
import Bird from "@/assets/bird.png";

const STAGES = {
  PRESTART: "prestart",
  PLAY: "play",
  OVER: "over",
};

const BIRD_SIZE = 20;
const BIRD_X = 50;
const JUMP_HEIGHT = 30;

// each frame fall by 3px
const FALL_SPEED = 0.5;

export default function FlappyBird() {
  const [stage, setStage] = useState(STAGES.PRESTART);

  // when the stage is PRESTART, the user hit the space key to start the game
  const startGame = () => setStage(STAGES.PLAY);

  // the bird has x fixed 50px from the left, and y should be in the center of the screen
  // add a ref to the gameplay screen to calculate the height
  const screenRef = useRef(null);
  const [birdY, setBirdY] = useState("50%");

  // ref for the animation
  const animationRef = useRef(null);

  // counter for the number of obstacles passed
  const [score, setScore] = useState(0);


  useEffect(() => {
    if (stage === STAGES.PRESTART) {
      if (screenRef.current) {
        // set half height of the screen, also consider the bird size
        const screenHeight = screenRef.current.clientHeight;
        const height = screenHeight / 2 - BIRD_SIZE / 2;
        setBirdY(height);
      }
    }
  }, [screenRef]);

  useEffect (() => {
    if (stage === STAGES.PRESTART) {
      const checkSpaceKey = (e) => {
        if (e.code === "Space") {
          startGame();
        }
      };

      window.addEventListener("keydown", checkSpaceKey);
      return () => window.removeEventListener("keydown", checkSpaceKey);
    } else if (stage === STAGES.PLAY) {
      // press SPACE to jump the bird
      const checkSpaceKey = (e) => {
        if (e.code === "Space") {
          jumpBird();
        }
      }

      window.addEventListener("keydown", checkSpaceKey);
      return () => window.removeEventListener("keydown", checkSpaceKey);
    }
  }, [stage]);

  const jumpBird = () => {
    // move the bird up by 30px
    setBirdY((prev) => {
      // cannot jump over the top 0
      const newY = Math.max(0, prev - JUMP_HEIGHT);
      return newY;
    });
  };

  // every animation, the bird is fall by 3px
  useEffect(() => {
    if (stage === STAGES.PLAY) {
      // animation: bird drop by 3px per frame
      const animate = () => {
        setBirdY((prev) => {
          // cannot fall below the bottom of the screen
          const newHeight = prev + FALL_SPEED;
          const threshold = screenRef.current.clientHeight - BIRD_SIZE / 2;

          if (newHeight >= threshold) {
            setStage(STAGES.OVER);
            return threshold;
          } else {
            return newHeight;
          }
        });

        // request the next frame
        animationRef.current = requestAnimationFrame(animate);
      };

      // requestAnimationFrame
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [stage]);

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center"
      onClick={() => {
        if (stage === STAGES.PRESTART) {
          startGame();
        } else if (stage === STAGES.PLAY) {
          // jump the bird by 30 px
          jumpBird();
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
        ref={screenRef}
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
            top: `${birdY}px`,
          }}
        />
        {/* show the score */}
        {stage === STAGES.PLAY && (
          <div
            className="absolute top-3 left-3 text-xl"
          >
            {`Score: ${score}`}
          </div>
        )}
      </div>
    </div>
  );
}
