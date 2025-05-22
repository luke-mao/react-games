# React Games

## 1. Introduction

This repository contains a collection of simple web games built with React. Each game is designed as a single-page application (SPA) to provide a smooth and interactive user experience. The main purpose of this project is to practice and improve React development skills through building fun and classic games. Explore the games, learn from the code, and enjoy playing!

## 2. How to Play

### Tic Tac Toe

Tic Tac Toe is a two-player game on a 3x3 grid. Players take turns clicking empty cells to mark them—Player 1 is **O**, Player 2 is **X**. The first to get three marks in a row (horizontally, vertically, or diagonally) wins. If all cells are filled with no winner, the game ends in a draw. After each game, the board animates briefly before showing the result.

### Tower of Hanoi

Tower of Hanoi is a puzzle game where you move a stack of blocks from one tower to another. You can only move one block at a time, and you cannot place a larger block on top of a smaller one. The goal is to move the entire stack from the leftmost tower to the rightmost tower in as few moves as possible. The player wins when all the blocks have been successfully moved to the rightmost tower.

### Snek (Snake)

Snek is a classic snake game played on a 10x10 grid. Control the snake using the keyboard (arrow keys or WASD). The snake moves automatically and grows longer when it eats food, which appears randomly on the board. Avoid hitting the walls or running into yourself—if you do, the game is over.

### Math

The Math Game gives you a random arithmetic equation using two numbers and an operator (addition, subtraction, multiplication, division, or modulus). Enter the correct answer in the input box to solve each question. When the answer is not an integer, round your answer to one decimal place. A new problem appears after each correct answer.

### Connect 4

Connect 4 is a two-player game on a vertical grid. Players take turns dropping colored discs into columns. The first player to connect four of their discs in a row, either horizontally, vertically, or diagonally, wins. If the board fills up without a winner, the game ends in a draw.

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
