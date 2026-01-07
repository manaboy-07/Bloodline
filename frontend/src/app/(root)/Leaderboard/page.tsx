import PlayerList from "@/components/shared/PlayerList";
import React from "react";

function Leaderboard() {
  return (
    <>
      <div>Leaderboard</div>
      <PlayerList isShortList={false} />
    </>
  );
}

export default Leaderboard;
