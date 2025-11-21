import LoginDialog from "@/components/auth/LoginDialog";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <LoginDialog />
      <div className="flex flex-col items-center justify-center">
        <h1 className="lg:text-8xl text-6xl font-bold tracking-widest lg:tracking-[20px]">
          Sta. Clara
        </h1>
        <p className=" text-lg lg:text-2xl text-gray-500">
          Multi-activity Platform
        </p>
      </div>
    </main>
  );
}
