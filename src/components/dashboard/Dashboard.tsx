import { useState, useEffect } from 'react';
import { Search, Filter, LogOut, Star, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { WorkerCard } from './WorkerCard';
import { WorkerProfile } from './WorkerProfile';
import type { Database } from '../../lib/database.types';

type Worker = Database['public']['Tables']['workers']['Row'];

export function Dashboard() {
  const { employer, signOut } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShortlistOnly, setShowShortlistOnly] = useState(false);

  useEffect(() => {
    loadWorkers();
    loadShortlist();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [workers, searchQuery, showShortlistOnly, shortlistedIds]);

  async function loadWorkers() {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadShortlist() {
    if (!employer) return;

    try {
      const { data, error } = await supabase
        .from('shortlisted_workers')
        .select('worker_id')
        .eq('employer_id', employer.id);

      if (error) throw error;
      setShortlistedIds(new Set(data?.map((item) => item.worker_id) || []));
    } catch (error) {
      console.error('Error loading shortlist:', error);
    }
  }

  function filterWorkers() {
    let filtered = workers;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.full_name.toLowerCase().includes(query) ||
          worker.location?.toLowerCase().includes(query) ||
          worker.current_status?.toLowerCase().includes(query)
      );
    }

    if (showShortlistOnly) {
      filtered = filtered.filter((worker) => shortlistedIds.has(worker.id));
    }

    setFilteredWorkers(filtered);
  }

  async function toggleShortlist(workerId: string) {
    if (!employer) return;

    const isShortlisted = shortlistedIds.has(workerId);

    try {
      if (isShortlisted) {
        const { error } = await supabase
          .from('shortlisted_workers')
          .delete()
          .eq('employer_id', employer.id)
          .eq('worker_id', workerId);

        if (error) throw error;

        setShortlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(workerId);
          return next;
        });
      } else {
        const { error } = await supabase
          .from('shortlisted_workers')
          .insert({
            employer_id: employer.id,
            worker_id: workerId,
          });

        if (error) throw error;

        setShortlistedIds((prev) => new Set(prev).add(workerId));
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
    }
  }

  if (selectedWorkerId) {
    return (
      <WorkerProfile
        workerId={selectedWorkerId}
        onClose={() => setSelectedWorkerId(null)}
        isShortlisted={shortlistedIds.has(selectedWorkerId)}
        onToggleShortlist={toggleShortlist}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PAZZLE</h1>
              <p className="text-sm text-gray-600 mt-1">{employer?.company_name}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Worker Database</h2>
                <p className="text-sm text-gray-600">
                  {filteredWorkers.length} {filteredWorkers.length === 1 ? 'worker' : 'workers'} found
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowShortlistOnly(!showShortlistOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showShortlistOnly
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-5 h-5 ${showShortlistOnly ? 'fill-current' : ''}`} />
              <span>Shortlisted ({shortlistedIds.size})</span>
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or status..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No workers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                isShortlisted={shortlistedIds.has(worker.id)}
                onToggleShortlist={toggleShortlist}
                onClick={setSelectedWorkerId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
