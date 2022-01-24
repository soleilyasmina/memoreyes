import React, { useEffect, useState } from "react";
import { generateBoard, getEntries, postEntry } from "./services";
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
  const [leaderboard, setLeaderboard] = useState(false);
  const [shouldRestart, toggleRestart] = useState(false);
  const [username, setUsername] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (leaderboard) {
      getEntries().then(setEntries);
    }
  }, [leaderboard]);

  useEffect(() => {
    setTimeout(() => setGuess(true), 3000);
  }, [board]);

  useEffect(() => {
    if (shouldRestart === true) {
      setLevel(1);
      setScore(0);
      setGuesses({
        total: 7,
        current: 0,
        wrong: 0,
        correct: 0,
      });
      toggleRestart(false);
      setBoardGuess(generateBoard(4, 4, 0));
      setBoard(generateBoard(4, 4, 7));
      setSize({ rows: 4, cols: 4 });
      setGuess(false);
    }
  }, [size, shouldRestart]);

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
    if (
      guesses.wrong + wasWrong > Math.ceil(guesses.total / 4) &&
      guesses.current < guesses.total
    ) {
      setGuesses((prev) => ({
        ...prev,
        current: prev.current + 1,
        wrong: prev.wrong + wasWrong,
        correct: prev.correct + wasRight,
      }));
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
    // if it's not guessing time
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

  const reset = () => {
    if (guesses.current) return;
    setBoard(
      generateBoard(size.cols, size.rows, size.cols * 2 - 1 + ((level - 1) % 3))
    );
    setBoardGuess(generateBoard(size.cols, size.rows, 0));
    setGuess(false);
    setGuesses({
      total: size.cols * 2 - 1 + ((level - 1) % 3),
      current: 0,
      wrong: 0,
      correct: 0,
    });
  };

  const playAgain = () => {
    setLevel(1);
    setScore(0);
    setGuesses({
      total: 7,
      current: 0,
      wrong: 0,
      correct: 0,
    });
    setBoardGuess(generateBoard(4, 4, 0));
    setBoard(generateBoard(4, 4, 7));
    setSize({ rows: 4, cols: 4 });
    setLoss(false);
    setTimeout(() => {
      setGuess(false);
    }, 1000);
  };

  const submitEntry = (e) => {
    e.preventDefault();
    postEntry(username, score);
    setScore(0);
  };

  return (
    <div className="App">
      <div className={`game-over ${loss ? "visible" : "invisible"}`}>
        <h1>GAME OVER</h1>
        <form onSubmit={submitEntry}>
          <input
            placeholder="Add a name to submit!"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button disabled={!username.length || !score}>Submit to Leaderboard</button>
        </form>
        <button onClick={playAgain}>Play Again?</button>
      </div>
      <div className={`leaderboard ${leaderboard ? "visible" : "invisible"}`}>
        <h1>LEADERBOARD</h1>
        <hr />
        <ul>
          {entries.map((entry, index) => (
            <li className="flex-row">
              <span>
                {index + 1}. {entry.username}
              </span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => setLeaderboard(false)}>Close</button>
      </div>
      <div className="stats">
        <h3>Level {level}</h3>
        <h3>{score}</h3>
        <h3>
          <div className="guesses flex-row">
            <span className="failure">
              {guesses.wrong}/{Math.ceil(guesses.total / 4)}
            </span>
            <span>
              {guesses.current}/{guesses.total}
            </span>
          </div>
        </h3>
      </div>
      <div className="refresh-buttons">
        <button disabled={!!guesses.current} onClick={reset}>
          Reset
        </button>
        <button onClick={() => setLeaderboard(true)}>Leaderboard</button>
        <button onClick={() => toggleRestart(true)}>Restart</button>
      </div>
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
