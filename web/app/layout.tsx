import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Wallet, Users, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Polymarket Copy Trading Dashboard',
  description: 'Monitor your copy trading bot performance',
};

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors">
      <Icon size={18} />
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 min-h-screen bg-[#0f0f0f] border-r border-[#2a2a2a] p-4 fixed">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-blue-400">Polymarket</h1>
              <p className="text-sm text-gray-500">Copy Trading Bot</p>
            </div>
            <nav className="space-y-2">
              <NavLink href="/" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink href="/positions" icon={Wallet}>Positions</NavLink>
              <NavLink href="/activities" icon={History}>Activities</NavLink>
              <NavLink href="/traders" icon={Users}>Traders</NavLink>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="card text-center">
                <div className="text-xs text-gray-500">Bot Status</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-400 text-sm">Running</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
