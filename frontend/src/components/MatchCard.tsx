import Link from "next/link";

interface MatchCardProps {
  id: number;
  homeTeam: string;
  awayTeam: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
}

export default function MatchCard({
  id,
  homeTeam,
  awayTeam,
  status,
  homeScore,
  awayScore,
}: MatchCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">
          {homeTeam} vs {awayTeam}
        </h3>

        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">
          {status}
        </span>
      </div>

      {status === "finished" && (
        <p className="text-2xl font-bold text-white mt-4">
          {homeScore} - {awayScore}
        </p>
      )}

      <div className="flex gap-3 mt-5">
        <Link
          href={`/matches/${id}`}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          View
        </Link>

        <Link
          href={`/matches/edit/${id}`}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}