import React, { useEffect, useRef, useState } from "react";
import Bird from "@/assets/bird.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

const STAGES = {
  PRESTART: "prestart",
  PLAY: "play",
  OVER: "over",
};

const BIRD_SIZE = 20;
const BIRD_X = 50;
const JUMP_HEIGHT = 30;

// each frame the bird fall by 3px
const FALL_SPEED = 0.5;

// obstacle column minimum height is 10px
const OBSTACLE_MIN_HEIGHT = 10;
const OBSTACLE_WIDTH = 70;

// the gap between the top and bottom obstacles
const OBSTACLE_GAP = 160; 

// when the rightmost obstacle is outside the boundary to the right screen boundary,
// create a new obstacle
const OBSTACLE_THRESHOLD = 200 + OBSTACLE_WIDTH;

// obstacle moves by 3px per frame
const OBSTACLE_SPEED = 2;

export default function FlappyBird() {
  const navigate = useNavigate();

  const [stage, setStage] = useState(STAGES.PRESTART);

  // when the stage is PRESTART, the user hit the space key to start the game
  const startGame = () => setStage(STAGES.PLAY);

  // the bird has x fixed 50px from the left, and y should be in the center of the screen
  // add a ref to the gameplay screen to calculate the height
  const screenRef = useRef(null);
  const isSmallScreen = window.innerWidth < 500;

  const [birdY, setBirdY] = useState(0);

  // the birdYRef
  const birdYRef = useRef(birdY);

  // track the bird's Y position for use in the animation
  useEffect(() => {
    birdYRef.current = birdY;
  }, [birdY]);

  // ref for the animation
  const animationRef = useRef(null);

  // counter for the number of obstacles passed
  const [scoreIds, setScoreIds] = useState([]);
  const scoreIdsRef = useRef(scoreIds);

  useEffect(() => {
    scoreIdsRef.current = scoreIds;
  }, [scoreIds]);

  // a list of obstacles, record the left bottom corner of the top obstacle.
  // the matching bottom obstacle has same left coordinate, and a gap of 150px
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    if (stage === STAGES.PRESTART) {
      if (screenRef.current) {
        // set half height of the screen, also consider the bird size
        const screenHeight = screenRef.current.clientHeight;
        const height = screenHeight / 2 - BIRD_SIZE / 2;
        setBirdY(height);

        // set the first obstacle
        const threshold = screenHeight - OBSTACLE_GAP - OBSTACLE_MIN_HEIGHT;
        const newObstacle = {
          left: screenRef.current.clientWidth - OBSTACLE_WIDTH - OBSTACLE_WIDTH,
          top: Math.floor(Math.random() * (threshold - OBSTACLE_MIN_HEIGHT)) + OBSTACLE_MIN_HEIGHT,
          id: nanoid(),
        };

        setObstacles([newObstacle]);

        // clear the scores
        setScoreIds([]);
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
      };

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
        // use the ref to mark the position, so that the setObstacles can use it.
        let nextBirdY = birdYRef.current + FALL_SPEED;
        const threshold = screenRef.current.clientHeight - BIRD_SIZE / 2;

        if (nextBirdY >= threshold) {
          setStage(STAGES.OVER);
          nextBirdY = threshold;
          return;
        }

        birdYRef.current = nextBirdY;
        setBirdY(nextBirdY);

        // move the obstacles
        setObstacles((prevObstacles) => {
          const newObstacles = [];

          prevObstacles.forEach((ob) => {
            const newOb = { ...ob };

            const newLeft = newOb.left - (isSmallScreen ? OBSTACLE_SPEED * 0.5 : OBSTACLE_SPEED);

            // if left + OBSTACLE_WIDTH < bird X, then the bird has passed, and increase the score
            if (newLeft + OBSTACLE_WIDTH < BIRD_X && !scoreIdsRef.current.includes(newOb.id)) {
              // prevnet counting again
              setScoreIds((prevIds) => [...prevIds, newOb.id]);
            }

            // if the new left is still within the screen, then keep it
            if (newLeft > -OBSTACLE_WIDTH) {
              newObstacles.push({
                ...newOb,
                left: newLeft,
                scored: newOb.scored,
              });
            }
          });

          // if the last obstacle is too far away (exceed the threshold), 
          // then create a new obstacle
          const lastObstacle = newObstacles[newObstacles.length - 1];
          if (lastObstacle.left < screenRef.current.clientWidth - OBSTACLE_THRESHOLD) {
            // create a new obstacle
            const threshold = screenRef.current.clientHeight - OBSTACLE_GAP - OBSTACLE_MIN_HEIGHT;
            const newObstacle = {
              left: screenRef.current.clientWidth - OBSTACLE_WIDTH,
              top: Math.floor(Math.random() * (threshold - OBSTACLE_MIN_HEIGHT)) + OBSTACLE_MIN_HEIGHT,
              id: nanoid(),
            };

            newObstacles.push(newObstacle);
          }

          // check if the bird hits any obstacle
          newObstacles.forEach((ob) => {
            // the bird X is always 50px from the left,
            // when bird.X is at [ob.left, ob.left + OBSTACLE_WIDTH], then it is in the range
            const isCollide = ob.left <= BIRD_X + BIRD_SIZE && ob.left + OBSTACLE_WIDTH >= BIRD_X + BIRD_SIZE 
              && (birdYRef.current <= ob.top || birdYRef.current >= ob.top + OBSTACLE_GAP);
            
            if (isCollide) {
              setStage(STAGES.OVER);
            }
          });

          return newObstacles;
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
      className="relative w-full h-full flex flex-col items-center justify-center gap-3"
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
        <div className="text-center">
          <div className="text-xl">Welcome to Flappy Bird!</div>
          <div className="text-xl">Get a score of 3 to win!</div>
        </div>
      )}
      {/* the gameplay screen */}
      <div
        ref={screenRef}
        className="
          relative 
          w-[95%] h-[550px] 
          sm:w-[600px] sm:h-[400px] 
          bg-[#eee]
          rounded
          flex items-center justify-center
        "
      >
        {/* show the text only in prestart stage */}
        {stage === STAGES.PRESTART && (
          <div className="text-xl" style={{ zIndex: 20 }}>
            Hit space or click to begin
          </div>
        )}
        {/* show the bird */}
        {stage !== STAGES.OVER && (
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
              // set the z-index to be the top
              zIndex: 10,
            }}
          />
        )}
        {/* show the score */}
        {stage === STAGES.PLAY && (
          <div
            className="absolute top-3 left-3 text-xl"
          >
            {/* find the number of unique strings in the scoredIds */}
            {`Score: ${new Set(scoreIdsRef.current).size}`}
          </div>
        )}
        {/* obstacles, each one has a top and bottom pair */}
        {stage !== STAGES.OVER && obstacles.map((obstacle, index) => (
          <div
            key={`obstacle-${index}`}
          >
            {/* top one */}
            <div
              key={`top-${index}`}
              style={{
                width: obstacle.left >= 0 ? `${OBSTACLE_WIDTH}px` : `${OBSTACLE_WIDTH + obstacle.left}px`,
                height: `${obstacle.top}px`,
                top: 0,
                left: obstacle.left >= 0 ? `${obstacle.left}px` : "0px",
                position: "absolute",
                backgroundColor: "#027402",
              }}
            />
            {/* bottom one */}
            <div
              key={`bottom-${index}`}
              style={{
                width: obstacle.left >= 0 ? `${OBSTACLE_WIDTH}px` : `${OBSTACLE_WIDTH + obstacle.left}px`,
                height: `${screenRef.current.clientHeight - obstacle.top - OBSTACLE_GAP}px`,
                top: `${obstacle.top + OBSTACLE_GAP}px`,
                left: obstacle.left >= 0 ? `${obstacle.left}px` : "0px",
                position: "absolute",
                backgroundColor: "#027402",
              }}
            />
          </div>
        ))}
        {/* show the game over text */}
        {stage === STAGES.OVER && (
          <div className="text-xl flex flex-col items-center justify-center gap-3">
            <div>{`Score: ${new Set(scoreIdsRef.current).size}`}</div>
            <div>Game Over</div>
            <div>
              {new Set(scoreIdsRef.current).size >= 3
                ? "You win!"
                : "You lose! Try again!"}
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/home")}
              className="mt-2 cursor-pointer"
            >
              Return
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
