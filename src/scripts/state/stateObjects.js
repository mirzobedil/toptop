'use strivt';

export const StateObjects = {
  gameState: {
    letters: [],
    states: [],
    guess: "",
    status: "play",
    lastPlayedTime: 0,
  },
   gameStats: {
    playsCount: 0,
    winsCount: 0,
    attempts: [0, 0, 0, 0, 0, 0],
    currentStreak: 0,
    maxStreak: 0,
  }
}