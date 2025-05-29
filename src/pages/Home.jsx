import React from "react";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold text-blue-500 text-center">
        React Games
      </div>
      <div className="text-xl font-bold text-blue-500 text-center">
        Select a game from the sidebar.
      </div>
    </div>
  );
}
