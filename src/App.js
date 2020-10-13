import React, { useEffect, useState } from "react";
import { generateBoard } from "./services";
import "./App.css";

function App() {
  const [size, setSize] = useState({ rows: 7, cols: 7 });
  const [newRows, setNewRows] = useState(7);
  const [newCols, setNewCols] = useState(7);
  const [board, setBoard] = useState(generateBoard(7, 7, 15));
  const [boardGuess, setBoardGuess] = useState(generateBoard(7, 7, 0));
  const [guesses, setGuesses] = useState({ total: 15, current: 0 });
  const [guess, setGuess] = useState(false);

  useEffect(() => {
    setTimeout(() => setGuess(true), 2000);
  }, [board]);

  useEffect(() => {
    setBoard(generateBoard(size.rows, size.cols, size.rows + size.cols - 1));
    setBoardGuess(generateBoard(size.rows, size.cols, 0));
  }, [size]);

  useEffect(() => {
    if (guesses.current === guesses.total) {
      setTimeout(() => {
        setBoard(
          generateBoard(size.rows, size.cols, size.rows + size.cols - 1)
        );
        setBoardGuess(generateBoard(size.rows, size.cols, 0));
        setGuess(false);
        setGuesses({ total: size.rows + size.cols - 1, current: 0 });
      }, 1000);
    }
  }, [size, guesses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSize({ rows: newRows, cols: newCols });
  };

  const boardSize = {
    gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${size.rows}, 1fr)`,
  };

  const handleClick = (row, col) => {
    const newBoard = [...boardGuess];
    newBoard[row][col] = board[row][col] === true ? true : null;
    setBoardGuess(newBoard);
    setGuesses((prev) => ({ ...prev, current: prev.current + 1 }));
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
      <form onSubmit={handleSubmit}>
        <h4>{guesses.total - guesses.current} left!</h4>
        <label htmlFor="rows">Rows:</label>
        <input
          name="rows"
          value={newRows}
          type="number"
          onChange={(e) => setNewRows(Number(e.target.value))}
        />

        <label htmlFor="cols">Cols:</label>
        <input
          name="cols"
          value={newCols}
          type="number"
          onChange={(e) => setNewCols(Number(e.target.value))}
        />
        <button type="submit">Change!</button>
      </form>
    </div>
  );
}

export default App;
