import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type Cell = "X" | "O" | null;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: "X" | "O" | "draw" | null; line: number[] | null } {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line: [a, b, c] };
    }
  }
  if (board.every((c) => c !== null)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

export interface PlayerInfo {
  id: string;
  name: string;
  symbol: "X" | "O";
}

export interface MultiplayerGameState {
  roomId: string | null;
  board: Cell[];
  mySymbol: "X" | "O" | null;
  currentTurn: "X" | "O";
  winner: string | null;
  winLine: number[] | null;
  gameOver: boolean;
  status: "searching" | "playing" | "finished" | "idle";
  opponent: { name: string } | null;
  myName: string;
  turnTimer: number;
}

const TURN_TIME = 15; // seconds per turn

export function useMultiplayerTicTacToe(playerId: string, playerName: string) {
  const [state, setState] = useState<MultiplayerGameState>({
    roomId: null,
    board: Array(9).fill(null),
    mySymbol: null,
    currentTurn: "X",
    winner: null,
    winLine: null,
    gameOver: false,
    status: "idle",
    opponent: null,
    myName: playerName,
    turnTimer: TURN_TIME,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<any>(null);
  const roomIdRef = useRef<string | null>(null);

  // Clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start turn timer
  const startTimer = useCallback(() => {
    clearTimer();
    setState((s) => ({ ...s, turnTimer: TURN_TIME }));
    timerRef.current = setInterval(() => {
      setState((prev) => {
        const newTime = prev.turnTimer - 1;
        if (newTime <= 0) {
          // Time's up - auto-forfeit (the current turn player loses)
          clearTimer();
          return { ...prev, turnTimer: 0 };
        }
        return { ...prev, turnTimer: newTime };
      });
    }, 1000);
  }, [clearTimer]);

  // Subscribe to room changes
  const subscribeToRoom = useCallback((roomId: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel(`game_room_${roomId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
        (payload) => {
          const room = payload.new as any;
          const boardCells: Cell[] = room.board.map((c: string | null) =>
            c === "X" || c === "O" ? c : null
          );
          const result = checkWinner(boardCells);
          const isFinished = room.status === "finished" || !!result.winner;

          setState((prev) => {
            const opponent = prev.mySymbol === "X"
              ? { name: room.player_o_name || "Opponent" }
              : { name: room.player_x_name || "Opponent" };

            return {
              ...prev,
              board: boardCells,
              currentTurn: room.current_turn as "X" | "O",
              winner: result.winner || room.winner,
              winLine: result.line,
              gameOver: isFinished,
              status: isFinished ? "finished" : room.status === "playing" ? "playing" : prev.status,
              opponent: room.player_o_id ? opponent : prev.opponent,
            };
          });

          if (!result.winner && room.status === "playing") {
            startTimer();
          } else if (result.winner || isFinished) {
            clearTimer();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [startTimer, clearTimer]);

  // Find or create a game
  const findGame = useCallback(async () => {
    setState((s) => ({ ...s, status: "searching" }));

    // Look for a waiting room
    const { data: rooms } = await supabase
      .from("game_rooms")
      .select("*")
      .eq("status", "waiting")
      .neq("player_x_id", playerId)
      .order("created_at", { ascending: true })
      .limit(1);

    if (rooms && rooms.length > 0) {
      const room = rooms[0];
      // Join as player O
      await supabase
        .from("game_rooms")
        .update({
          player_o_id: playerId,
          player_o_name: playerName,
          status: "playing",
          turn_started_at: new Date().toISOString(),
        })
        .eq("id", room.id);

      roomIdRef.current = room.id;
      setState((s) => ({
        ...s,
        roomId: room.id,
        mySymbol: "O",
        status: "playing",
        opponent: { name: room.player_x_name },
        board: Array(9).fill(null),
        currentTurn: "X",
        gameOver: false,
        winner: null,
        winLine: null,
      }));
      subscribeToRoom(room.id);
      startTimer();
    } else {
      // Create new room as player X
      const { data: newRoom } = await supabase
        .from("game_rooms")
        .insert({
          player_x_id: playerId,
          player_x_name: playerName,
          status: "waiting",
          board: Array(9).fill(null),
        })
        .select()
        .single();

      if (newRoom) {
        roomIdRef.current = newRoom.id;
        setState((s) => ({
          ...s,
          roomId: newRoom.id,
          mySymbol: "X",
          status: "searching",
          board: Array(9).fill(null),
          currentTurn: "X",
          gameOver: false,
          winner: null,
          winLine: null,
          opponent: null,
        }));
        subscribeToRoom(newRoom.id);
      }
    }
  }, [playerId, playerName, subscribeToRoom, startTimer]);

  // Make a move
  const makeMove = useCallback(async (index: number) => {
    const { roomId, mySymbol, currentTurn, board, gameOver } = state;
    if (!roomId || !mySymbol || gameOver || currentTurn !== mySymbol || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = mySymbol;
    const result = checkWinner(newBoard);

    const updates: any = {
      board: newBoard.map((c) => c || null),
      current_turn: mySymbol === "X" ? "O" : "X",
      turn_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (result.winner) {
      updates.winner = result.winner;
      updates.status = "finished";
    }

    await supabase.from("game_rooms").update(updates).eq("id", roomId);

    setState((s) => ({
      ...s,
      board: newBoard,
      currentTurn: updates.current_turn,
      winner: result.winner,
      winLine: result.line,
      gameOver: !!result.winner,
      status: result.winner ? "finished" : "playing",
    }));

    if (result.winner) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [state, clearTimer, startTimer]);

  // Leave game
  const leaveGame = useCallback(async () => {
    clearTimer();
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (roomIdRef.current && !state.gameOver) {
      // Mark as finished if still playing
      await supabase
        .from("game_rooms")
        .update({ status: "finished", winner: state.mySymbol === "X" ? "O" : "X" })
        .eq("id", roomIdRef.current);
    }
    roomIdRef.current = null;
    setState({
      roomId: null,
      board: Array(9).fill(null),
      mySymbol: null,
      currentTurn: "X",
      winner: null,
      winLine: null,
      gameOver: false,
      status: "idle",
      opponent: null,
      myName: playerName,
      turnTimer: TURN_TIME,
    });
  }, [clearTimer, state.gameOver, state.mySymbol, playerName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [clearTimer]);

  return {
    ...state,
    findGame,
    makeMove,
    leaveGame,
    TURN_TIME,
  };
}
