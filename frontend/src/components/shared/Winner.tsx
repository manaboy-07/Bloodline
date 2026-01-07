import React from "react";

function Winner() {
  return (
    <div className=" flex flex-col justify-center items-center text-center">
      <section>This weeks winner(s): Manasseh</section>
      <div className="flex gap-2">
        <img
          src="https://assets.aceternity.com/manu.png"
          className="h-28 w-28 shrink-0 rounded-full"
          alt="Avatar"
        />
        {/* Club he supports image */}
        <img
          src="https://assets.aceternity.com/manu.png"
          className="h-28 w-28 shrink-0 rounded-full"
          alt="Avatar"
        />
      </div>
      <section>
        <h2>Taunt: </h2>
        <p className="taunt">
          It can't go on like this can it ? , you all need to do better{" "}
        </p>
      </section>
    </div>
  );
}

export default Winner;
