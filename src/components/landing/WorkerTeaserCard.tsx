import { User, Lock, Award } from 'lucide-react';

interface WorkerTeaserCardProps {
  name: string;
  age: number;
  occupation: string;
  languages: string[];
  availability: string;
  onViewProfile: () => void;
}

export function WorkerTeaserCard({
  name,
  age,
  occupation,
  languages,
  availability,
  onViewProfile,
}: WorkerTeaserCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-emerald-300 group">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-5">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{name}</h3>
            <p className="text-slate-600 text-sm">{age} years old</p>
            <div className="flex items-center space-x-1 mt-1">
              <Award className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-semibold">Verified</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">Occupation</p>
            <p className="text-slate-900 font-semibold">{occupation}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Availability</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
              {availability}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 mt-5">
          <div className="flex items-center justify-center space-x-2 text-slate-500 mb-3">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Full details require sign in</span>
          </div>
          <button
            onClick={onViewProfile}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <User className="h-4 w-4" />
            <span>View Full Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
