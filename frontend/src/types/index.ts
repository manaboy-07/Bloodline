export type InputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: any) => void;
};

export type LeaderboardUser = {
  name: string;
  points: number; // use number instead of string for sorting
  taunt: string;
  club: string;
};
