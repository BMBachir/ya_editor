"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GiPrayingMantis } from "react-icons/gi";
import { LuHome } from "react-icons/lu";
import { SiCkeditor4 } from "react-icons/si";
import { LuArrowLeftToLine } from "react-icons/lu";
import { LuArrowRightFromLine } from "react-icons/lu";
const NavBar = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between transition-all duration-900 bg-gray-800 ${
        isNavVisible ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex h-[60px] items-center px-6 hover:text-hoverColor">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            prefetch={false}
          >
            <GiPrayingMantis className="h-8 w-8" />
            <span
              className={`text-xl transition-opacity duration-300 ${
                isNavVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              Namla
            </span>
          </Link>
        </div>
        {isNavVisible && (
          <div className="flex-1 overflow-hidden mt-8">
            <nav className="flex flex-col gap-2 items-start px-4 text-sm font-medium">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-hoverColor"
                prefetch={false}
              >
                <LuHome className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-300 ${
                    isNavVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Home
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-hoverColor"
                prefetch={false}
              >
                <SiCkeditor4 className="h-4 w-4" />
                <span
                  className={`transition-opacity duration-300 ${
                    isNavVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Yaml Editor
                </span>
              </Link>
            </nav>
          </div>
        )}
      </div>
      <div className="px-4 py-2 flex items-center justify-center bg-gray-800">
        {isNavVisible ? (
          <LuArrowLeftToLine
            className="h-6 w-6 cursor-pointer hover:text-hoverColor"
            onClick={toggleNavVisibility}
          />
        ) : (
          <LuArrowRightFromLine
            className="h-6 w-6 cursor-pointer hover:text-hoverColor"
            onClick={toggleNavVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
