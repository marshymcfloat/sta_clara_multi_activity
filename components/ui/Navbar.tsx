"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthNavbarButton from "../auth/AuthNavbarButton";
import { Button } from "./button";

export default function Navbar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "To-do", href: `/${userId}/to-do` },
    { label: "Drive", href: `/${userId}/drive` },
    { label: "Food", href: `/${userId}/food` },
    { label: "Pokemon", href: `/${userId}/pokemon` },
    { label: "Markdown", href: `/${userId}/notes` },
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 border-b">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold">Sta. Clara</h1>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <nav
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0 w-full sm:w-auto pb-4 sm:pb-0 border-t sm:border-t-0 pt-4 sm:pt-0`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={
              pathname === link.href
                ? "text-primary font-bold px-2 py-1 rounded-md hover:bg-accent"
                : "text-gray-500 px-2 py-1 rounded-md hover:bg-accent hover:text-foreground"
            }
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-2 sm:mt-0">
          <AuthNavbarButton />
        </div>
      </nav>
    </header>
  );
}
