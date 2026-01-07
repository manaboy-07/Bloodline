import Link from "next/link";
import PlayerList from "./PlayerList";
import Winner from "./Winner";

const Dashboard = () => {
  return (
    <div className="flex-1 h-full">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          <div className="h-20 p-3 w-full  rounded-lg bg-gray-100 dark:bg-neutral-800">
            <p>Upcoming Matches</p>
            <span className="text-blue-500 cursor-pointer italic text-sm">
              Make prediction
            </span>
          </div>
          <div className="h-20 p-3 items-center text-center justify-center w-full  rounded-lg bg-gray-100 dark:bg-neutral-800">
            <p>This weeks points : </p>
            <p className="text-4xl font-semibold">20</p>
          </div>
          <div className="h-20 p-3 items-center text-center justify-center w-full  rounded-lg bg-gray-100 dark:bg-neutral-800">
            <p>Overall points : </p>
            <p className="text-4xl font-semibold">86</p>
          </div>
        </div>

        <div className="flex flex-1 gap-1">
          <div className="h-full  w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex flex-col justify-center items-center">
            <PlayerList isShortList={true} />
            <div className="text-blue-500 block mt-3 cursor-pointer text-sm italic text-center">
              <Link href={"/Leaderboard"}>view full leaderboard</Link>
            </div>
          </div>

          <div className="h-full p-3 w-full rounded-lg bg-gray-100 dark:bg-neutral-800  flex  justify-center items-center">
            <Winner />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
