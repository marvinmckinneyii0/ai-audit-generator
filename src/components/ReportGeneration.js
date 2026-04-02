import React, { useState } from 'react';
import { FileText, Download, Loader, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';

const ReportGeneration = ({ auditId, tier, clientData, solutions, mcdaAnalysis, complianceData }) => {
  const [generating, setGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);

  const generateHTMLContent = () => {
    const tierNames = {
      1: 'Solopreneur Automation Sprint',
      2: 'Small Business Growth Pack',
      3: 'SMB Transformation Suite'
    };

    return `
      <div class="header">
        <h1>AI Audit Report</h1>
        <p>${tierNames[tier]} - ${clientData.company}</p>
        <p class="text-sm">${clientData.industry} | ${clientData.employees} employees</p>
      </div>

      <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <div class="content">
          <p>This comprehensive audit identifies ${solutions.length} automation opportunities for ${clientData.company}.
          Our analysis reveals significant potential for operational efficiency improvements and cost savings through strategic
          AI and automation implementation.</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Recommended Solutions</h2>
        ${solutions.slice(0, tier === 1 ? 5 : tier === 2 ? 12 : 15).map((solution, idx) => `
          <div class="solution-card">
            <div class="solution-title">${idx + 1}. ${solution.name}</div>
            <div class="solution-description">${solution.description}</div>
            <div class="metrics">
              <div class="metric">
                <span class="metric-label">Category:</span>
                <span class="metric-value">${solution.category}</span>
              </div>
              <div class="metric">
                <span class="metric-label">ROI:</span>
                <span class="metric-value">${solution.estimatedROI}%</span>
              </div>
              <div class="metric">
                <span class="metric-label">Implementation:</span>
                <span class="metric-value">${solution.implementationMonths} months</span>
              </div>
              <div class="metric">
                <span class="metric-label">Technical Fit:</span>
                <span class="metric-value">${solution.technicalFit?.toFixed(1)}/5.0</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${tier >= 2 ? `
        <div class="section">
          <h2 class="section-title">MCDA Analysis</h2>
          <div class="subsection">
            <h3 class="subsection-title">Decision Criteria</h3>
            <div class="content">
              <p>Our multi-criteria analysis weighted the following factors:</p>
              ${Object.entries(mcdaAnalysis.criteriaWeights).map(([key, value]) => `
                <div style="margin-bottom: 8px;">
                  <strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${(value * 100).toFixed(0)}%
                </div>
              `).join('')}
            </div>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Risk Assessment</h3>
            <div class="content">
              <p><strong>Technical Debt Score:</strong> ${mcdaAnalysis.technicalDebtScore.toFixed(0)}%</p>
              <p><strong>Overall Risk:</strong> ${mcdaAnalysis.overallRiskAssessment}</p>
            </div>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Implementation Roadmap</h3>
            <div class="content">
              ${mcdaAnalysis.implementationFramework.phases.map((phase, idx) => `
                <div style="margin-bottom: 20px;">
                  <h4 style="color: #0f172a; font-weight: 600; margin-bottom: 8px;">Phase ${idx + 1}: ${phase.name}</h4>
                  <p style="margin-bottom: 8px;"><strong>Focus:</strong> ${phase.focus}</p>
                  <p style="margin-bottom: 8px;"><strong>Expected Outcome:</strong> ${phase.expectedOutcome}</p>
                  <p><strong>Solutions:</strong> ${phase.solutions.join(', ')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${tier >= 2 && complianceData ? `
        <div class="section">
          <h2 class="section-title">Compliance Assessment</h2>
          <div class="subsection">
            <h3 class="subsection-title">Overall Compliance</h3>
            <div class="content">
              <p><strong>Score:</strong> ${complianceData.overallCompliance.score}/100</p>
              <p><strong>Status:</strong> ${complianceData.overallCompliance.status}</p>
              <p><strong>Risk Level:</strong> ${complianceData.overallCompliance.riskLevel}</p>
            </div>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Regulatory Scores</h3>
            <table>
              <thead>
                <tr>
                  <th>Regulation</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(complianceData.scores).map(([key, score]) => `
                  <tr>
                    <td>${key.replace(/Score$/, '').replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td>${score.toFixed(0)}</td>
                    <td>
                      <span class="score-badge ${score >= 85 ? 'score-high' : score >= 70 ? 'score-medium' : 'score-low'}">
                        ${score >= 85 ? 'Strong' : score >= 70 ? 'Moderate' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${complianceData.complianceGaps.critical.length > 0 ? `
            <div class="subsection">
              <h3 class="subsection-title">Critical Compliance Gaps</h3>
              <ul class="recommendation-list">
                ${complianceData.complianceGaps.critical.map(gap => `
                  <li>
                    <strong>${gap.area}:</strong> ${gap.issue}
                    <br><small><em>Action: ${gap.solutions[0]}</em></small>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title">Recommendations</h2>
        <div class="subsection">
          <h3 class="subsection-title">Immediate Actions (Week 1-4)</h3>
          <ul class="recommendation-list">
            ${(mcdaAnalysis?.recommendations?.immediate || []).map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">Short-Term Actions (1-3 Months)</h3>
          <ul class="recommendation-list">
            ${(mcdaAnalysis?.recommendations?.shortTerm || []).map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">Long-Term Strategy (3-12 Months)</h3>
          <ul class="recommendation-list">
            ${(mcdaAnalysis?.recommendations?.longTerm || []).map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Next Steps</h2>
        <div class="content">
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 12px;">Review the recommended solutions and prioritize based on your business goals</li>
            <li style="margin-bottom: 12px;">Begin with immediate actions to build momentum and demonstrate value</li>
            <li style="margin-bottom: 12px;">Allocate budget and resources for the implementation roadmap</li>
            <li style="margin-bottom: 12px;">Establish KPIs and success metrics to track ROI</li>
            <li style="margin-bottom: 12px;">Schedule follow-up consultation to refine the strategy</li>
          </ol>
        </div>
      </div>
    `;
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    setError(null);

    try {
      const htmlContent = generateHTMLContent();
      const reportName = `${clientData.company.replace(/[^a-z0-9]/gi, '_')}_Tier${tier}_Audit`;

      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-report-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            auditId: auditId || `audit_${Date.now()}`,
            htmlContent,
            reportName
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReportUrl(data.pdfUrl || data.htmlUrl);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Final Report Generation
          </h2>
          <p className="text-slate-600">
            Your comprehensive AI audit report is ready to be generated
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Report Includes:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Executive summary and business overview
            </li>
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {solutions.length} recommended automation solutions
            </li>
            {tier >= 2 && (
              <>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Multi-criteria decision analysis
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Implementation roadmap with phases
                </li>
              </>
            )}
            {tier >= 2 && complianceData && (
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Compliance assessment and recommendations
              </li>
            )}
            <li className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Actionable recommendations and next steps
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error Generating Report</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {reportUrl ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Report Generated Successfully!
            </h3>
            <p className="text-green-700 mb-6">
              Your audit report is ready to download
            </p>
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Report
            </a>
          </div>
        ) : (
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="w-full py-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {generating ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Generate Final Report
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;
