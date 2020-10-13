import React, { useEffect, useState } from "react";
import { generateBoard } from "./services";
import "./App.css";

function App() {
  const [size, setSize] = useState({ rows: 4, cols: 4 });
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(generateBoard(4, 4, 7));
  const [boardGuess, setBoardGuess] = useState(generateBoard(4, 4, 0));
  const [guesses, setGuesses] = useState({ total: 7, current: 0, wrong: 0 });
  const [guess, setGuess] = useState(false);

  useEffect(() => {
    setTimeout(() => setGuess(true), 3000);
  }, [board]);

  useEffect(() => {
    if (guesses.current === guesses.total) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setTimeout(() => {
        const newSize = Math.ceil(newLevel / 3) + 3;
        setSize({ rows: newSize, cols: newSize });
        setBoard(
          generateBoard(newSize, newSize, newSize * 2 - 1)
        );
        setBoardGuess(generateBoard(newSize, newSize,  0));
        setGuess(false);
        setGuesses({ total: newSize + newSize - 1, current: 0, wrong: 0 });
      }, 1000);
    }
  }, [guesses]);

  const boardSize = {
    gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${size.rows}, 1fr)`,
  };

  const handleClick = (row, col) => {
    if (guesses.current === guesses.total || !guess || boardGuess[row][col] !== false) return;
    const newBoard = [...boardGuess];
    const isRight = !!board[row][col];
    newBoard[row][col] = isRight ? true : null;
    const wasWrong = isRight ? 0 : 1;
    setBoardGuess(newBoard);
    setGuesses((prev) => ({ ...prev, current: prev.current + 1, wrong: prev.wrong + wasWrong }));
  };

  const pieceClass = (row, col) => {
    // no matter what if it's null show failed
    // if it's not gueesing time
    if (boardGuess[row][col] === null) {
      return "failed";
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
      <h1>{guesses.total - guesses.current} left!</h1>
      <div className="board" style={boardSize}>
        {boardGuess.map((row, i) => (
          <>
            {row.map((col, j) => (
              <div
                className={`piece ${pieceClass(i, j)}`}
                onClick={() => handleClick(i, j)}
              ></div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
