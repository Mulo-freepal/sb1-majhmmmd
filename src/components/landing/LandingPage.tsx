import { useEffect, useState } from 'react';
import { Users, Search, Briefcase, Shield, Award, TrendingUp, CheckCircle, Target, Clock, Globe, BookOpen, Zap, Star, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { WorkerTeaserCard } from './WorkerTeaserCard';
import { FAQSection } from './FAQSection';

interface Worker {
  id: string;
  full_name: string;
  date_of_birth: string;
  current_status: string;
  profile_picture_url: string | null;
  availability: string;
}

interface WorkerLanguage {
  language: string;
}

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToSignup }: LandingPageProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerLanguages, setWorkerLanguages] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedWorkers();
  }, []);

  async function loadFeaturedWorkers() {
    try {
      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('id, full_name, date_of_birth, current_status, profile_picture_url, availability')
        .eq('is_featured', true)
        .order('full_name');

      if (workersError) throw workersError;

      const { data: languagesData, error: languagesError } = await supabase
        .from('worker_languages')
        .select('worker_id, language')
        .in('worker_id', workersData?.map(w => w.id) || []);

      if (languagesError) throw languagesError;

      const languagesMap: Record<string, string[]> = {};
      languagesData?.forEach((lang: WorkerLanguage & { worker_id: string }) => {
        if (!languagesMap[lang.worker_id]) {
          languagesMap[lang.worker_id] = [];
        }
        languagesMap[lang.worker_id].push(lang.language);
      });

      setWorkers(workersData || []);
      setWorkerLanguages(languagesMap);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const certificates = [
    { id: 1, title: 'German Language B1 Certificate', type: 'Language', preview: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600' },
    { id: 2, title: 'Industrial Safety Standards', type: 'Safety', preview: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600' },
    { id: 3, title: 'Technical Skills Certification', type: 'Technical', preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600' },
    { id: 4, title: 'Professional Standards Training', type: 'Professional', preview: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">PAZZLE</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={onNavigateToLogin}
                className="text-slate-700 hover:text-emerald-700 font-semibold transition-colors text-sm"
              >
                Sign In
              </button>
              <button
                onClick={onNavigateToSignup}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="h-4 w-4" />
              <span>100% Verified Profiles</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Hire Verified Workers
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Trained for German Standards</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with individually verified workers equipped with German language skills and industrial certifications. No family complications, just skilled professionals ready to contribute.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button
                onClick={onNavigateToSignup}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Find Workers Now
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-slate-700 px-10 py-4 rounded-lg hover:bg-slate-50 transition-all font-semibold text-lg border-2 border-slate-200 hover:border-slate-300"
              >
                Learn More
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{workers.length}+</div>
                <div className="text-slate-600 font-medium">Verified Workers</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">15+</div>
                <div className="text-slate-600 font-medium">Specializations</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-slate-600 font-medium">German Trained</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">98%</div>
                <div className="text-slate-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why PAZZLE Stands Apart</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              The only platform designed specifically for the German market with individually verified workers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Individual Workers Only</h3>
              <p className="text-emerald-100 leading-relaxed">
                No family complications or relocation challenges. Our workers are individually verified professionals ready to adapt and integrate seamlessly into your team.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">German Standards Training</h3>
              <p className="text-emerald-100 leading-relaxed">
                All workers complete comprehensive German language courses and industry-specific training aligned with German industrial standards before joining the platform.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Human Intelligence First</h3>
              <p className="text-emerald-100 leading-relaxed">
                While AI transforms industries, we emphasize emotional intelligence, interpersonal skills, and adaptability that make great employees beyond technical abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Training & Certification</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every worker completes rigorous training programs before joining PAZZLE
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">German Language Courses</h3>
                    <p className="text-slate-600">Structured from A1 to B2 levels</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">Basic conversational German (A1-A2)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">Workplace communication skills (B1)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">Industry-specific vocabulary (B1-B2)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">Cultural integration training</span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Industrial Standards</h3>
                    <p className="text-slate-600">Industry-recognized certifications</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-slate-700">Safety protocols and procedures</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-slate-700">Equipment operation standards</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-slate-700">Quality assurance processes</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-slate-700">Professional conduct training</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Sample Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCertificate(cert.preview)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all text-left group"
                >
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-full h-32 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mb-2">{cert.type}</div>
                  <div className="text-sm font-semibold text-slate-900">{cert.title}</div>
                  <div className="text-xs text-slate-500 mt-2">Click to preview</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Verified Workers</h2>
            <p className="text-xl text-slate-600">Meet some of our certified professionals. Sign in to view full profiles and contact information.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerTeaserCard
                  key={worker.id}
                  name={worker.full_name}
                  age={calculateAge(worker.date_of_birth)}
                  occupation={worker.current_status}
                  languages={workerLanguages[worker.id] || []}
                  availability={worker.availability}
                  onViewProfile={onNavigateToLogin}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Three simple steps to find verified workers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  1
                </div>
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create Your Account</h3>
                <p className="text-slate-600">Sign up as an employer in minutes and get instant access to our database of verified, German-trained workers.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  2
                </div>
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Search & Review</h3>
                <p className="text-slate-600">Browse comprehensive profiles with verified credentials, certifications, language skills, and work experience.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  3
                </div>
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Hire with Confidence</h3>
                <p className="text-slate-600">Contact workers directly, review references, and build your team with professionals ready for German standards.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">Verified Data You Can Trust</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Identity Verification</h4>
                  <p className="text-slate-600 text-sm">All personal information is verified with official documents and background checks.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-3 rounded-lg flex-shrink-0">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Certified Skills</h4>
                  <p className="text-slate-600 text-sm">Every skill and certification is validated through official training programs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Work Experience</h4>
                  <p className="text-slate-600 text-sm">Employment history verified through previous employers and reference contacts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-3 rounded-lg flex-shrink-0">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Language Proficiency</h4>
                  <p className="text-slate-600 text-sm">German language abilities tested and certified at recognized proficiency levels.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Professional References</h4>
                  <p className="text-slate-600 text-sm">Direct contact information for verified professional references.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-3 rounded-lg flex-shrink-0">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Availability Status</h4>
                  <p className="text-slate-600 text-sm">Real-time updates on worker availability and readiness to start.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))] -z-10" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>Join 50+ German Employers</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Start hiring verified, German-trained workers today. No long-term commitments, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={onNavigateToSignup}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold text-lg shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={onNavigateToLogin}
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg border border-white/20"
            >
              Sign In
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PAZZLE</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connecting German employers with verified, trained workers ready to contribute.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Employers</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={onNavigateToSignup} className="hover:text-emerald-400 transition-colors">Create Account</button></li>
                <li><button onClick={onNavigateToLogin} className="hover:text-emerald-400 transition-colors">Sign In</button></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Training Programs</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Certification Standards</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Success Stories</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 PAZZLE. All rights reserved. Connecting verified workers with German employers.</p>
          </div>
        </div>
      </footer>

      {selectedCertificate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedCertificate}
              alt="Certificate preview"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
