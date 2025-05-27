import React from "react";
import Logo from "@/assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function Sidebar() {
  // the sidebar shows different texts under lg, md, and sm screens
  const links = [
    { to: "/home", lg: "Home", md: "H", sm: "H"},
    { to: "/game/tictactoe", lg: "Tictac", md: "Ti", sm: "Ti"},
    { to: "/game/tower", lg: "Tower", md: "To", sm: "To"},
    { to: "/game/snek", lg: "Snek", md: "S", sm: "S"},
    { to: "/game/math", lg: "Math", md: "Ma", sm: "Ma"},
    { to: "/game/connect", lg: "Connect 4", md: "Co", sm: "Co"},
    { to: "/game/memorisation", lg: "Memorisation", md: "Me", sm: "Me"},
    { to: "/game/operations", lg: "Operations", md: "Op", sm: "Op"},
    { to: "/game/memory", lg: "Memory", md: "Me", sm: "Me"},
    { to: "/game/space", lg: "Space", md: "Sp", sm: "Sp"},
  ];

  return (
    <div className="h-screen w-[40px] md:w-[70px] lg:w-[110px] fixed bg-[#eee]">
      <Avatar className=" hidden lg:block w-[50px] h-[50px] my-[15px] mx-auto">
        <AvatarImage src={Logo}/>
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-3 pt-5 lg:pt-0">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
          >
            <span className="hidden lg:block text-base font-semibold text-center">{link.lg}</span>
            <span className="hidden md:block lg:hidden text-semibold font-bold text-center">{link.md}</span>
            <span className="block md:hidden text-base font-semibold text-center">{link.sm}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
