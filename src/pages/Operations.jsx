import { Button } from '@/components/ui/button';
import { useModal } from '@/hook/useModal';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Operations() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const operators = ['+', '-', '*', '/'];

  const getData = () => {
    // get a random number between 1 and 10
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    // choose operator from + - * /
    const operator = operators[Math.floor(Math.random() * operators.length)];

    // calculate the result
    let result;
    if (operator === '+') {
      result = num1 + num2;
    } else if (operator === '-') {
      result = num1 - num2;
    } else if (operator === '*') {
      result = num1 * num2;
    } else if (operator === '/') {
      result = Math.round(num1 / num2 * 100) / 100;
    }

    // return the data
    return {
      num1,
      num2,
      operator,
      result,
    }
  };

  // the game data
  const [game, setGame] = useState(getData());

  // reset the game
  const resetGame = () => setGame(getData());

  const submitAnswer = (op) => {
    if (op === game.operator) {
      // onClose => another game, onNo => navigate to home
      openModal(
        "Correct!",
        "Would you like to play another game?",
        () => resetGame(),
        "yesno",
        () => navigate('/')
      )
    } else {
      // onClose => another game, onNo => navigate to home
      openModal(
        "Wrong!",
        `The correct answer is ${game.operator}`,
        () => resetGame(),
        "yesno",
        () => navigate('/')
      )
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-15">
      <div className="w-full flex flex-row items-center justify-center">
        <div className="w-1/5 text-6xl flex items-center justify-center">{game.num1}</div>
        <div className="w-1/5 text-6xl flex flex-row flex-wrap items-center justify-center gap-3">
          {operators.map((op, index) => (
            <Button
              key={op}
              variant="outline" 
              className="w-[40%] h-auto flex items-center justify-center cursor-pointer text-6xl aspect-square"
              onClick={() => submitAnswer(op)}
            >
              {op}
            </Button>
          ))}
        </div>
        <div className="w-1/5 text-6xl flex items-center justify-center">{game.num2}</div>
        <div className="w-1/5 text-6xl flex items-center justify-center">=</div>
        <div className="w-1/5 text-6xl flex items-center justify-center">{game.result}</div>
      </div>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={resetGame}
      >
        Reset
      </Button>
    </div>
  )
}
