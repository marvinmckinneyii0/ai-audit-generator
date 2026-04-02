import React, { useState } from 'react';
import { Building2, Users, DollarSign, Target, CircleAlert as AlertCircle } from 'lucide-react';

const ClientDiscovery = ({ tier, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    company: initialData.company || '',
    industry: initialData.industry || '',
    employees: initialData.employees || '',
    revenue: initialData.revenue || '',
    techMaturity: initialData.techMaturity || 3,
    jurisdiction: initialData.jurisdiction || 'US',
    budget: initialData.budget || '',
    timeline: initialData.timeline || '',
    painPoints: initialData.painPoints || [],
    currentTools: initialData.currentTools || [],
    stakeholderInterview: initialData.stakeholderInterview || {
      roleTeamOverview: '',
      teamGoalsKPIs: '',
      criticalProcesses: '',
      workflowBottlenecks: '',
      timeConsumingTasks: '',
      mainSoftwareTools: '',
      biggestChallenges: '',
      magicWandProblem: '',
      improvementOpportunities: ''
    },
    endUserInterview: tier === 3 ? (initialData.endUserInterview || {
      typicalDayWeek: '',
      commonDailyTasks: '',
      mostManualTimeConsumingPart: '',
      toolFrustrations: '',
      boringRepetitiveTasks: ''
    }) : {}
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInterviewChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.employees) newErrors.employees = 'Employee count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Client Discovery
          </h2>
          <p className="text-slate-600">
            Help us understand your business to provide tailored recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-500" />
              Business Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none ${
                    errors.company ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Acme Corp"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry *
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none ${
                    errors.industry ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="SaaS, Healthcare, Manufacturing..."
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.industry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Employees *
                </label>
                <select
                  value={formData.employees}
                  onChange={(e) => handleChange('employees', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none ${
                    errors.employees ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select range</option>
                  <option value="1-5">1-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-50">26-50</option>
                  <option value="51-100">51-100</option>
                  <option value="100+">100+</option>
                </select>
                {errors.employees && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.employees}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Annual Revenue
                </label>
                <select
                  value={formData.revenue}
                  onChange={(e) => handleChange('revenue', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="">Select range</option>
                  <option value="under $100k">Under $100k</option>
                  <option value="$100k-$500k">$100k-$500k</option>
                  <option value="$500k-$1M">$500k-$1M</option>
                  <option value="$1M-$5M">$1M-$5M</option>
                  <option value="$5M-$10M">$5M-$10M</option>
                  <option value="over $10M">Over $10M</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Jurisdiction
                </label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="US">United States</option>
                  <option value="EU">European Union</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tech Maturity (1-5)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.techMaturity}
                    onChange={(e) => handleChange('techMaturity', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-yellow-600 w-8 text-center">
                    {formData.techMaturity}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Basic</span>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-500" />
              Stakeholder Interview
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What are your team's biggest challenges?
                </label>
                <textarea
                  value={formData.stakeholderInterview.biggestChallenges}
                  onChange={(e) => handleInterviewChange('stakeholderInterview', 'biggestChallenges', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  rows="3"
                  placeholder="Describe the main challenges your team faces..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What are your critical processes?
                </label>
                <textarea
                  value={formData.stakeholderInterview.criticalProcesses}
                  onChange={(e) => handleInterviewChange('stakeholderInterview', 'criticalProcesses', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  rows="3"
                  placeholder="List your mission-critical business processes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What workflow bottlenecks do you experience?
                </label>
                <textarea
                  value={formData.stakeholderInterview.workflowBottlenecks}
                  onChange={(e) => handleInterviewChange('stakeholderInterview', 'workflowBottlenecks', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  rows="3"
                  placeholder="Where does work get stuck or slow down..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What software tools do you currently use?
                </label>
                <textarea
                  value={formData.stakeholderInterview.mainSoftwareTools}
                  onChange={(e) => handleInterviewChange('stakeholderInterview', 'mainSoftwareTools', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  rows="2"
                  placeholder="List your main tools and software..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  If you had a magic wand, what problem would you solve?
                </label>
                <textarea
                  value={formData.stakeholderInterview.magicWandProblem}
                  onChange={(e) => handleInterviewChange('stakeholderInterview', 'magicWandProblem', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  rows="3"
                  placeholder="Describe your ideal solution..."
                />
              </div>
            </div>
          </div>

          {tier === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-500" />
                End-User Interview (Tier 3)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe a typical day or week
                  </label>
                  <textarea
                    value={formData.endUserInterview.typicalDayWeek}
                    onChange={(e) => handleInterviewChange('endUserInterview', 'typicalDayWeek', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    rows="3"
                    placeholder="Walk us through your typical workday..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What are your most common daily tasks?
                  </label>
                  <textarea
                    value={formData.endUserInterview.commonDailyTasks}
                    onChange={(e) => handleInterviewChange('endUserInterview', 'commonDailyTasks', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    rows="3"
                    placeholder="List your recurring daily tasks..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What boring, repetitive tasks take up your time?
                  </label>
                  <textarea
                    value={formData.endUserInterview.boringRepetitiveTasks}
                    onChange={(e) => handleInterviewChange('endUserInterview', 'boringRepetitiveTasks', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    rows="3"
                    placeholder="What tasks would you automate if you could..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
              Continue to Analysis
              <DollarSign className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientDiscovery;
