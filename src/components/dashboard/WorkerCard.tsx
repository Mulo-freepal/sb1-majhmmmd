import { MapPin, Calendar, Star, User } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Worker = Database['public']['Tables']['workers']['Row'];

interface WorkerCardProps {
  worker: Worker;
  isShortlisted: boolean;
  onToggleShortlist: (workerId: string) => void;
  onClick: (workerId: string) => void;
}

export function WorkerCard({ worker, isShortlisted, onToggleShortlist, onClick }: WorkerCardProps) {
  const age = worker.date_of_birth
    ? new Date().getFullYear() - new Date(worker.date_of_birth).getFullYear()
    : null;

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-slate-200 hover:border-emerald-300 group"
      onClick={() => onClick(worker.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all">
              {worker.profile_picture_url ? (
                <img
                  src={worker.profile_picture_url}
                  alt={worker.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-emerald-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{worker.full_name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1 font-medium">
                {worker.gender && <span>{worker.gender}</span>}
                {age && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{age} years</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(worker.id);
            }}
            className={`p-2 rounded-full transition-all ${
              isShortlisted
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
          >
            <Star className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {worker.location && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{worker.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm flex-wrap">
          {worker.availability && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold">
              {worker.availability}
            </span>
          )}
          {worker.current_status && (
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full font-semibold">
              {worker.current_status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
