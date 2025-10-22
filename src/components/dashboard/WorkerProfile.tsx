import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Languages,
  Award,
  Users,
  MessageSquare,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Worker = Database['public']['Tables']['workers']['Row'];
type WorkExperience = Database['public']['Tables']['work_experience']['Row'];
type Language = Database['public']['Tables']['worker_languages']['Row'];
type Skill = Database['public']['Tables']['worker_skills']['Row'];
type Reference = Database['public']['Tables']['worker_references']['Row'];

interface WorkerProfileProps {
  workerId: string;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (workerId: string) => void;
}

export function WorkerProfile({
  workerId,
  onClose,
  isShortlisted,
  onToggleShortlist,
}: WorkerProfileProps) {
  const { employer } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    loadWorkerData();
  }, [workerId]);

  async function loadWorkerData() {
    try {
      const [workerData, expData, langData, skillData, refData] = await Promise.all([
        supabase.from('workers').select('*').eq('id', workerId).maybeSingle(),
        supabase.from('work_experience').select('*').eq('worker_id', workerId).order('start_date', { ascending: false }),
        supabase.from('worker_languages').select('*').eq('worker_id', workerId),
        supabase.from('worker_skills').select('*').eq('worker_id', workerId),
        supabase.from('worker_references').select('*').eq('worker_id', workerId),
      ]);

      if (workerData.error) throw workerData.error;
      setWorker(workerData.data);
      setExperience(expData.data || []);
      setLanguages(langData.data || []);
      setSkills(skillData.data || []);
      setReferences(refData.data || []);
    } catch (error) {
      console.error('Error loading worker data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleContactRequest() {
    if (!employer || !contactMessage.trim()) return;

    setContactLoading(true);
    try {
      const { error } = await supabase.from('contact_requests').insert({
        employer_id: employer.id,
        worker_id: workerId,
        message: contactMessage,
      });

      if (error) throw error;
      setContactSuccess(true);
      setTimeout(() => {
        setShowContactForm(false);
        setContactSuccess(false);
        setContactMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending contact request:', error);
    } finally {
      setContactLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Worker not found</p>
          <button onClick={onClose} className="mt-4 text-blue-600 hover:text-blue-700">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const age = worker.date_of_birth
    ? new Date().getFullYear() - new Date(worker.date_of_birth).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {worker.profile_picture_url ? (
                    <img
                      src={worker.profile_picture_url}
                      alt={worker.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{worker.full_name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    {worker.gender && <span>{worker.gender}</span>}
                    {age && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{age} years</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleShortlist(workerId)}
                className={`p-3 rounded-full transition ${
                  isShortlisted
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Star className={`w-6 h-6 ${isShortlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {worker.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{worker.location}</span>
                </div>
              )}
              {worker.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{worker.email}</span>
                </div>
              )}
              {worker.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{worker.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {worker.availability && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                  {worker.availability}
                </span>
              )}
              {worker.current_status && (
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {worker.current_status}
                </span>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Worker</span>
              </button>
            </div>
          </div>
        </div>

        {showContactForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Contact Request</h3>
            {contactSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Contact request sent successfully!
              </div>
            ) : (
              <>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you're interested in this worker..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleContactRequest}
                    disabled={contactLoading || !contactMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactLoading ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-700">{exp.employer}</p>
                  <p className="text-sm text-gray-500">
                    {exp.start_date && new Date(exp.start_date).toLocaleDateString()} -{' '}
                    {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                  </p>
                  {exp.duties && <p className="text-gray-600 mt-2">{exp.duties}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-sm text-gray-600 ml-2">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Skills & Certifications</h2>
            </div>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium text-gray-900">{skill.skill}</span>
                  {skill.certification && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      {skill.certification}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {references.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">References</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{ref.contact_name}</h3>
                  {ref.position && <p className="text-sm text-gray-600">{ref.position}</p>}
                  <div className="mt-2 space-y-1">
                    {ref.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span>{ref.phone}</span>
                      </div>
                    )}
                    {ref.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4" />
                        <span>{ref.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
