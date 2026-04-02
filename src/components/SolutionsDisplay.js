import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Clock, Target, Loader, CircleAlert as AlertCircle } from 'lucide-react';

const SolutionsDisplay = ({ clientData, tier, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState([]);
  const [roiData, setRoiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, [clientData, tier]);

  const fetchSolutions = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/ai-solution-recommender`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clientData,
            tier
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch solutions');
      }

      const data = await response.json();
      setSolutions(data.recommendations);
      setRoiData(data.summary);
    } catch (err) {
      console.error('Error fetching solutions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Loader className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Analyzing Your Business
          </h3>
          <p className="text-slate-600">
            Generating personalized automation solutions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error Loading Solutions</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchSolutions}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Recommended Solutions
        </h2>
        <p className="text-slate-600">
          {solutions.length} automation solutions tailored for your business
        </p>
      </div>

      {roiData && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-slate-900">Average ROI</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {roiData.averageROI}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Avg Implementation</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {roiData.averageImplementationTime} mo
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-slate-900">Total Solutions</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {roiData.totalSolutions}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {solutions.map((solution, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {solution.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {solution.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  {solution.estimatedROI}%
                </div>
                <div className="text-sm text-slate-500">ROI</div>
              </div>
            </div>

            <p className="text-slate-600 mb-4">
              {solution.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm text-slate-600 mb-1">Technical Fit</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(solution.technicalFit / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {solution.technicalFit.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm text-slate-600 mb-1">Budget Fit</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(solution.budgetAlignment / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {solution.budgetAlignment.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm text-slate-600 mb-1">Risk Level</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(solution.riskLevel / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {solution.riskLevel.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm text-slate-600 mb-1">Implementation</div>
                <div className="text-lg font-bold text-slate-900">
                  {solution.implementationMonths} mo
                </div>
              </div>
            </div>

            {solution.monthlyCost !== undefined && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="w-4 h-4" />
                <span>
                  Monthly Cost: ${solution.monthlyCost || 'Free'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => onComplete(solutions)}
          className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Continue to Analysis
        </button>
      </div>
    </div>
  );
};

export default SolutionsDisplay;
