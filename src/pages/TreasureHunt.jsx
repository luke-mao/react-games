import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STAGES = {
  PRESTART: "prestart",
  PLAY: "play",
  RESULT: "result",
};

export default function TreasureHunt() {
  const navigate = useNavigate();

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

    // generate the random coordinates x and y in 0 - 100 for the coins
    // 2 * goalCoins number, the first half are the real coins, the second half are the fake coins
    const realCoins = Array.from({ length: goalCoins }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      isReal: true,
      clicked: false,
    }));

    const fakeCoins = Array.from({ length: goalCoins }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      isReal: false,
      clicked: false,
    }));

    // set states
    setTimeLimit(seconds);
    setGoalCoins(goal);
    setStage(STAGES.PLAY);

    setCoins([...realCoins, ...fakeCoins]);
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
  }

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
        })
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [stage]);


  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center"
      onClick={() => {
        if (stage === STAGES.RESULT) {
          navigate("/home");
        }
      }}
    >
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
          <div>
            {remainingCoins <= 0 ? "You Win!" : "You Lose!"}
          </div>
          <div>
            Click anywhere to return.
          </div>
        </div>
      )}
    </div>
  );
}
