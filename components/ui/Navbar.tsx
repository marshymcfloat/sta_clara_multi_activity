"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthNavbarButton from "../auth/AuthNavbarButton";

export default function Navbar({ userId }: { userId: string }) {
  const pathname = usePathname();

  const links = [
    { label: "To-do", href: `/${userId}/to-do` },
    { label: "Drive", href: `/${userId}/drive` },
    { label: "Food", href: `/${userId}/food` },
    { label: "Pokemon", href: `/${userId}/pokemon` },
    { label: "Markdown", href: `/${userId}/markdown` },
  ];

  return (
    <header className="flex items-center justify-between p-4 ">
      <h1 className="text-2xl font-bold">Sta. Clara</h1>
      <nav className="flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "text-primary font-bold"
                : "text-gray-500"
            }
          >
            {link.label}
          </Link>
        ))}
        <AuthNavbarButton />
      </nav>
    </header>
  );
}
