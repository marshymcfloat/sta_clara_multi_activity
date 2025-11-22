import LoginDialog from "@/components/auth/LoginDialog";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <LoginDialog />
      <div className="flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-widest sm:tracking-[10px] lg:tracking-[20px]">
          Sta. Clara
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 mt-2">
          Multi-activity Platform
        </p>
      </div>
    </main>
  );
}
