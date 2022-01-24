import axios from "axios";

export const generateBoard = (rows, cols, active) => {
  const board = [];
  for (let i = 0; i < rows; i += 1) {
    const row = [];
    for (let j = 0; j < cols; j += 1) {
      row.push(false);
    }
    board.push(row);
  }
  let activeCount = 0;
  while (activeCount < active) {
    const [x, y] = [
      Math.floor(Math.random() * rows),
      Math.floor(Math.random() * cols),
    ];
    if (!!board[x][y] === false) {
      board[x][y] = true;
      activeCount += 1;
    }
  }
  return board;
};

const BASE_URL =
  process.env.NODE_ENV === "production" ? "https://syms-leaderboard.herokuapp.com" : "http://localhost:3001";

export const getEntries = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const postEntry = async (username, score) => {
  await axios.post(BASE_URL, { username, score });
};
