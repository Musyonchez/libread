import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/black-logo.png";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    if (openMenu === false) {
      setOpenMenu(true);
    } else {
      setOpenMenu(false);
    }
  };

  return (
    <div className=" w-full justify-between items-center flex py-3 relative bg-white">
      <Image src={logo} alt="logo" className=" w-[200px] h-auto pl-10" />
      <div className=" w-fit justify-between items-center flex space-x-10 px-10">
        <Link className=" text-black" href="/">
          Home
        </Link>
        <button onClick={handleOpenMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000000"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      <div
        className={` bg-black absolute top-0 right-0 w-[200px] h-screen flex flex-col ${
          openMenu ? "flex-col" : "hidden"
        }`}
      >
        <div className=" flex flex-col">
          <Link href="/">Text</Link>
          <Link href="/">Document</Link>
          <Link href="/url">Url</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
