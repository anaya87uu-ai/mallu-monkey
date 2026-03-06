import { useState, useCallback } from "react";

type Player = "X" | "O";
type Cell = Player | null;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Player | "draw" | null; line: number[] | null } {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((c) => c !== null)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

function minimax(board: Cell[], isMaximizing: boolean): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBotMove(board: Cell[], difficulty: "easy" | "medium" | "hard"): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
  if (empty.length === 0) return -1;

  if (difficulty === "easy") {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  if (difficulty === "medium" && Math.random() < 0.4) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Hard: minimax
  let bestScore = -Infinity;
  let bestMove = empty[0];
  for (const i of empty) {
    board[i] = "O";
    const score = minimax(board, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

export function useTicTacToe(difficulty: "easy" | "medium" | "hard" = "medium") {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<{ winner: Player | "draw" | null; line: number[] | null }>({
    winner: null,
    line: null,
  });

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setResult({ winner: null, line: null });
  }, []);

  const play = useCallback(
    (index: number) => {
      if (gameOver || board[index]) return;

      const newBoard = [...board];
      newBoard[index] = "X";

      const check1 = checkWinner(newBoard);
      if (check1.winner) {
        setBoard(newBoard);
        setResult(check1);
        setGameOver(true);
        return check1;
      }

      // Bot move
      const botIdx = getBotMove([...newBoard], difficulty);
      if (botIdx >= 0) {
        newBoard[botIdx] = "O";
      }

      const check2 = checkWinner(newBoard);
      setBoard(newBoard);
      if (check2.winner) {
        setResult(check2);
        setGameOver(true);
        return check2;
      }

      return null;
    },
    [board, gameOver, difficulty]
  );

  return { board, play, reset, gameOver, result };
}
