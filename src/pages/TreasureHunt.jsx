import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STAGES = {
  PRESTART: "prestart",
  PLAY: "play",
  RESULT: "result",
};

const getCoins = (goal, width, height) => {
  // get the distance in px between two {x, y} coordinates
  const distance = (coor1, coor2) => {
    // x * width / 100, y * height / 100
    const x1 = coor1.x * width / 100;
    const y1 = coor1.y * height / 100;
    const x2 = coor2.x * width / 100;
    const y2 = coor2.y * height / 100;

    const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return d;
  };

  // is very overlap: 30px is the diameter, so two center points should be at least 25px apart
  const isVeryOverlap = (coor, coins) => {
    return coins.some(coin => {
      return distance(coor, coin) < 25; // 30px diameter, so 25px apart
    });
  };

  let coins = [];

  // first generate real coins
  for (let i = 0; i < goal; i++) {
    let coor;

    do {
      coor = {
        x: Math.floor(Math.random() * 90) + 5, // between 5% and 95%
        y: Math.floor(Math.random() * 90) + 5, // between 5% and 95%
        isReal: true,
        clicked: false,
      };
    } while (coins.length != 0 && isVeryOverlap(coor, coins));

    coins.push(coor);
  }

  // then generate fake coins
  for (let i = 0; i < goal; i++) {
    let coor;

    do {
      coor = {
        x: Math.floor(Math.random() * 90) + 5, // between 5% and 95%
        y: Math.floor(Math.random() * 90) + 5, // between 5% and 95%
        isReal: false,
        clicked: false,
      };
    } while (isVeryOverlap(coor, coins));
    
    coins.push(coor);
  }

  return coins;
};

export default function TreasureHunt() {
  const navigate = useNavigate();

  // mark the container, so that I can get the height and width
  const containerRef = useRef(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  // track the container
  useEffect(() => {
    // watch for the resize
    const handleResize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    if (containerRef.current) {
      setSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // the game settings
  const [stage, setStage] = useState(STAGES.PRESTART);
  const [timeLimit, setTimeLimit] = useState(10);
  const [goalCoins, setGoalCoins] = useState(5);

  // the coordinates of the coins
  const [coins, setCoins] = useState([]);

  // timer and the remaining coins
  const [timer, setTimer] = useState(0);
  const [remainingCoins, setRemainingCoins] = useState(0);

  const startGame = () => {
    const seconds = parseInt(timeLimit, 10);
    const goal = parseInt(goalCoins, 10);

    // generate the coins without excessive overlapping
    const newCoins = getCoins(goal, size.width, size.height);

    // set states
    setTimeLimit(seconds);
    setGoalCoins(goal);
    setStage(STAGES.PLAY);

    setCoins(newCoins);
    setTimer(seconds);
    setRemainingCoins(goal);
  };

  const clickCoin = (index) => {
    const thisCoin = { ...coins[index] };
    thisCoin.clicked = true;
    
    const newCoins = [...coins];
    newCoins[index] = thisCoin;

    setCoins(newCoins);

    if (thisCoin.isReal) {
      setRemainingCoins(prev => prev - 1);

      // if remaining == 0, then switch to the reuslt stage immediately
      if (remainingCoins - 1 <= 0) {
        // allow time for display
        setTimeout(() => {
          setStage(STAGES.RESULT);
        }, 150);
      }
    }
  };

  // when the game stage is in the play, reduce the timer every second
  useEffect(() => {
    if (stage === STAGES.PLAY) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev == 0) {
            clearInterval(interval);
            setStage(STAGES.RESULT);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [stage]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center">
      {stage === STAGES.PRESTART && (
        <div className="flex flex-col items-center justify-center gap-5 min-w-[400px]">
          <div className="text-1xl font-bold">Welcome to Treasure Hunt!</div>
          <div className="flex flex-row gap-5">
            <div className="w-[100px]">Time Limit (seconds)</div>
            <Input
              type="number"
              placeholder="Time Limit (seconds)"
              className="text-center w-[200px]"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-5">
            <div className="w-[100px]">Goal Coins</div>
            <Input
              type="number"
              placeholder="Goal Coins"
              className="text-center w-[200px]"
              value={goalCoins}
              onChange={(e) => setGoalCoins(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={startGame}
          >
            START
          </Button>
        </div>
      )}
      {/* display the coins for user click */}
      {stage === STAGES.PLAY && (
        <div className="w-full h-full relative">
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            <div>{`Countdown: ${timer}s`}</div>
            <div>{`Remaining Coins: ${remainingCoins}`}</div>
          </div>
          {coins.map((coin, index) => (
            <div
              key={index}
              style={{
                top: `${coin.y}%`,
                left: `${coin.x}%`,
              }}
              className={`absolute w-[30px] h-[30px] rounded-full cursor-pointer ${coin.clicked ? coin.isReal ? "bg-[yellow] border-3" : "bg-[brown]" : "bg-black"}`}
              onClick={() => clickCoin(index)}
            />
          ))}
        </div>
      )}
      {/* display the results in the center */}
      {stage === STAGES.RESULT && (
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="text-xl">
            {remainingCoins <= 0 ? "You Win!" : "You Lose!"}
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Return
          </Button>
        </div>
      )}
    </div>
  );
}
