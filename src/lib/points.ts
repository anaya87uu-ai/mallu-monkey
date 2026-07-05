import { supabase } from "@/integrations/supabase/client";

export const LEVELS = [
  { level: 1, name: "Newbie", pointsNeeded: 0 },
  { level: 2, name: "Chatter", pointsNeeded: 100 },
  { level: 3, name: "Social", pointsNeeded: 300 },
  { level: 4, name: "Popular", pointsNeeded: 600 },
  { level: 5, name: "Star", pointsNeeded: 1000 },
  { level: 6, name: "Legend", pointsNeeded: 2000 },
  { level: 7, name: "Icon", pointsNeeded: 5000 },
  { level: 8, name: "Mythic", pointsNeeded: 10000 },
];

export const BADGES = [
  { id: "first_chat", name: "First Chat", emoji: "💬", desc: "Complete your first chat" },
  { id: "gamer", name: "Gamer", emoji: "🎮", desc: "Play 5 games" },
  { id: "winner", name: "Winner", emoji: "🏆", desc: "Win 3 games" },
  { id: "streak_3", name: "3-Day Streak", emoji: "🔥", desc: "Log in 3 days in a row" },
  { id: "streak_7", name: "Week Warrior", emoji: "⚡", desc: "Log in 7 days in a row" },
  { id: "level_5", name: "Rising Star", emoji: "⭐", desc: "Reach level 5" },
  { id: "social_10", name: "Socialite", emoji: "🦋", desc: "Chat with 10 strangers" },
  { id: "champion", name: "Champion", emoji: "👑", desc: "Win 10 games" },
];

export const POINT_VALUES = {
  daily_claim: 25,
  chat_complete: 10,
  chat_per_minute: 2, // points per minute of chat time
  game_win: 20,
  game_play: 5,
  streak_bonus: 10, // per day of streak
};

export function getLevelInfo(points: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].pointsNeeded) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const progress = next
    ? ((points - current.pointsNeeded) / (next.pointsNeeded - current.pointsNeeded)) * 100
    : 100;
  return { current, next, progress: Math.min(progress, 100) };
}

export async function getOrCreateUserPoints(userId: string, displayName?: string) {
  const { data } = await supabase
    .from("user_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data;

  const { data: created } = await supabase
    .from("user_points")
    .insert({ user_id: userId, display_name: displayName || "Anonymous" })
    .select()
    .single();

  return created;
}

export async function addPoints(userId: string, amount: number, newBadges?: string[]) {
  const current = await getOrCreateUserPoints(userId);
  if (!current) return null;

  const newTotal = (current.total_points || 0) + amount;
  const newLevel = getLevelInfo(newTotal).current.level;
  const existingBadges: string[] = (current.badges as string[]) || [];
  const mergedBadges = newBadges
    ? [...new Set([...existingBadges, ...newBadges])]
    : existingBadges;

  const { data } = await supabase
    .from("user_points")
    .update({
      total_points: newTotal,
      level: newLevel,
      badges: mergedBadges,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  return data;
}

export async function claimDailyReward(userId: string) {
  const current = await getOrCreateUserPoints(userId);
  if (!current) return { success: false, message: "Error loading points" };

  const now = new Date();
  const lastClaim = current.last_daily_claim ? new Date(current.last_daily_claim) : null;

  if (lastClaim) {
    const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 20) {
      return { success: false, message: "Already claimed today! Come back tomorrow." };
    }
  }

  // Calculate streak
  let newStreak = 1;
  if (lastClaim) {
    const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 48) {
      newStreak = (current.login_streak || 0) + 1;
    }
  }

  const streakBonus = Math.min(newStreak, 7) * POINT_VALUES.streak_bonus;
  const totalReward = POINT_VALUES.daily_claim + streakBonus;
  const newTotal = (current.total_points || 0) + totalReward;
  const newLevel = getLevelInfo(newTotal).current.level;

  // Check for streak badges
  const existingBadges: string[] = (current.badges as string[]) || [];
  const newBadges = [...existingBadges];
  if (newStreak >= 3 && !newBadges.includes("streak_3")) newBadges.push("streak_3");
  if (newStreak >= 7 && !newBadges.includes("streak_7")) newBadges.push("streak_7");
  if (newLevel >= 5 && !newBadges.includes("level_5")) newBadges.push("level_5");

  await supabase
    .from("user_points")
    .update({
      total_points: newTotal,
      level: newLevel,
      login_streak: newStreak,
      last_daily_claim: now.toISOString(),
      badges: newBadges,
      updated_at: now.toISOString(),
    })
    .eq("user_id", userId);

  return {
    success: true,
    points: totalReward,
    streak: newStreak,
    message: `+${totalReward} points! (${POINT_VALUES.daily_claim} daily + ${streakBonus} streak bonus)`,
  };
}

/**
 * Record a completed chat: upserts chat_stats (increments totals) and
 * awards points based on chat duration (chat_per_minute per full minute + chat_complete bonus).
 */
export async function recordChatCompleted(
  userId: string,
  displayName: string | undefined,
  seconds: number,
) {
  if (!userId || !Number.isFinite(seconds) || seconds < 3) return; // ignore blips

  // Fetch existing stats to increment
  const { data: existing } = await supabase
    .from("chat_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const totalChats = (existing?.total_chats || 0) + 1;
  const totalSeconds = (existing?.total_chat_seconds || 0) + seconds;
  const longest = Math.max(existing?.longest_chat_seconds || 0, seconds);

  if (existing) {
    await supabase
      .from("chat_stats")
      .update({
        total_chats: totalChats,
        total_chat_seconds: totalSeconds,
        longest_chat_seconds: longest,
        display_name: displayName || existing.display_name || "Anonymous",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  } else {
    await supabase.from("chat_stats").insert({
      user_id: userId,
      display_name: displayName || "Anonymous",
      total_chats: totalChats,
      total_chat_seconds: totalSeconds,
      longest_chat_seconds: longest,
    });
  }

  // Award points: per-minute + a small completion bonus
  const minutes = Math.floor(seconds / 60);
  const awarded = minutes * POINT_VALUES.chat_per_minute + POINT_VALUES.chat_complete;

  const badges: string[] = [];
  const current = await getOrCreateUserPoints(userId, displayName);
  const existingBadges: string[] = (current?.badges as string[]) || [];
  if (!existingBadges.includes("first_chat")) badges.push("first_chat");
  if (totalChats >= 10 && !existingBadges.includes("social_10")) badges.push("social_10");

  await addPoints(userId, awarded, badges);
  return { awarded, minutes, totalChats };
}
