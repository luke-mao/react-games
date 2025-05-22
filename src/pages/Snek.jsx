import React, { useState, useEffect } from "react";

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

  // put the game attributes into a single variable
  const initialGame = {
    board: getInitialBoard(),
    snake: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ],
    snakeDirection: "down",
    isGameOver: false,
    isWin: false,
  }

  const [game, setGame] = useState(initialGame);

  // move the snake every 500ms
  const moveSnake = (prevGame) => {
    // destructure the game object
    const { board, snake, snakeDirection, isGameOver, isWin } = prevGame;

    console.log("move snake");

    // get the first coordinate of the snake
    const head = { row: snake[0].row, col: snake[0].col };
    console.log("line 56", head);

    // base on the direction, move the head
    if (snakeDirection === "down") {
      head.row += 1;
    } else if (snakeDirection === "up") {
      head.row -= 1;
    } else if (snakeDirection === "left") {
      head.col -= 1;
    } else if (snakeDirection === "right") {
      head.col += 1;
    }

    console.log("line 69", head);

    // check if the head touches the wall, or the snake body
    const isFail = 
      head.row < 0 ||
      head.row >= 10 ||
      head.col < 0 ||
      head.col >= 10 ||
      snake.slice(0, snake.length - 1).some((s) => s.row === head.row && s.col === head.col);
    
    console.log("isFail", isFail);

    if (isFail) {
      const resultGame = {
        ...prevGame,
        isGameOver: true,
      }

      return resultGame;
    }

    // keep the snake tail coordinate
    const tail = { row: snake[snake.length - 1].row, col: snake[snake.length - 1].col };

    // make the new snake body
    const newSnake = [head, ...snake.slice(0, snake.length - 1)];

    // make an empty board
    const newBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

    // fill the board with the snake body
    newSnake.forEach((s) => {
      newBoard[s.row][s.col] = "s";
    });
      
    // check if the head touches the food, if yes, then snake body length + 1 (from the tail), and add the new food
    const touchFood = board[head.row][head.col] === "f";

    if (touchFood) {
      // add the tail to the snake body
      newSnake.push(tail);
      newBoard[tail.row][tail.col] = "s";

      // add new food to the board
      const newBoardWithFood = addFood(newBoard);
      
      // set the new game
      const resultGame = {
        ...prevGame,
        board: newBoardWithFood,
        snake: newSnake,
      };

      return resultGame;
    } else {
      // find the existing food row and column
      let foodRow = -1;
      let foodCol = -1;

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (board[i][j] === "f") {
            foodRow = i;
            foodCol = j;
            break;
          }
        }
      }

      // add the food to the board
      newBoard[foodRow][foodCol] = "f";

      // set the new game
      const resultGame = {
        ...prevGame,
        board: newBoard,
        snake: newSnake,
      };

      return resultGame;
    }
  };

  // useEffect to move the snake every 0.5 second
  useEffect(() => {
    if (game.isGameOver) return;

    const interval = setInterval(() => {
      setGame((prevGame) => moveSnake(prevGame));
    }, 500);

    return () => clearInterval(interval);
  }, [game.isGameOver]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col">
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-[20px] h-[20px] border border-solid border-[#000] ${cell === "s" ? "bg-[#999]" : cell === "f" ? "bg-[#252525]" : "" }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
