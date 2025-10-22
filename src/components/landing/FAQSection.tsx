import { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Got Questions? We Have Answers</h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about PAZZLE and how we connect you with verified workers
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-emerald-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-100"
              >
                <span className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-emerald-600 flex-shrink-0 transition-transform duration-200 ${
                    expandedId === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  expandedId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-6 pb-5">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
            <p className="text-slate-600 mb-4">
              Our team is here to help you find the right workers for your business.
            </p>
            <a
              href="#"
              className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
