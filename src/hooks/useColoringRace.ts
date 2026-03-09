import { useState, useCallback, useEffect, useRef } from "react";

export type CellOwner = "player" | "bot" | null;

export interface ColoringRaceState {
  grid: CellOwner[];
  gridSize: number;
  playerScore: number;
  botScore: number;
  gameOver: boolean;
  winner: "player" | "bot" | "draw" | null;
  timeLeft: number;
  isRunning: boolean;
}

const GAME_DURATION = 30; // seconds

export function useColoringRace(mode: "solo" | "bot", difficulty: "easy" | "medium" | "hard") {
  const gridSize = 6;
  const totalCells = gridSize * gridSize;

  const [state, setState] = useState<ColoringRaceState>({
    grid: Array(totalCells).fill(null),
    gridSize,
    playerScore: 0,
    botScore: 0,
    gameOver: false,
    winner: null,
    timeLeft: GAME_DURATION,
    isRunning: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (botTimerRef.current) { clearInterval(botTimerRef.current); botTimerRef.current = null; }
  }, []);

  const finishGame = useCallback((grid: CellOwner[]) => {
    const playerScore = grid.filter((c) => c === "player").length;
    const botScore = grid.filter((c) => c === "bot").length;
    let winner: "player" | "bot" | "draw" | null;
    if (playerScore > botScore) winner = "player";
    else if (botScore > playerScore) winner = "bot";
    else winner = "draw";
    return { playerScore, botScore, winner };
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    const newGrid: CellOwner[] = Array(totalCells).fill(null);
    setState({
      grid: newGrid,
      gridSize,
      playerScore: 0,
      botScore: 0,
      gameOver: false,
      winner: null,
      timeLeft: GAME_DURATION,
      isRunning: true,
    });

    // Countdown timer
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimers();
          const result = finishGame(prev.grid);
          return { ...prev, timeLeft: 0, isRunning: false, gameOver: true, ...result };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    // Bot auto-color
    if (mode === "bot") {
      const botSpeed = difficulty === "easy" ? 1500 : difficulty === "medium" ? 900 : 500;
      botTimerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.gameOver || !prev.isRunning) return prev;
          const available = prev.grid
            .map((c, i) => (c === null ? i : -1))
            .filter((i) => i >= 0);
          if (available.length === 0) {
            clearTimers();
            const result = finishGame(prev.grid);
            return { ...prev, isRunning: false, gameOver: true, ...result };
          }

          // Bot strategy: on hard, try to claim adjacent cells; otherwise random
          let target: number;
          if (difficulty === "hard") {
            const botCells = prev.grid.map((c, i) => (c === "bot" ? i : -1)).filter((i) => i >= 0);
            const adjacentTargets = botCells.flatMap((i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              return [
                row > 0 ? i - gridSize : -1,
                row < gridSize - 1 ? i + gridSize : -1,
                col > 0 ? i - 1 : -1,
                col < gridSize - 1 ? i + 1 : -1,
              ].filter((n) => n >= 0 && prev.grid[n] === null);
            });
            target = adjacentTargets.length > 0
              ? adjacentTargets[Math.floor(Math.random() * adjacentTargets.length)]
              : available[Math.floor(Math.random() * available.length)];
          } else {
            target = available[Math.floor(Math.random() * available.length)];
          }

          const newGrid = [...prev.grid];
          newGrid[target] = "bot";
          const newBotScore = prev.botScore + 1;

          if (newGrid.every((c) => c !== null)) {
            clearTimers();
            const result = finishGame(newGrid);
            return { ...prev, grid: newGrid, isRunning: false, gameOver: true, ...result };
          }

          return { ...prev, grid: newGrid, botScore: newBotScore };
        });
      }, botSpeed);
    }
  }, [mode, difficulty, totalCells, gridSize, clearTimers, finishGame]);

  const colorCell = useCallback((index: number) => {
    setState((prev) => {
      if (prev.gameOver || !prev.isRunning || prev.grid[index] !== null) return prev;
      const newGrid = [...prev.grid];
      newGrid[index] = "player";
      const newPlayerScore = prev.playerScore + 1;

      if (mode === "solo" && newGrid.every((c) => c !== null)) {
        clearTimers();
        return {
          ...prev,
          grid: newGrid,
          playerScore: newPlayerScore,
          isRunning: false,
          gameOver: true,
          winner: "player" as const,
        };
      }

      if (newGrid.every((c) => c !== null)) {
        clearTimers();
        const result = finishGame(newGrid);
        return { ...prev, grid: newGrid, isRunning: false, gameOver: true, ...result };
      }

      return { ...prev, grid: newGrid, playerScore: newPlayerScore };
    });
  }, [mode, clearTimers, finishGame]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return { ...state, startGame, colorCell, GAME_DURATION };
}
