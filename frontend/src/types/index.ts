import type { ReactNode, ChangeEventHandler } from "react";

export type InputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id?: string;
  name?: string;
  autoComplete?: string;
  rightElement?: ReactNode;
};

export type LeaderboardUser = {
  name: string;
  points: number; // use number instead of string for sorting
  taunt: string;
  club: string;
};
export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  isScored: boolean;
  matchDate: string;
  createdAt: string;
}
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  club?: string;
}
export type UpdateUserDto = Partial<CreateUserDto>;
