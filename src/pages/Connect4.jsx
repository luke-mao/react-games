import React, { useState } from 'react'

const STAGES = {
  PLAYING: "playing",
  ANIMATION: "animation",
  OVER: "over",
};


export default function Connect4() {
  // game board: create a 10 * 10 array of null
  // each subarray is a column, then deconstruct to rows
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

  const initialGame = {
    board: initialBoard,
    player: 1,
    stage: STAGES.PLAYING,
    winner: null,
  }

  const [game, setGame] = useState(initialGame);

  // insert coin to the bottom of the column
  const insertCoin = (colIndex) => {
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
    };

    setGame(newGame);
  }

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
              className="flex items-center justify-center w-full h-1/10 border-[1px] border-solid border-[#333]"
            >
              {cell && (
                <div
                  className={`w-[95%] aspect-square rounded-full ${cell === 1 ? 'bg-blue-500' : 'bg-red-500'}`}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
