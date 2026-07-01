'use client';

import Link from 'next/link';
import { useAuth } from './lib/auth-context';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'Multiple Game Modes',
      desc: 'Choose from Rapid Fire, Timed Challenges, and more exciting quiz formats.',
    },
    {
      icon: '🏆',
      title: 'Live Leaderboards',
      desc: 'Compete with friends and players worldwide in real-time rankings.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Questions',
      desc: 'Smart question generation adapted to your skill level and interests.',
    },
    {
      icon: '🎨',
      title: 'Custom Categories',
      desc: 'Quizzes across Science, Tech, History, Arts, and many more topics.',
    },
    {
      icon: '👥',
      title: 'Organizations',
      desc: 'Create or join organizations for team-based quizzes and competitions.',
    },
    {
      icon: '🏅',
      title: 'Achievements',
      desc: 'Unlock badges and achievements as you master new challenges.',
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Now - 200+ Active Players
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Challenge Your Mind.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Play & Conquer.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl">
              Dive into an interactive quiz gaming experience. Test your knowledge,
              compete in real-time, and rise to the top of the leaderboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  href="/games"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Play Now
                  <span className="ml-2">🎮</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                    <span className="ml-2">→</span>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center gap-6 text-white/50 text-sm">
              <span>⚡ Free to play</span>
              <span>🏆 Real-time matches</span>
              <span>🔒 Secure & fair</span>
            </div>
          </div>
        </div>
        {/* Decorative robot graphic */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-20">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ViekPlay
              </span>
              ?
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Everything you need for an engaging quiz gaming experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card-hover p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: 'Active Players', value: '10K+' },
              { label: 'Questions', value: '5,000+' },
              { label: 'Game Modes', value: '8' },
              { label: 'Categories', value: '15+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Playing?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join thousands of players and start your quiz journey today.
            No credit card required.
          </p>
          {isAuthenticated ? (
            <Link
              href="/games"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Go to Games 🎮
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Create Free Account
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-zinc-500">
          <p>© 2026 ViekPlay. All rights reserved. Powered by Viek Technologies.</p>
        </div>
      </footer>
    </div>
  );
}