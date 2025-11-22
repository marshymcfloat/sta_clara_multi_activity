import Navbar from "@/components/ui/Navbar";
import React from "react";

export default async function layout({
  children,
  params,
}: {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
}) {
  const { userId } = await params;
  return (
    <main className="min-h-screen w-full max-w-screen overflow-x-hidden flex flex-col gap-2">
      <Navbar userId={userId} />
      {children}
    </main>
  );
}
