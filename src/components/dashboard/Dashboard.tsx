import { useState, useEffect } from 'react';
import { Search, Filter, LogOut, Star, Users, Briefcase } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">PAZZLE</span>
                <p className="text-xs text-slate-600">{employer?.company_name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-emerald-700 font-semibold transition-colors rounded-lg hover:bg-emerald-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Worker Database</h2>
                <p className="text-sm text-slate-600 font-medium">
                  {filteredWorkers.length} {filteredWorkers.length === 1 ? 'worker' : 'workers'} found
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowShortlistOnly(!showShortlistOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md ${
                showShortlistOnly
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
              }`}
            >
              <Star className={`w-5 h-5 ${showShortlistOnly ? 'fill-current' : ''}`} />
              <span>Shortlisted ({shortlistedIds.size})</span>
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or status..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md text-slate-700 placeholder-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md font-semibold text-slate-700">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 mt-4 font-medium">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-slate-600 font-medium text-lg">No workers found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
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
