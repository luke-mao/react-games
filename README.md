# React Games

[![Live Demo](https://img.shields.io/badge/Demo-reactgames.lukemao.site-green?logo=vercel)](https://reactgames.lukemao.site)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-blue?logo=tailwindcss)](https://tailwindcss.com/)



## 1. Introduction

This repository features a collection of simple web games, each built as a single-page application (SPA) using React. The project focuses on practicing and strengthening core front-end development skills, including component-based design, state management, responsive layouts, user interaction handling, and the use of modern React hooks. These classic and casual games offer both a hands-on learning experience and a fun way to explore practical coding patterns in React. Explore the games, read through the code, and enjoy playing!

## 2. How to Play

### Tic Tac Toe

Tic Tac Toe is a two-player game played on a 3x3 grid. Players take turns clicking empty cells to place their symbol—Player 1 is **O**, Player 2 is **X**. The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins. If all cells are filled without a winner, the game ends in a draw. After each game, the board briefly animates before showing the result and allowing another round.

### Tower of Hanoi

Tower of Hanoi is a classic puzzle game. You start with a stack of blocks on the leftmost tower and must move the entire stack to the rightmost tower. You can only move one block at a time, and you cannot place a larger block on top of a smaller one. The player wins when all the blocks are successfully moved to the rightmost tower.

### Snek (Snake)

Snek is a simple snake game played on a 10x10 grid. Use the keyboard (arrow keys or WASD) to control the snake. The snake moves automatically and grows longer each time it eats food, which appears randomly on the board. Avoid running into the walls or colliding with yourself—either will end the game. Try to achieve the highest score by collecting as much food as possible.

### Math

The Math Game presents a random arithmetic equation using two numbers and an operator (addition, subtraction, multiplication, division, or modulus). Enter the correct answer in the input box to solve the problem. If the answer is not an integer, round to one decimal place. After each correct answer, a new question appears automatically.

### Connect 4

Connect 4 is a two-player game played on a vertical grid. Players take turns dropping colored discs into columns. The first to connect four of their own discs in a row (horizontally, vertically, or diagonally) wins. If the board fills up with no winner, the game ends in a draw.

### Memorisation

Memorisation is a memory challenge where you must repeat a sequence of flashing cells. The game displays a 2x2 grid, and in each round, a sequence of cells will flash in a specific order. After the sequence, click the cells in the same order to advance to the next stage. The sequence gets longer with each round. If you click the wrong cell, you must repeat that stage. Complete all five stages to win.

### Operations

Operation Blanks is a quick math game. You are shown two numbers and an answer, and must choose the correct operator (`+`, `-`, `×`, `÷`) that makes the equation true. Select the correct operation by clicking the corresponding button. If you’re right, you win and receive a new challenge. If not, try again. The game cycles through a set of randomized problems.

### Memory (Flashing Memory Game)

The Memory game challenges you to remember and repeat sequences. At each round, a sequence of letters (A, B, C, or D) will appear one by one in the instruction box. After the sequence finishes, click the corresponding buttons in the same order. Each round adds one more letter to remember. If you click out of order, the game restarts. Complete five rounds to win.

### Space

Space is a simple shooting game inspired by classic arcade "Space Invaders." Control your spaceship at the bottom of the screen using the arrow keys (or A/D). Press the spacebar to shoot bullets upward. Your goal is to destroy all the asteroids (rocks) arranged in two rows at the top of the screen.
Each asteroid disappears when hit by a bullet. The game ends when all asteroids are destroyed. On mobile, you can use on-screen buttons to move and shoot.

### Number Memory

Number Memory tests how many digits you can remember in sequence. When the game starts, a random number is displayed for a few seconds, then disappears. Enter the number you saw. Each correct answer increases the length of the next number by one digit. If you reach a score of 4 or higher, you win. The game tracks your best and average scores.

### Treasure Hunt

Treasure Hunt is a timed clicker game. Before starting, set a time limit and the number of coins to find. The game then hides an equal number of yellow and brown coins randomly on the page—each appears as a black circle until clicked. Click the coins to reveal their colors. Your goal is to find all the yellow coins within the time limit. If you succeed, you win; if time runs out, you lose.

### Flappy Bird

Flappy Bird is an arcade-style game where you control a bird that automatically falls due to gravity. The player must press the space bar or click to make the bird jump and navigate it through moving pairs of obstacles with gaps. The goal is to pass through as many obstacles as possible without colliding with them or falling to the ground. If the bird hits an obstacle or the ground, the game is over.

## 3. Development

To run the games locally, follow these steps:

```bash
# clone the repository
git clone https://github.com/luke-mao/react-games.git
cd react-games

# install dependencies
npm install

# start the development server
npm run dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to play the games.
