import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import TierSelection from './components/TierSelection';
import ClientDiscovery from './components/ClientDiscovery';
import VoiceUpload from './components/VoiceUpload';
import SolutionsDisplay from './components/SolutionsDisplay';
import MCDAAnalysis from './components/MCDAAnalysis';
import ComplianceAssessment from './components/ComplianceAssessment';
import ReportGeneration from './components/ReportGeneration';
import { auditService } from './services/auditService';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState('tier');
  const [selectedTier, setSelectedTier] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [auditId, setAuditId] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [mcdaAnalysis, setMcdaAnalysis] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'tier', label: 'Tier Selection', show: true },
    { id: 'discovery', label: 'Client Discovery', show: true },
    { id: 'voice', label: 'Voice Upload', show: true },
    { id: 'solutions', label: 'Solutions', show: true },
    { id: 'mcda', label: 'MCDA Analysis', show: selectedTier >= 2 },
    { id: 'compliance', label: 'Compliance', show: selectedTier >= 2 },
    { id: 'report', label: 'Report', show: true }
  ].filter(step => step.show);

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setTimeout(() => setCurrentStep('discovery'), 500);
  };

  const handleClientSubmit = async (data) => {
    setLoading(true);
    try {
      const client = await auditService.createClient(data);
      const audit = await auditService.createAudit(client.id, selectedTier);

      await auditService.saveStakeholderInterview(audit.id, data.stakeholderInterview);

      if (selectedTier === 3 && data.endUserInterview) {
        await auditService.saveEndUserInterview(audit.id, data.endUserInterview);
      }

      setClientData(data);
      setAuditId(audit.id);
      setCurrentStep('voice');
    } catch (error) {
      console.error('Error saving client data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceProcessed = (extractedData) => {
    console.log('Voice data processed:', extractedData);
  };

  const handleVoiceComplete = () => {
    setCurrentStep('solutions');
  };

  const handleSolutionsComplete = async (solutionsList) => {
    setSolutions(solutionsList);

    try {
      await auditService.saveSolutions(auditId, solutionsList);
    } catch (error) {
      console.error('Error saving solutions:', error);
    }

    if (selectedTier >= 2) {
      setCurrentStep('mcda');
    } else {
      setCurrentStep('report');
    }
  };

  const handleMCDAComplete = async (analysis) => {
    setMcdaAnalysis(analysis);

    try {
      await auditService.saveMCDAAnalysis(auditId, {
        criteriaWeights: analysis.criteriaWeights,
        overallRiskAssessment: analysis.overallRiskAssessment,
        technicalDebtScore: analysis.technicalDebtScore,
        implementationFramework: analysis.implementationFramework,
        recommendations: analysis.recommendations
      });
    } catch (error) {
      console.error('Error saving MCDA analysis:', error);
    }

    if (selectedTier >= 2) {
      setCurrentStep('compliance');
    } else {
      setCurrentStep('report');
    }
  };

  const handleComplianceComplete = async (compliance) => {
    setComplianceData(compliance);

    try {
      await auditService.saveComplianceAssessment(auditId, {
        gdprScore: compliance.scores.gdprScore,
        aiActScore: compliance.scores.aiActScore,
        usPrivacyScore: compliance.scores.usPrivacyScore,
        hipaaScore: compliance.scores.hipaaScore,
        pipedaScore: compliance.scores.pipedaScore,
        ukGdprScore: compliance.scores.ukGdprScore,
        industrySpecificScore: compliance.scores.industrySpecificScore,
        complianceGaps: compliance.complianceGaps,
        recommendations: compliance.recommendations
      });

      await auditService.updateAuditStatus(auditId, 'completed');
    } catch (error) {
      console.error('Error saving compliance data:', error);
    }

    setCurrentStep('report');
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Savvy Analytics</h1>
          <p className="text-yellow-100 mt-1">AI Audit Generator</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                      index < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : index === currentStepIndex
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {index < currentStepIndex ? '✓' : index + 1}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium hidden md:inline ${
                      index <= currentStepIndex ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-slate-400 mx-2 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-700 font-medium">Processing...</p>
            </div>
          </div>
        )}

        {currentStep === 'tier' && (
          <TierSelection selectedTier={selectedTier} onSelectTier={handleTierSelect} />
        )}

        {currentStep === 'discovery' && (
          <ClientDiscovery
            tier={selectedTier}
            onSubmit={handleClientSubmit}
            initialData={clientData}
          />
        )}

        {currentStep === 'voice' && (
          <div>
            <VoiceUpload auditId={auditId} onProcessed={handleVoiceProcessed} />
            <div className="max-w-4xl mx-auto px-4 mt-4">
              <button
                onClick={handleVoiceComplete}
                className="w-full py-3 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
              >
                Skip Voice Upload & Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'solutions' && clientData && (
          <SolutionsDisplay
            clientData={clientData}
            tier={selectedTier}
            onComplete={handleSolutionsComplete}
          />
        )}

        {currentStep === 'mcda' && solutions.length > 0 && clientData && (
          <MCDAAnalysis
            solutions={solutions}
            clientData={clientData}
            tier={selectedTier}
            onComplete={handleMCDAComplete}
          />
        )}

        {currentStep === 'compliance' && clientData && solutions.length > 0 && (
          <ComplianceAssessment
            clientData={clientData}
            solutions={solutions}
            onComplete={handleComplianceComplete}
          />
        )}

        {currentStep === 'report' && (
          <ReportGeneration
            auditId={auditId}
            tier={selectedTier}
            clientData={clientData}
            solutions={solutions}
            mcdaAnalysis={mcdaAnalysis}
            complianceData={complianceData}
          />
        )}
      </div>

      <footer className="bg-slate-800 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold text-white mb-2">Savvy Analytics</p>
          <p className="text-sm">AI Audit & Automation Consulting</p>
          <p className="text-xs mt-4 text-slate-400">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
