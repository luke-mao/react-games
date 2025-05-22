import React from 'react'
import Logo from '@/assets/logo.png'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'

export default function Sidebar() {
  // the sidebar shows different texts under lg, md, and sm screens
  const links = [
    { to: "/home", lg: "Home", md: "H", sm: "H"},
    { to: "/games/tictactoe", lg: "Tictac", md: "Ti", sm: "Ti"},
    { to: "/games/tower", lg: "Tower", md: "To", sm: "To"},
    { to: "/games/snek", lg: "Snek", md: "S", sm: "S"},
  ]

  return (
    <div className="h-screen w-[30px] md:w-[60px] lg:w-[100px] fixed bg-[#eee]">
      <Avatar className=" hidden lg:block w-[50px] h-[50px] my-[15px] mx-auto">
        <AvatarImage src={Logo}/>
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-3 pt-5 lg:pt-0">
        {links.map((link, index) => (
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
  )
}
