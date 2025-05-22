import React, { useState } from "react";

export default function Snek() {
  // 10 * 10 board
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

  // get initial board: the snake is on the top left with length 2, and initial direction is down
  // i.e. snake is at (0, 0) and (0, 1)
  const getInitialBoard = () => {
    const board = initialBoard.map((row) => row.slice());
    board[0][0] = "s";
    board[0][1] = "s";

    // add food to the board
    const boardWithFood = addFood(board);

    // return the board
    return boardWithFood;
  };

  // add a random food to the board
  const addFood = (board) => {
    while (true) {
      // get a random position, if it is empty, add food
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);

      if (board[row][col] === null) {
        board[row][col] = "f";
        break;
      }
    }

    return board;
  }

  const [board, setBoard] = useState(getInitialBoard());
  const [snakeDirection, setSnakeDirection] = useState("down");
  const [headCoor, setHeadCoor] = useState({ row: 0, col: 0 });


  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // move the snake every 500ms
  const moveSnake = () => {
    const newBoard = [...board.map((row) => row.slice())];
    const newHeadCoor = { ...headCoor };

    // move the snake
    if (snakeDirection === "down") {
      newHeadCoor.row += 1;
    } else if (snakeDirection === "up") {
      newHeadCoor.row -= 1;
    } else if (snakeDirection === "left") {
      newHeadCoor.col -= 1;
    } else if (snakeDirection === "right") {
      newHeadCoor.col += 1;
    }

    // check if the snake head coordinate is invalid
    if (newHeadCoor.row < 0 || newHeadCoor.row >= 10 || newHeadCoor.col < 0 || newHeadCoor.col >= 10) {
      setIsGameOver(true);
      setIsWin(false);
      return;
    }

    // check if the snake head coordinate is on the same position as one part of its body
    if (newBoard[newHeadCoor.row][newHeadCoor.col] === "s") {
      setIsGameOver(true);
      setIsWin(false);
      return;
    }

    // check if the new head position is food
    const addSnakeLength = newBoard[newHeadCoor.row][newHeadCoor.col] === "f";

    // now move the snake
    

  }






  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((cell, colIndex) => (
              <div
                className={`w-[20px] h-[20px] border border-solid border-[#000] ${cell === "s" ? "bg-[#999]" : cell === "f" ? "bg-[#252525]" : "" }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
