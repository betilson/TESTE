import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Digital Library Platform
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A modern platform for libraries to register, manage collections, and provide public access to books online.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/libraries">Browse Libraries</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register Your Library</Link>
            </Button>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}