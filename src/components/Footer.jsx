import React from "react";

export default function Footer() {
  // the footer width needs to minus the sidebar width under breakpoints
  return (
    <div className="
      h-[50px] bg-[#999] fixed bottom-0
      left-[40px] w-[calc(100%-30px)]
      md:left-[70px] md:w-[calc(100%-60px)]
      lg:left-[110px] lg:w-[calc(100%-100px)]
      "
    />
  );
}
