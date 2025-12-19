'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Filter } from 'lucide-react';

interface Activity {
  _id: string;
  traderAddress: string;
  timestamp: number;
  title: string;
  slug: string;
  icon: string;
  side: string;
  asset: string;
  outcome: string;
  size: number;
  usdcSize: number;
  price: number;
  bot: boolean;
  transactionHash: string;
}

interface ActivitiesData {
  activities: Activity[];
  total: number;
  limit: number;
  offset: number;
}

export default function ActivitiesPage() {
  const [data, setData] = useState<ActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bot' | 'trader'>('all');
  const [page, setPage] = useState(0);
  const limit = 50;

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/activities?limit=${limit}&offset=${page * limit}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchActivities();
  }, [page]);

  const filteredActivities = data?.activities.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'bot') return a.bot === true;
    if (filter === 'trader') return a.bot !== true;
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Activities</h1>
        <div className="flex items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-1">
            {(['all', 'bot', 'trader'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'hover:bg-[#2a2a2a]'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={fetchActivities}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="stat-label">Total Activities</p>
          <p className="stat-value mt-1">{data?.total || 0}</p>
        </div>
        <div className="card">
          <p className="stat-label">Bot Trades</p>
          <p className="stat-value mt-1">{data?.activities.filter(a => a.bot).length || 0}</p>
        </div>
        <div className="card">
          <p className="stat-label">Trader Trades</p>
          <p className="stat-value mt-1">{data?.activities.filter(a => !a.bot).length || 0}</p>
        </div>
      </div>

      {/* Activities Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Activity Log</h2>
          <span className="text-gray-400 text-sm">
            Showing {filteredActivities.length} of {data?.total || 0}
          </span>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-[#2a2a2a]">
                  <th className="pb-3 px-4">Time</th>
                  <th className="pb-3 px-4">Market</th>
                  <th className="pb-3 px-4">Side</th>
                  <th className="pb-3 px-4">Outcome</th>
                  <th className="pb-3 px-4">Size</th>
                  <th className="pb-3 px-4">USDC</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Source</th>
                  <th className="pb-3 px-4">Tx</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr key={activity._id} className="table-row">
                    <td className="py-3 px-4 text-gray-400 text-sm whitespace-nowrap">
                      {activity.timestamp
                        ? format(new Date(activity.timestamp * 1000), 'MM/dd HH:mm:ss')
                        : '--'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {activity.icon && (
                          <img src={activity.icon} alt="" className="w-6 h-6 rounded" />
                        )}
                        <span className="truncate max-w-[180px]">{activity.title || activity.slug || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${activity.side === 'BUY' ? 'badge-success' : 'badge-danger'}`}>
                        {activity.side || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{activity.outcome || activity.asset || 'N/A'}</td>
                    <td className="py-3 px-4">{(activity.size || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${(activity.usdcSize || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">{((activity.price || 0) * 100).toFixed(1)}c</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${activity.bot ? 'badge-info' : 'badge-warning'}`}>
                        {activity.bot ? 'Bot' : 'Trader'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {activity.transactionHash ? (
                        <a
                          href={`https://polygonscan.com/tx/${activity.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        '--'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No activities found</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-[#2a2a2a] rounded-lg disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors"
            >
              Previous
            </button>
            <span className="px-4 text-gray-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-[#2a2a2a] rounded-lg disabled:opacity-50 hover:bg-[#3a3a3a] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
