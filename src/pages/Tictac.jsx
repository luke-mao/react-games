import { useModal } from "@/hook/useModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tictac() {
  // call the modal
  const { openModal } = useModal();
  const navigate = useNavigate();

  // number of moves to record
  const [moves, setMoves] = useState(0);

  // 3 * 3 matrix for the layout, here for convenience use an array of 9 null values
  const emptyMatrix = Array(9).fill(null);

  const [matrix, setMatrix] = useState(emptyMatrix);
  const [isPlayer1Move, setIsPlayer1Move] = useState(true);

  // when the game is over, needs to check the animation status
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimation, setIsAnimation] = useState(false);
  const [isAnimationWhiteBackground, setIsAnimationWhiteBackground] = useState(false);
  
  // use the index to check the border status of the cell
  const borderStatus = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    const borderTop = row === 0 ? "border-t-0" : "border-t-2";
    const borderBottom = row === 2 ? "border-b-0" : "border-b-2";
    const borderLeft = col === 0 ? "border-l-0" : "border-l-2";
    const borderRight = col === 2 ? "border-r-0" : "border-r-2";

    return `${borderTop} ${borderBottom} ${borderLeft} ${borderRight}`;
  };

  // check the background color of this cell.
  const cellBackground = (index) => {
    // when it is animation, switch between #fff and #000
    if (isAnimation) {
      return isAnimationWhiteBackground ? "bg-[#fff]" : "bg-[#000]";
    } else {
      // when it is player1;s turn, all the non-filled squares on the board have bg rgb(255, 220, 220).
      // when it is player2's turn, all the non-filled squares on the board have bg rgb(220, 220, 255).
      if (matrix[index] === 1) {
        return "";
      } else if (matrix[index] === 2) {
        return "";
      } else {
        console.log("isPlayer1Move", isPlayer1Move);
        return isPlayer1Move ? "bg-[rgb(255,220,220)]" : "bg-[rgb(220,220,255)]";
      }
    }
  };

  // on click for the cell
  const onClickCell = (index) => {
    // if this cell already filled (1, 2), ignore
    if (matrix[index] !== null || isGameOver) {
      return;
    }

    // copy the existing matrix and set the cell
    const newMatrix = [...matrix];
    newMatrix[index] = isPlayer1Move ? 1 : 2;

    // now the next player
    setIsPlayer1Move(!isPlayer1Move);
    setMatrix(newMatrix);

    // when it is the player 1, increase the moves
    if (isPlayer1Move) {
      setMoves(prev => prev + 1);
    }

    // and check if the game is over
    gameOverCheck(newMatrix);
  };

  // check if the game is over
  const gameOverCheck = (matrix) => {
    // layout index:
    // [[0, 1, 2]]
    // [[3, 4, 5]]
    // [[6, 7, 8]]
    // so there are horizontal (3), vertical (3), and diagonal (2) ways to win
    const winningCombs = [
      // horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const [x, y, z] of winningCombs) {
      if (matrix[x] && matrix[x] === matrix[y] && matrix[x] === matrix[z]) {
        setIsGameOver(true);

        // prepare the modal
        const title = `Player ${matrix[x] === 1 ? "1" : "2"} wins!`;
        const content = `A total of ${moves} moves (player1) were completed.`;
        const onClose = () => navigate("/home");
        const modalCallBack = () => openModal(title, content, onClose);

        // start the animation
        startAnimation(modalCallBack);

        return;
      }
    }

    // and check if all cells are filled, if so, no one wins
    if (matrix.every(cell => cell !== null)) {
      setIsGameOver(true);

      // prepare the modal
      const title = "No one wins";
      const content = `A total of ${moves} moves (player1) were completed.`;
      const onClose = () => navigate("/home");
      const modalCallBack = () => openModal(title, content, onClose);

      // start the animation
      startAnimation(modalCallBack);
      return;
    }
  };

  const startAnimation = (modalCallBack) => {
    setIsAnimation(true);
    
    let count = 0;
    const interval = setInterval(() => {
      setIsAnimationWhiteBackground(prev => !prev);
      count++;
      
      // when it 6 times, stop
      if (count === 6) {
        clearInterval(interval);
        setIsAnimation(false);
        modalCallBack();
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  };

  return (
    <div className="w-full h-full flex flex-row flex-wrap">
      {matrix.map((value, index) => (
        <div
          key={index}
          className={`cursor-pointer w-1/3 h-1/3 flex items-center justify-center text-[3em] font-bold border-2 border-[#333] ${borderStatus(index)} ${cellBackground(index)}`}
          onClick={() => onClickCell(index)}
        >
          {value === 1 ? "X" : value === 2 ? "O" : ""}
        </div>
      ))}
    </div>
  );
}
