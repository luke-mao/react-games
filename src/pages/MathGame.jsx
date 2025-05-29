import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MathGame() {
  // get random number between 1 and 50 inclusive
  const getNumber = () => Math.floor(Math.random() * 50) + 1;

  // choose random operator
  const operators = ["+", "-", "*", "/", "%"];
  const getOperator = () => operators[Math.floor(Math.random() * operators.length)];

  // random integer from 1 to 50, inclusive
  const [number1, setNumber1] = useState(getNumber());
  const [number2, setNumber2] = useState(getNumber());

  // choose random operator from + - * / %
  const [operator, setOperator] = useState(getOperator());

  // and set the answer: number1 operator number2
  const getAnswer = () => {
    if (operator === "+") {
      return number1 + number2;
    } else if (operator === "-") {
      return number1 - number2;
    } else if (operator === "*") {
      return number1 * number2;
    } else if (operator === "/") {
      // if it is integer result, return integer, 
      // else, retrun in 1 decimal place
      const result = number1 / number2;
      if (result % 1 === 0) {
        return result;
      } else {
        return result.toFixed(1);
      }
    } else if (operator === "%") {
      return number1 % number2;
    }
  };

  // user input 
  const [userInput, setUserInput] = useState("");

  const resetGame = () => {
    // set everything again
    setNumber1(getNumber());
    setNumber2(getNumber());
    setOperator(getOperator());

    // clear user input
    setUserInput("");
  };

  useEffect(() => {
    // userInput is a string, and the getAnswer is a number,
    // convert both to string and compare
    if (userInput === getAnswer().toString()) {
      // let the browser paint the screen first
      setTimeout(() => {
        alert("Correct!");
        resetGame();
      }, 100);
    }
  }, [userInput]);

  const style = "w-1/5 h-[40%] text-6xl text-[#333] bg-gradient-to-r from-[#abcabc] to-[#cbacbd] flex items-center justify-center";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      {/* 1 row: number1 operator number2 = XXX */}
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className={style}>{number1}</div>
        <div className={style}>{operator}</div>
        <div className={style}>{number2}</div>
        <div className={style}> = </div>
        <div className={style}>
          <Input
            className="!text-6xl h-fit text-center"
            type="number"
            placeholder="??"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="secondary"
        className="w-fit cursor-pointer relative bottom-[25%]"
        onClick={resetGame}
      >
        Reset
      </Button>
    </div>
  );
}
