import { useModal } from '@/hook/useModal';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Tictac() {
  // call the modal
  const { openModal } = useModal();
  const navigate = useNavigate();

  // 3 * 3 matrix for the layout, here for convenience use an array of 9 null values
  const emptyMatrix = Array(9).fill(null);

  const [matrix, setMatrix] = useState(emptyMatrix);
  const [isPlayer1Move, setIsPlayer1Move] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  
  // use the index to check the border status of the cell
  const borderStatus = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    const borderTop = row === 0 ? 'border-t-0' : 'border-t-2';
    const borderBottom = row === 2 ? 'border-b-0' : 'border-b-2';
    const borderLeft = col === 0 ? 'border-l-0' : 'border-l-2';
    const borderRight = col === 2 ? 'border-r-0' : 'border-r-2';

    return `${borderTop} ${borderBottom} ${borderLeft} ${borderRight}`;
  }

  // check the background color of this cell
  const cellBackground = (index) => {
    if (matrix[index] === 1) {
      return 'bg-[rgb(255,220,220)]';
    } else if (matrix[index] === 2) {
      return 'bg-[rgb(220,220,255)]';
    } else {
      return 'bg-transparent';
    }
  }

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
        setWinner(matrix[x]);

        // when the game is over, call the modal
        const title = matrix[x] === 1 ? 'Player 1 wins!' : 'Player 2 wins!';
        const content = `A total of X moves were complete`;
        const onClose = () => navigate('/home');
        openModal(title, content, onClose);

        return;
      }
    }

    // and check if all cells are filled, if so, no one wins
    if (matrix.every(cell => cell !== null)) {
      setIsGameOver(true);
      setWinner(null);

      // no one wins
      const title = 'No one wins!';
      const content = `A total of X moves were complete`;
      const onClose = () => navigate('/home');
      openModal(title, content, onClose);
      return;
    }
  }




  return (
    <div className="w-full h-full flex flex-row flex-wrap">
      {matrix.map((value, index) => (
        <div
          key={index}
          className={`cursor-pointer w-1/3 h-1/3 flex items-center justicy-center border-2 border-[#333] ${borderStatus(index)} ${cellBackground(index)}`}
          onClick={() => onClickCell(index)}
        />
      ))}
    </div>
  )
}
