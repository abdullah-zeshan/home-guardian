import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="animate-fade-up relative z-10">
        <div className="text-7xl mb-6 animate-float inline-block">🏠</div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Home Guardian
        </h1>

        <p className="text-lg text-zinc-400 mt-4 max-w-md mx-auto">
          Your house, explained. Know what's serious, know what to do.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link
            href="/emergency"
            className="animate-glow px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            🚨 Something's wrong
          </Link>

          <Link
            href="/report"
            className="px-8 py-4 rounded-xl border border-zinc-700 hover:border-orange-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-zinc-900"
          >
            📋 Read my report
          </Link>
        </div>
      </div>
    </div>
  );
}