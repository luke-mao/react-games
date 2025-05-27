import { useModal } from "@/hook/useModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STAGES = {
  PLAYING: "playing",
  ANIMATION: "animation",
  OVER: "over",
};

export default function Connect4() {
  const { openModal } = useModal();
  const navigate = useNavigate();

  // game board: create a 10 * 10 array of null
  // each subarray is a column, then deconstruct to rows
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

  const initialGame = {
    board: initialBoard,
    player: 1,
    stage: STAGES.PLAYING,
    winner: null,
    // for simplicity, just count the moves for player 1
    moves: 0,
  };

  const [game, setGame] = useState(initialGame);

  // when the game is over, show the animation
  const [animationColor, setAnimationColor] = useState("");

  // insert coin to the bottom of the column
  const insertCoin = (colIndex) => {
    // only when it is playing
    if (game.stage !== STAGES.PLAYING) return;

    // check if that column is full, then return
    if (game.board[colIndex][0] != null) return;

    // find the first empty cell from the bottom of the column
    const rowIndex = game.board[colIndex].lastIndexOf(null);

    // make a new copy of the board
    const newBoard = game.board.map((column, index) => {
      if (index === colIndex) {
        // insert the coin in the first empty cell
        const newColumn = [...column];
        newColumn[rowIndex] = game.player;
        return newColumn;
      }
      return column;
    });

    // now switch the player
    const newPlayer = game.player === 1 ? 2 : 1;

    // create the new game
    const newGame = {
      board: newBoard,
      player: newPlayer,
      stage: STAGES.PLAYING,
      winner: null,
      moves: game.player === 1 ? game.moves + 1 : game.moves,
    };

    setGame(newGame);
  };

  // check on the board for 4 horizontal, 4 vertical, 4 diagonal
  const isThisPlayerWin = (board, player) => {
    // check horizontal
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[col].length - 3; row++) {
        const isWin = board[col][row] === player &&
          board[col + 1][row] === player &&
          board[col + 2][row] === player &&
          board[col + 3][row] === player;
        
        if (isWin) return true;
      }
    }

    // check vertical
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[col].length - 3; row++) {
        const isWin = board[col][row] === player &&
          board[col][row + 1] === player &&
          board[col][row + 2] === player &&
          board[col][row + 3] === player;
        
        if (isWin) return true;
      }
    }

    // check diagonal
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[col].length; row++) {
        const isWin = board[col][row] === player && 
          col + 1 < board.length && row + 1 < board[col + 1].length && board[col + 1][row + 1] === player &&
          col + 2 < board.length && row + 2 < board[col + 2].length && board[col + 2][row + 2] === player &&
          col + 3 < board.length && row + 3 < board[col + 3].length && board[col + 3][row + 3] === player;
        if (isWin) return true;
      }
    }

    // check the other diagonal (from top right to bottom left)
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[col].length; row++) {
        const isWin = board[col][row] === player && 
          col - 1 < board.length && row + 1 >= 0 && board[col - 1][row + 1] === player &&
          col - 2 < board.length && row + 2 >= 0 && board[col - 2][row + 2] === player &&
          col - 3 < board.length && row + 3 >= 0 && board[col - 3][row + 3] === player;

        if (isWin) return true;
      }
    }

    return false;
  };

  // check if the game is over
  useEffect(() => {
    if (game.stage === STAGES.PLAYING) {
      // require the previous player
      if (isThisPlayerWin(game.board, game.player === 1 ? 2 : 1)) {
        // set the game stage to animation
        setGame((prevGame) => ({
          ...prevGame,
          stage: STAGES.ANIMATION,
          winner: game.player === 1 ? 2 : 1,
        }));

        // start the animation
        startAnimation();
      }
    }
  }, [game]);

  const startAnimation = () => {
    let count = 0;

    const interval = setInterval(() => {
      setAnimationColor((prev) => prev === "bg-[#ccc]" ? "bg-[#000]" : "bg-[#ccc]");
      count++;

      if (count === 6) {
        clearInterval(interval);

        // set game over
        setGame((prev) => ({
          ...prev,
          stage: STAGES.OVER,
        }));

        // change back to no color
        setAnimationColor("");
      }
    }, 500);

    return () => clearInterval(interval);
  };

  // when the game is over, show the modal
  useEffect(() => {
    if (game.stage === STAGES.OVER) {
      const title = game.winner ? `Player ${game.winner} wins!` : "It's a draw!";
      const description = `A total of ${game.moves} moves were made.`;
      const onClose = () => navigate("/home");
      openModal(title, description, onClose);
    }
  }, [game]);

  return (
    <div className="w-full h-full flex flex-row">
      {game.board.map((column, colIndex) => (
        <div
          key={`column-${colIndex}`}
          className="flex flex-col w-1/10 h-full"
          onClick={() => insertCoin(colIndex)}
        >
          {column.map((cell, rowIndex) => (
            <div
              key={`cell-${colIndex}-${rowIndex}`}
              className={`flex items-center justify-center w-full h-1/10 border-[1px] border-solid border-[#333] ${animationColor}`}
            >
              {cell && (
                <div
                  className={`w-[95%] aspect-square rounded-full ${cell === 1 ? "bg-blue-500" : "bg-red-500"}`}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
