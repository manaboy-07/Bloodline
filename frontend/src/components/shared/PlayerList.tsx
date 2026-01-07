import { getTopThreeUsers, users } from "@/mockusers";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type Leaderboardprops = {
  isShortList: boolean;
};
function PlayerList({ isShortList }: Leaderboardprops) {
  const shortlist = getTopThreeUsers(users);

  const playerslist = isShortList ? shortlist : users;
  return (
    <div>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pos</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Club</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playerslist.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                {/* club image */}
                <TableCell>{user.club}</TableCell>

                <TableCell className="text-right">{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

export default PlayerList;
