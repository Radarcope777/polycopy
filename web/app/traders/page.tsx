'use client';

import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { RefreshCw, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface Trader {
  address: string;
  name: string;
  profileImage: string;
  totalTrades: number;
  botTrades: number;
  totalPnl: string;
  totalValue: string;
  openPositions: number;
  lastActivity: number | null;
}

interface TradersData {
  traders: Trader[];
  total: number;
}

export default function TradersPage() {
  const [data, setData] = useState<TradersData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTraders = async () => {
    try {
      const res = await fetch('/api/traders');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching traders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tracked Traders</h1>
        <button
          onClick={fetchTraders}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <p className="stat-label">Total Traders</p>
          <p className="stat-value mt-1">{data?.total || 0}</p>
        </div>
        <div className="card">
          <p className="stat-label">Total Bot Trades</p>
          <p className="stat-value mt-1">
            {data?.traders.reduce((sum, t) => sum + t.botTrades, 0) || 0}
          </p>
        </div>
      </div>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.traders.map((trader) => {
          const pnl = parseFloat(trader.totalPnl);
          return (
            <div key={trader.address} className="card">
              <div className="flex items-start gap-4 mb-4">
                {trader.profileImage ? (
                  <img
                    src={trader.profileImage}
                    alt={trader.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">
                      {trader.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{trader.name}</h3>
                  <p className="text-gray-400 text-sm truncate font-mono">
                    {trader.address.slice(0, 6)}...{trader.address.slice(-4)}
                  </p>
                </div>
                <a
                  href={`https://polymarket.com/profile/${trader.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs">Total Trades</p>
                  <p className="font-semibold">{trader.totalTrades}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Bot Trades</p>
                  <p className="font-semibold text-blue-400">{trader.botTrades}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Open Positions</p>
                  <p className="font-semibold">{trader.openPositions}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Position Value</p>
                  <p className="font-semibold">${trader.totalValue}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                <div>
                  <p className="text-gray-400 text-xs">PnL</p>
                  <p className={`font-semibold flex items-center gap-1 ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {pnl >= 0 ? '+' : ''}${trader.totalPnl}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Last Activity</p>
                  <p className="text-sm">
                    {trader.lastActivity
                      ? formatDistanceToNow(new Date(trader.lastActivity * 1000), { addSuffix: true })
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(!data?.traders || data.traders.length === 0) && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No traders are being tracked yet.</p>
          <p className="text-gray-600 mt-2">Start the bot to begin tracking traders.</p>
        </div>
      )}
    </div>
  );
}
