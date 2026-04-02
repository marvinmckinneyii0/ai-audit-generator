import React, { useState, useEffect } from 'react';
import { Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Loader, DollarSign } from 'lucide-react';

const ComplianceAssessment = ({ clientData, solutions, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateAssessment();
  }, [clientData, solutions]);

  const generateAssessment = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/compliance-analyzer`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clientData,
            solutions
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate compliance assessment');
      }

      const data = await response.json();
      setAssessment(data.assessment);
    } catch (err) {
      console.error('Error generating assessment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 55) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskBadge = (level) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[level] || colors['Medium'];
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Loader className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Analyzing Compliance
          </h3>
          <p className="text-slate-600">
            Evaluating regulatory requirements...
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
            <h3 className="font-semibold text-red-900 mb-1">Assessment Error</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={generateAssessment}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry Assessment
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
          Compliance Assessment
        </h2>
        <p className="text-slate-600">
          Regulatory analysis for {clientData.jurisdiction} jurisdiction
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 mb-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Overall Compliance Score
            </h3>
            <p className="text-slate-600">{assessment.overallCompliance.status}</p>
          </div>
          <div className={`text-5xl font-bold ${getScoreColor(assessment.overallCompliance.score).split(' ')[0]}`}>
            {assessment.overallCompliance.score}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskBadge(assessment.overallCompliance.riskLevel)}`}>
            {assessment.overallCompliance.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(assessment.scores).map(([key, score]) => (
          <div
            key={key}
            className={`rounded-lg p-6 border ${getScoreColor(score)}`}
          >
            <h4 className="font-semibold text-slate-900 mb-2 capitalize">
              {key.replace(/Score$/, '').replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="text-3xl font-bold mb-2">
              {score.toFixed(0)}
            </div>
            <div className="bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  score >= 85 ? 'bg-green-500' :
                  score >= 70 ? 'bg-yellow-500' :
                  score >= 55 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {(assessment.complianceGaps.critical.length > 0 || assessment.complianceGaps.high.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Compliance Gaps
          </h3>

          {assessment.complianceGaps.critical.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">CRITICAL</span>
                Critical Issues
              </h4>
              <div className="space-y-4">
                {assessment.complianceGaps.critical.map((gap, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-900 mb-2">{gap.area}</h5>
                    <p className="text-sm text-slate-700 mb-2">{gap.issue}</p>
                    <p className="text-sm text-red-700 mb-3">
                      <strong>Impact:</strong> {gap.impact}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gap.solutions.map((sol, i) => (
                        <span key={i} className="px-3 py-1 bg-white text-slate-700 text-xs rounded-full border border-red-200">
                          {sol}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assessment.complianceGaps.high.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded">HIGH</span>
                High Priority Issues
              </h4>
              <div className="space-y-4">
                {assessment.complianceGaps.high.map((gap, idx) => (
                  <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-900 mb-2">{gap.area}</h5>
                    <p className="text-sm text-slate-700 mb-2">{gap.issue}</p>
                    <p className="text-sm text-orange-700 mb-3">
                      <strong>Impact:</strong> {gap.impact}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gap.solutions.map((sol, i) => (
                        <span key={i} className="px-3 py-1 bg-white text-slate-700 text-xs rounded-full border border-orange-200">
                          {sol}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Recommendations
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Immediate Actions
            </h4>
            <ul className="space-y-2">
              {assessment.recommendations.immediate.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-red-200 py-1">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Short-Term Actions
            </h4>
            <ul className="space-y-2">
              {assessment.recommendations.shortTerm.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-yellow-200 py-1">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Long-Term Strategy
            </h4>
            <ul className="space-y-2">
              {assessment.recommendations.longTerm.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-green-200 py-1">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {assessment.estimatedCost && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-8 border border-blue-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Estimated Compliance Cost
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {assessment.estimatedCost.estimatedRange}
              </p>
              <p className="text-sm text-slate-600 mb-4">
                Timeline: {assessment.estimatedCost.timeline}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Legal Review:</span>
                <span className="font-semibold text-slate-900">{assessment.estimatedCost.breakdown.legalReview}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Implementation:</span>
                <span className="font-semibold text-slate-900">{assessment.estimatedCost.breakdown.implementation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Training:</span>
                <span className="font-semibold text-slate-900">{assessment.estimatedCost.breakdown.training}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ongoing:</span>
                <span className="font-semibold text-slate-900">{assessment.estimatedCost.breakdown.ongoing}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={() => onComplete(assessment)}
          className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Generate Final Report
        </button>
      </div>
    </div>
  );
};

export default ComplianceAssessment;
