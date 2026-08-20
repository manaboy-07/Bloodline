import React, { useEffect, useState } from "react";
import { getTeamLogo, searchTeams } from "@/api/Football";

interface LogoTeamProps {
  teamName: string;
}

const logoCache = new Map<string, string>();

const getFallbackBadge = (teamName: string) => {
  const initials = teamName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
      <rect width="80" height="80" rx="40" fill="#111827"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">
        ${initials || "FC"}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function LogoTeam({ teamName }: LogoTeamProps) {
  const [logoUrl, setLogoUrl] = useState<string>(() => getFallbackBadge(teamName));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchTeamLogo = async () => {
      const fallbackLogo = getFallbackBadge(teamName);

      if (!teamName) {
        setLogoUrl(fallbackLogo);
        return;
      }

      const cachedLogo = logoCache.get(teamName.toLowerCase());

      if (cachedLogo) {
        setLogoUrl(cachedLogo);
        return;
      }

      try {
        setLoading(true);
        setLogoUrl(fallbackLogo);

        const id = await searchTeams(teamName);

        if (!id) {
          setLogoUrl(fallbackLogo);
          return;
        }

        const logo = await getTeamLogo(id);

        if (cancelled) return;

        logoCache.set(teamName.toLowerCase(), logo);
        setLogoUrl(logo);
      } catch (error) {
        console.error("Error fetching team logo:", error);

        if (!cancelled) {
          setLogoUrl(fallbackLogo);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTeamLogo();

    return () => {
      cancelled = true;
    };
  }, [teamName]);

  return (
    <img
      src={logoUrl}
      alt={`${teamName} logo`}
      className={`w-10 h-10 rounded-full object-contain ${loading ? "opacity-60" : ""}`}
      onError={() => setLogoUrl(getFallbackBadge(teamName))}
    />
  );
}