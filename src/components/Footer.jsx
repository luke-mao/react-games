import React from "react";

export default function Footer() {
  // the footer width needs to minus the sidebar width under breakpoints
  return (
    <div className="
      h-[50px] bg-[#999] fixed bottom-0
      left-[30px] w-[calc(100%-30px)]
      md:left-[60px] md:w-[calc(100%-60px)]
      lg:left-[100px] lg:w-[calc(100%-100px)]
      "
    />
  );
}
