import React from "react";
import Link from "next/link";
import { GiPrayingMantis } from "react-icons/gi";
import { LuHome } from "react-icons/lu";
import { SiCkeditor4 } from "react-icons/si";

const NavBar = () => {
  return (
    <div className="hidden border-r bg-muted/40 lg:block">
      <div className="flex flex-col gap-2">
        <div className="flex h-[60px] items-center px-6">
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold"
            prefetch={false}
          >
            <GiPrayingMantis className="h-8 w-8" />
            <span className="text-xl">Namla</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              prefetch={false}
            >
              <LuHome className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              prefetch={false}
            >
              <SiCkeditor4 className="h-4 w-4" />
              Yaml Editor
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
