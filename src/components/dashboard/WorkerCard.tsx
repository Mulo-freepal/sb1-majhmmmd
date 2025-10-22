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
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
      onClick={() => onClick(worker.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {worker.profile_picture_url ? (
                <img
                  src={worker.profile_picture_url}
                  alt={worker.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{worker.full_name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
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
            className={`p-2 rounded-full transition ${
              isShortlisted
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Star className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {worker.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{worker.location}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          {worker.availability && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
              {worker.availability}
            </span>
          )}
          {worker.current_status && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {worker.current_status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
