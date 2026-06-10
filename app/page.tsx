import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div className="text-8xl mb-4">🚀</div>
        <h1 className="text-5xl font-black text-white tracking-tight">Level Up</h1>
        <p className="text-white/60 text-lg mt-2 text-center">Every swipe makes you smarter.</p>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-sm">
        {['✨ Curiosity Mode', '📚 School Mode', '🎯 Mission Mode', '🏆 Rewards'].map(f => (
          <span key={f} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
            {f}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/child-login"
          className="w-full h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-lg shadow-2xl shadow-violet-600/40 hover:scale-105 transition-transform"
        >
          🎮 I'm a Student
        </Link>
        <Link
          href="/signup"
          className="w-full h-14 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-colors"
        >
          👨‍👩‍👧 Create Family Account
        </Link>
        <Link
          href="/parent-login"
          className="w-full h-12 flex items-center justify-center rounded-2xl text-white/50 font-medium text-sm hover:text-white/80 transition-colors"
        >
          Already have an account? Parent Login →
        </Link>
      </div>

      {/* Safety disclaimer */}
      <p className="text-white/30 text-xs text-center mt-10 max-w-xs leading-relaxed">
        Aligned to curriculum concepts and intended as a learning companion. Not a replacement for classroom instruction.
      </p>
    </main>
  )
}
