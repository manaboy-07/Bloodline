import { LeaderboardUser } from "./types";

export const users: LeaderboardUser[] = [
  {
    name: "Jerry",
    points: 95,
    taunt: "You guys should try better",
    club: "Arsenal",
  },
  {
    name: "Flambae",
    points: 160,
    taunt: "Same time next week ?",
    club: "Barcelona",
  },
  {
    name: "Elue",
    points: 78,
    taunt: "Una no just sabi shit",
    club: "Chelsea",
  },
  // --- 10 more ---
  {
    name: "Manasseh",
    points: 210,
    taunt: "Leaderboard na my birthright.",
    club: "Real Madrid",
  },
  {
    name: "Kelvin",
    points: 144,
    taunt: "I no even try today sef.",
    club: "Liverpool",
  },
  {
    name: "Zino",
    points: 120,
    taunt: "I dey warm up. Next week e go red.",
    club: "Juventus",
  },
  {
    name: "Precious",
    points: 88,
    taunt: "You people are unserious 😂",
    club: "AC Milan",
  },
  {
    name: "Dami",
    points: 170,
    taunt: "Small play I play una don dey cry.",
    club: "PSG",
  },
  {
    name: "Tega",
    points: 132,
    taunt: "Abeg who dey breathe?",
    club: "Bayern Munich",
  },
  {
    name: "Bolu",
    points: 102,
    taunt: "If I focus una no get hope.",
    club: "Inter Milan",
  },
  {
    name: "Chioma",
    points: 156,
    taunt: "I no dey drag too much.",
    club: "Manchester City",
  },
  {
    name: "Kingsley",
    points: 67,
    taunt: "One day e go be.",
    club: "Tottenham",
  },
];

export const getTopThreeUsers = (list: LeaderboardUser[]) => {
  return [...list].sort((a, b) => b.points - a.points).slice(0, 3);
};
