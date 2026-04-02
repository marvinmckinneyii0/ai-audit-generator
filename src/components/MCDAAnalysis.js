import React, { useState, useEffect } from 'react';
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Loader } from 'lucide-react';

const MCDAAnalysis = ({ solutions, clientData, tier, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateAnalysis();
  }, [solutions, clientData, tier]);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-mcda-analysis`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            solutions,
            clientData,
            tier
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error generating analysis:', err);
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
            Running MCDA Analysis
          </h3>
          <p className="text-slate-600">
            Performing multi-criteria decision analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Analysis Error</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={generateAnalysis}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry Analysis
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
          Multi-Criteria Decision Analysis
        </h2>
        <p className="text-slate-600">
          Comprehensive evaluation of recommended solutions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-500" />
            Criteria Weights
          </h3>
          <div className="space-y-3">
            {Object.entries(analysis.criteriaWeights).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              Technical Debt Score
            </h3>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {analysis.technicalDebtScore.toFixed(0)}%
            </div>
            <p className="text-sm text-slate-700">
              {analysis.technicalDebtScore < 30 ? 'Low technical debt - good foundation' :
               analysis.technicalDebtScore < 60 ? 'Moderate debt - manageable' :
               'High debt - consider modernization'}
            </p>
          </div>

          <div className={`rounded-lg p-6 border ${
            analysis.overallRiskAssessment.includes('Low') ? 'bg-green-50 border-green-200' :
            analysis.overallRiskAssessment.includes('Moderate') ? 'bg-yellow-50 border-yellow-200' :
            'bg-orange-50 border-orange-200'
          }`}>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              {analysis.overallRiskAssessment.includes('Low') ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
              Risk Assessment
            </h3>
            <p className="text-sm text-slate-700">
              {analysis.overallRiskAssessment}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Top Scored Solutions
        </h3>
        <div className="space-y-3">
          {analysis.topSolutions.slice(0, 10).map((solution, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index < 3 ? 'bg-yellow-500' : 'bg-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{solution.name}</h4>
                  <p className="text-sm text-slate-600">{solution.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600">
                  {solution.mcdaScore?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-xs text-slate-500">MCDA Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Implementation Framework
        </h3>
        {analysis.implementationFramework.phases.map((phase, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-slate-900">{phase.name}</h4>
            </div>
            <div className="ml-11 space-y-2">
              <p className="text-sm text-slate-700">
                <strong>Focus:</strong> {phase.focus}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Expected Outcome:</strong> {phase.expectedOutcome}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {phase.solutions.map((sol, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                  >
                    {sol}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-slate-700">
            <strong>Total Duration:</strong> {analysis.implementationFramework.totalDuration}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Recommendations
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Immediate Actions
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.immediate.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-red-200">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Short-Term (1-3 months)
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.shortTerm.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-yellow-200">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Long-Term (3-12 months)
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.longTerm.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-green-200">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => onComplete(analysis)}
          className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Continue to Compliance
        </button>
      </div>
    </div>
  );
};

export default MCDAAnalysis;
