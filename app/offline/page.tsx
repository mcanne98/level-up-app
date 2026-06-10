export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0f0a1e] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl mb-6">📡</div>
      <h1 className="text-4xl font-black text-white mb-3">You&apos;re Offline</h1>
      <p className="text-white/60 mb-8 max-w-xs">
        No internet connection detected. Some lessons are available offline once you&apos;ve visited them.
      </p>
      <a
        href="/child/feed"
        className="px-8 py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-colors"
      >
        Try Again
      </a>
    </main>
  )
}
