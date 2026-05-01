import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-2xl w-full text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-white/40 mb-8">
          ERROR / 404
        </p>
        <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-tighter text-white mb-8 text-7xl md:text-9xl">
          OUT
          <br />
          OF BOUNDS
        </h1>
        <p className="text-white/60 text-base md:text-lg mb-10 max-w-md mx-auto">
          The page you are looking for does not exist on this court.
        </p>
        <Link
          href="/"
          className="inline-block font-mono text-xs tracking-[0.3em] uppercase border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-colors"
        >
          Return to baseline
        </Link>
        <p className="font-bebas text-sm tracking-[0.3em] text-white/30 mt-16">
          VICTOR CROSETTO
        </p>
      </div>
    </div>
  );
}
