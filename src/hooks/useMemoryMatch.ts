import { useState, useCallback, useEffect, useRef } from "react";

export interface MemoryCard {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🐵", "🦁", "🐘", "🦋", "🌺", "🎯", "🚀", "🌈"];

function shuffleCards(): MemoryCard[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export interface MemoryMatchState {
  cards: MemoryCard[];
  turns: number;
  matches: number;
  botTurns: number;
  botMatches: number;
  gameOver: boolean;
  winner: "player" | "bot" | "draw" | null;
  isPlayerTurn: boolean;
  flippedIndices: number[];
}

export function useMemoryMatch(mode: "solo" | "bot", difficulty: "easy" | "medium" | "hard") {
  const [state, setState] = useState<MemoryMatchState>(() => ({
    cards: shuffleCards(),
    turns: 0,
    matches: 0,
    botTurns: 0,
    botMatches: 0,
    gameOver: false,
    winner: null,
    isPlayerTurn: true,
    flippedIndices: [],
  }));

  const botMemory = useRef<Map<string, number[]>>(new Map());
  const lockRef = useRef(false);

  const reset = useCallback(() => {
    botMemory.current = new Map();
    lockRef.current = false;
    setState({
      cards: shuffleCards(),
      turns: 0,
      matches: 0,
      botTurns: 0,
      botMatches: 0,
      gameOver: false,
      winner: null,
      isPlayerTurn: true,
      flippedIndices: [],
    });
  }, []);

  const checkGameOver = useCallback((cards: MemoryCard[], matches: number, botMatches: number) => {
    const allMatched = cards.every((c) => c.matched);
    if (!allMatched) return null;
    if (mode === "solo") return "player" as const;
    if (matches > botMatches) return "player" as const;
    if (botMatches > matches) return "bot" as const;
    return "draw" as const;
  }, [mode]);

  const flipCard = useCallback((index: number) => {
    if (lockRef.current) return;
    setState((prev) => {
      if (!prev.isPlayerTurn && mode === "bot") return prev;
      const card = prev.cards[index];
      if (card.flipped || card.matched || prev.gameOver) return prev;
      if (prev.flippedIndices.length >= 2) return prev;

      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], flipped: true };
      const newFlipped = [...prev.flippedIndices, index];

      // Remember card for bot
      const emoji = newCards[index].emoji;
      const mem = botMemory.current.get(emoji) || [];
      if (!mem.includes(index)) botMemory.current.set(emoji, [...mem, index]);

      if (newFlipped.length === 2) {
        lockRef.current = true;
        const [a, b] = newFlipped;
        const isMatch = newCards[a].emoji === newCards[b].emoji;

        if (isMatch) {
          newCards[a] = { ...newCards[a], matched: true };
          newCards[b] = { ...newCards[b], matched: true };
          const newMatches = prev.matches + 1;
          const winner = checkGameOver(newCards, newMatches, prev.botMatches);
          
          setTimeout(() => {
            lockRef.current = false;
            setState((s) => ({
              ...s,
              cards: newCards,
              flippedIndices: [],
              turns: s.turns + 1,
              matches: newMatches,
              gameOver: !!winner,
              winner,
              isPlayerTurn: true, // player keeps turn on match
            }));
          }, 600);
        } else {
          setTimeout(() => {
            const resetCards = [...newCards];
            resetCards[a] = { ...resetCards[a], flipped: false };
            resetCards[b] = { ...resetCards[b], flipped: false };
            lockRef.current = false;
            setState((s) => ({
              ...s,
              cards: resetCards,
              flippedIndices: [],
              turns: s.turns + 1,
              isPlayerTurn: mode === "bot" ? false : true,
            }));
          }, 800);
        }

        return { ...prev, cards: newCards, flippedIndices: newFlipped };
      }

      return { ...prev, cards: newCards, flippedIndices: newFlipped };
    });
  }, [mode, checkGameOver]);

  // Bot turn
  useEffect(() => {
    if (mode !== "bot" || state.isPlayerTurn || state.gameOver || lockRef.current) return;

    const botDelay = difficulty === "easy" ? 1200 : difficulty === "medium" ? 800 : 400;

    const timer = setTimeout(() => {
      const unmatched = state.cards
        .map((c, i) => ({ ...c, index: i }))
        .filter((c) => !c.matched && !c.flipped);

      if (unmatched.length < 2) return;

      let first = -1;
      let second = -1;

      // Bot intelligence based on difficulty
      const memChance = difficulty === "easy" ? 0.2 : difficulty === "medium" ? 0.5 : 0.9;

      if (Math.random() < memChance) {
        // Try to find a known pair
        for (const [emoji, indices] of botMemory.current.entries()) {
          const valid = indices.filter((i) => !state.cards[i].matched);
          if (valid.length >= 2) {
            first = valid[0];
            second = valid[1];
            break;
          }
        }
      }

      if (first === -1) {
        // Random picks
        const shuffled = [...unmatched].sort(() => Math.random() - 0.5);
        first = shuffled[0].index;
        second = shuffled[1].index;
      }

      // Flip first card
      setState((prev) => {
        const newCards = [...prev.cards];
        newCards[first] = { ...newCards[first], flipped: true };
        const emoji = newCards[first].emoji;
        const mem = botMemory.current.get(emoji) || [];
        if (!mem.includes(first)) botMemory.current.set(emoji, [...mem, first]);
        return { ...prev, cards: newCards, flippedIndices: [first] };
      });

      // Flip second card after delay
      setTimeout(() => {
        lockRef.current = true;
        setState((prev) => {
          const newCards = [...prev.cards];
          newCards[second] = { ...newCards[second], flipped: true };
          const emoji = newCards[second].emoji;
          const mem = botMemory.current.get(emoji) || [];
          if (!mem.includes(second)) botMemory.current.set(emoji, [...mem, second]);

          const isMatch = newCards[first].emoji === newCards[second].emoji;

          if (isMatch) {
            newCards[first] = { ...newCards[first], matched: true };
            newCards[second] = { ...newCards[second], matched: true };
            const newBotMatches = prev.botMatches + 1;
            const winner = checkGameOver(newCards, prev.matches, newBotMatches);

            setTimeout(() => {
              lockRef.current = false;
              setState((s) => ({
                ...s,
                cards: newCards,
                flippedIndices: [],
                botTurns: s.botTurns + 1,
                botMatches: newBotMatches,
                gameOver: !!winner,
                winner,
                isPlayerTurn: false, // bot keeps turn on match
              }));
              // If bot matched and game not over, bot goes again
              if (!winner) {
                setTimeout(() => {
                  setState((s) => ({ ...s, isPlayerTurn: false }));
                }, 300);
              }
            }, 600);
          } else {
            setTimeout(() => {
              const resetCards = [...newCards];
              resetCards[first] = { ...resetCards[first], flipped: false };
              resetCards[second] = { ...resetCards[second], flipped: false };
              lockRef.current = false;
              setState((s) => ({
                ...s,
                cards: resetCards,
                flippedIndices: [],
                botTurns: s.botTurns + 1,
                isPlayerTurn: true,
              }));
            }, 800);
          }

          return { ...prev, cards: newCards, flippedIndices: [first, second] };
        });
      }, botDelay);
    }, botDelay);

    return () => clearTimeout(timer);
  }, [state.isPlayerTurn, state.gameOver, mode, difficulty, state.cards, checkGameOver]);

  return { ...state, flipCard, reset };
}
