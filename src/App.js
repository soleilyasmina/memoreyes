import React, { useEffect, useState } from "react";
import { generateBoard } from "./services";
import "./App.css";

function App() {
  const [size, setSize] = useState({ rows: 4, cols: 4 });
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(generateBoard(4, 4, 7));
  const [boardGuess, setBoardGuess] = useState(generateBoard(4, 4, 0));
  const [guesses, setGuesses] = useState({
    total: 7,
    current: 0,
    wrong: 0,
    correct: 0,
  });
  const [guess, setGuess] = useState(false);
  const [score, setScore] = useState(0);
  const [loss, setLoss] = useState(false);

  useEffect(() => {
    setTimeout(() => setGuess(true), 3000);
  }, [board]);

  useEffect(() => {
    if (loss === true) {
      setLevel(1);
      setTimeout(() => {
        setScore(0);
        setGuesses({
          total: 7,
          current: 0,
          wrong: 0,
          correct: 0,
        });
      }, 1000);
      setTimeout(() => {
        setLoss(false);
        setBoardGuess(generateBoard(4, 4, 0));
        setBoard(generateBoard(4, 4, 7));
        setSize({ rows: 4, cols: 4 });
        setGuess(false);
      }, 5000);
    }
  }, [loss, size]);

  useEffect(() => {
    if (guesses.current === guesses.total) {
      setTimeout(() => {
        const newLevel = level + 1;
        const newSize = Math.ceil(newLevel / 3) + 3;
        setSize({ rows: newSize, cols: newSize });
        setBoard(
          generateBoard(
            newSize,
            newSize,
            newSize * 2 - 1 + ((newLevel - 1) % 3)
          )
        );
        setBoardGuess(generateBoard(newSize, newSize, 0));
        setGuess(false);
        setGuesses({
          total: newSize * 2 - 1 + ((newLevel - 1) % 3),
          current: 0,
          wrong: 0,
          correct: 0,
        });
        setLevel((prevLevel) => prevLevel + 1);
      }, 1000);
    }
  }, [guesses, level]);

  const boardSize = {
    gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${size.rows}, 1fr)`,
  };

  const handleClick = (row, col) => {
    if (
      guesses.current === guesses.total ||
      !guess ||
      boardGuess[row][col] !== false ||
      loss
    )
      return;
    const newBoard = [...boardGuess];
    const isRight = !!board[row][col];
    newBoard[row][col] = isRight ? true : null;
    const wasWrong = isRight ? 0 : 1;
    const wasRight = isRight ? 1 : 0;
    if (guesses.wrong + wasWrong > guesses.total / 4) {
      setLoss(true);
    } else {
      setBoardGuess(newBoard);
      setScore(
        (prevScore) => prevScore + (guesses.correct + 1) * 100 * wasRight
      );
      setGuesses((prev) => ({
        ...prev,
        current: prev.current + 1,
        wrong: prev.wrong + wasWrong,
        correct: prev.correct + wasRight,
      }));
    }
  };

  const pieceClass = (row, col) => {
    // no matter what if it's null show failed
    // if it's not gueesing time
    if (boardGuess[row][col] === null) {
      return " failed";
    } else if (!guess && board[row][col]) {
      return "active";
    } else if (boardGuess[row][col] === true) {
      return "active";
    } else {
      return "passive";
    }
  };

  return (
    <div className="App">
      <div className={`game-over ${loss ? "visible" : "invisible"}`}>
        <h1>GAME OVER</h1>
      </div>
      <h1>
        {guesses.current}/{guesses.total}
      </h1>
      <h2>{score}</h2>
      <div className="board" style={boardSize}>
        {boardGuess.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i}${j}`}
              className={`piece ${pieceClass(i, j)}`}
              onClick={() => handleClick(i, j)}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
