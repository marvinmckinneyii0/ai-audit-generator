/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { Download, Upload, Edit3, BarChart3, FileText, Mic, Eye, Save, ChevronRight, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const AIAuditGenerator = () => {
  const [activeTab, setActiveTab] = useState('discovery');
  const [selectedTier, setSelectedTier] = useState(3);
  const [clientData, setClientData] = useState({
    company: '',
    industry: '',
    employees: '',
    revenue: '',
    techMaturity: 1,
    painPoints: [],
    currentTools: [],
    budget: '',
    timeline: '',
    jurisdiction: 'US',
    // Template 1 - Stakeholder Interview (Tiers 1-3)
    stakeholderInterview: {
      roleTeamOverview: '',
      teamGoalsKPIs: '',
      teamStructure: '',
      criticalProcesses: '',
      workflowBottlenecks: '',
      timeConsumingTasks: '',
      mainSoftwareTools: '',
      technologyFrustrations: '',
      outsideProcesses: '',
      biggestChallenges: '',
      magicWandProblem: '',
      efficiencyBlockers: '',
      improvementOpportunities: '',
      technologyAdoption: ''
    },
    // Template 2 - End-User Interview (Tier 3 only)
    endUserInterview: {
      typicalDayWeek: '',
      commonDailyTasks: '',
      coreVsAdminTime: '',
      taskStepsWalkthrough: '',
      mostManualTimeConsumingPart: '',
      informationNeeded: '',
      primaryDailySoftware: '',
      toolFrustrations: '',
      dataDoubleEntry: '',
      boringRepetitiveTasks: '',
      assistantTasks: '',
      workTrackingReporting: ''
    }
  });
  
  const [voiceFiles, setVoiceFiles] = useState([]);
  const [mcdaAnalysis, setMcdaAnalysis] = useState(null);
  const [reportPreview, setReportPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [complianceScores, setComplianceScores] = useState(null);

  const tierConfigs = {
    1: {
      name: "Solopreneur Automation Sprint",
      price: "$150",
      target: "Solopreneurs & Freelancers",
      turnaround: "48-72 hours",
      features: ["Quick Process Audit", "3-5 No-Code Solutions", "n8n/Zapier Workflows", "ROI Calculator", "12-Page Action Plan"],
      sections: ['discovery', 'voice', 'solutions', 'report']
    },
    2: {
      name: "Small Business Growth Pack", 
      price: "$375",
      target: "Small Businesses (5-25 employees)",
      turnaround: "5-7 days",
      features: ["Full Process Mapping", "8-12 Automation Solutions", "MCDA Scoring", "Integration Roadmap", "20-Page Strategic Report"],
      sections: ['discovery', 'voice', 'solutions', 'mcda', 'compliance', 'report']
    },
    3: {
      name: "SMB Transformation Suite",
      price: "$750", 
      target: "Medium Businesses (25-100 employees)",
      turnaround: "10-14 days",
      features: ["Complete MCDA Analysis", "Advanced AI Solutions", "Compliance Assessment", "Custom Implementation Plan", "35-Page Executive Report"],
      sections: ['discovery', 'voice', 'solutions', 'mcda', 'compliance', 'editing', 'report']
    }
  };

  // Sample MCDA Solutions Database - Updated for Solopreneurs & SMBs
  const solutionsDatabase = [
    // Quick No-Code Solutions for Solopreneurs
    {
      name: "n8n Workflow Automation",
      category: "No-Code Automation",
      technicalFit: 4.5,
      budgetAlignment: 4.8,
      riskLevel: 4.2,
      strategicImpact: 4.3,
      vendorStability: 4.0,
      implementationMonths: 1,
      estimatedROI: 320,
      description: "Self-hosted workflow automation that connects apps and automates repetitive tasks",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Zapier Business Automation",
      category: "No-Code Automation", 
      technicalFit: 4.7,
      budgetAlignment: 4.2,
      riskLevel: 4.5,
      strategicImpact: 4.0,
      vendorStability: 4.8,
      implementationMonths: 0.5,
      estimatedROI: 280,
      description: "Connect 5000+ apps to automate workflows without coding",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Make.com (Integromat) Scenarios",
      category: "No-Code Automation",
      technicalFit: 4.4,
      budgetAlignment: 4.6,
      riskLevel: 4.1,
      strategicImpact: 4.2,
      vendorStability: 4.3,
      implementationMonths: 1,
      estimatedROI: 290,
      description: "Visual platform for designing, building and automating workflows",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Airtable + Automation",
      category: "Database & Workflow",
      technicalFit: 4.3,
      budgetAlignment: 4.5,
      riskLevel: 4.3,
      strategicImpact: 3.9,
      vendorStability: 4.4,
      implementationMonths: 1,
      estimatedROI: 190,
      description: "Smart database with built-in automations for project and customer management",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Notion AI Workspace",
      category: "Productivity & AI",
      technicalFit: 4.1,
      budgetAlignment: 4.7,
      riskLevel: 4.4,
      strategicImpact: 3.8,
      vendorStability: 4.2,
      implementationMonths: 0.5,
      estimatedROI: 160,
      description: "All-in-one workspace with AI writing, databases, and automation features",
      smbSuitable: true,
      enterpriseSuitable: false,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Customer Service Chatbot (Intercom/Zendesk)",
      category: "Customer Service",
      technicalFit: 4.0,
      budgetAlignment: 3.8,
      riskLevel: 4.1,
      strategicImpact: 4.2,
      vendorStability: 4.5,
      implementationMonths: 2,
      estimatedROI: 210,
      description: "AI-powered customer support to handle common inquiries automatically",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: false,
      budget: "5k-15k"
    }
  ];

  // MCDA Calculation Function - Updated for Budget-Conscious Solutions
  const calculateMCDA = () => {
    const weights = {
      technicalFit: 0.30,
      budgetAlignment: 0.25,
      riskLevel: 0.20,
      strategicImpact: 0.15,
      vendorStability: 0.10
    };

    const isEnterprise = parseInt(clientData.employees) > 100;
    const budget = clientData.budget;
    
    // Filter solutions based on tier and budget
    let filteredSolutions = solutionsDatabase.filter(solution => {
      if (selectedTier === 1) {
        // Solopreneurs need quick wins under $5k
        return solution.quickWin && solution.budget === "under-5k";
      } else if (selectedTier === 2) {
        // Small businesses can handle up to $15k solutions
        return solution.smbSuitable && (solution.budget === "under-5k" || solution.budget === "5k-15k");
      } else {
        // Medium businesses can handle any solution
        return isEnterprise ? solution.enterpriseSuitable : solution.smbSuitable;
      }
    });

    const scoredSolutions = filteredSolutions.map(solution => {
      const compositeScore = (
        solution.technicalFit * weights.technicalFit +
        solution.budgetAlignment * weights.budgetAlignment +
        solution.riskLevel * weights.riskLevel +
        solution.strategicImpact * weights.strategicImpact +
        solution.vendorStability * weights.vendorStability
      );

      return {
        ...solution,
        compositeScore: parseFloat(compositeScore.toFixed(2)),
        confidence: compositeScore >= 4.0 ? 'High' : compositeScore >= 3.5 ? 'Moderate' : 'Low'
      };
    });

    const maxSolutions = selectedTier === 1 ? 3 : selectedTier === 2 ? 6 : 8;
    const highQualitySolutions = scoredSolutions
      .filter(s => s.compositeScore >= 3.5)
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, maxSolutions);

    setMcdaAnalysis({
      solutions: highQualitySolutions,
      portfolioScore: parseFloat((highQualitySolutions.reduce((sum, s) => sum + s.compositeScore, 0) / highQualitySolutions.length).toFixed(2)),
      totalImplementationMonths: Math.max(...highQualitySolutions.map(s => s.implementationMonths)),
      expectedROI: Math.round(highQualitySolutions.reduce((sum, s) => sum + s.estimatedROI, 0) / highQualitySolutions.length),
      riskLevel: highQualitySolutions.every(s => s.confidence === 'High') ? 'Low' : 
                 highQualitySolutions.some(s => s.confidence === 'Low') ? 'High' : 'Moderate'
    });
  };

  // ROI Calculator
  const calculateROI = (solution) => {
    const employees = parseInt(clientData.employees) || 1;
    const avgSalary = 50000; // Adjusted for solopreneurs/SMBs
    const hoursPerWeek = 40;
    const timeSavedPct = 0.20; // Conservative 20%
    
    const hoursSavedWeek = employees * hoursPerWeek * timeSavedPct;
    const hourlyRate = avgSalary / 2080; // 2080 work hours per year
    const weeklySavings = hoursSavedWeek * hourlyRate;
    const annualSavings = weeklySavings * 52;
    
    const implementationCost = selectedTier === 1 ? 3000 : selectedTier === 2 ? 8000 : 25000;
    const roiPercentage = (annualSavings / implementationCost) * 100;

    return {
      hoursSavedWeek: Math.round(hoursSavedWeek),
      annualSavings: Math.round(annualSavings),
      roiPercentage: Math.round(roiPercentage),
      implementationCost
    };
  };

  // Voice File Processing
  const handleVoiceUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const processedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'processing',
        extractedData: null
      };
      
      setVoiceFiles(prev => [...prev, processedFile]);
      
      try {
        let extractedData = null;
        
        if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
          extractedData = await processAudioFile(file);
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          extractedData = await processJSONFile(file);
        } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          extractedData = await processTextFile(file);
        }
        
        setVoiceFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'completed', extractedData } : f
        ));
        
      } catch (error) {
        console.error('Error processing file:', error);
        setVoiceFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error', error: error.message } : f
        ));
      }
    }
  };

  const processAudioFile = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          painPoints: [
            'Manual data entry taking 3-4 hours daily',
            'Customer service response times too slow',
            'Inventory management is reactive, not predictive',
            'Pricing decisions require too much manual analysis'
          ],
          metrics: { 
            employees: Math.floor(Math.random() * 10) + 1,
            timeSpent: `${Math.floor(Math.random() * 15) + 5} hours/week on manual tasks`,
            currentTools: ['Excel', 'Email', 'Manual processes']
          },
          budget: ['$1,000 - $3,000', '$3,000 - $8,000', '$8,000 - $15,000'][Math.floor(Math.random() * 3)],
          timeline: ['2-4 weeks', '1-2 months', '2-3 months'][Math.floor(Math.random() * 3)],
          source: 'Audio transcription'
        });
      }, 2000 + Math.random() * 3000);
    });
  };

  const processJSONFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          resolve({
            painPoints: ['Data extracted from meeting notes', 'Process inefficiencies identified'],
            metrics: { employees: 'Not specified', timeSpent: 'Not specified' },
            budget: 'Discussed in meeting',
            timeline: 'To be determined',
            source: 'JSON meeting export'
          });
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.readAsText(file);
    });
  };

  const processTextFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          resolve({
            painPoints: ['Manual processes identified in notes'],
            metrics: { employees: 'See notes', timeSpent: 'See notes' },
            budget: 'Discussed in notes',
            timeline: 'To be determined',
            source: 'Text notes'
          });
        } catch (error) {
          reject(new Error('Error reading text file'));
        }
      };
      reader.readAsText(file);
    });
  };

  // Add this function to handle auto-filling from voice data
  const autoFillFromVoiceData = () => {
    const completedFiles = voiceFiles.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) return;

    // Combine all extracted data
    const allExtractedData = completedFiles.map(f => f.extractedData);
    
    // Auto-fill basic pain points (already implemented)
    const allPainPoints = allExtractedData.flatMap(data => data.painPoints || []);
    
    // Auto-fill stakeholder interview fields (basic mapping)
    const combinedChallenges = allPainPoints.join('; ');
    const extractedTools = allExtractedData.flatMap(data => data.metrics?.currentTools || []).join(', ');
    
    setClientData(prev => ({
      ...prev,
      painPoints: [...new Set([...prev.painPoints, ...allPainPoints])],
      stakeholderInterview: {
        ...prev.stakeholderInterview,
        biggestChallenges: prev.stakeholderInterview.biggestChallenges || combinedChallenges,
        mainSoftwareTools: prev.stakeholderInterview.mainSoftwareTools || extractedTools,
        magicWandProblem: prev.stakeholderInterview.magicWandProblem || allPainPoints[0] || ''
      }
    }));

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; 
                  padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                  z-index: 9999; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">✅</span>
        <span>Interview templates auto-filled from voice data!</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const applyVoiceData = (extractedData) => {
    setClientData(prev => ({
      ...prev,
      painPoints: extractedData.painPoints,
      employees: extractedData.metrics.employees,
      budget: extractedData.budget,
      timeline: extractedData.timeline
    }));
  };

  const generateComplianceScores = () => {
    const isEU = clientData.jurisdiction === 'EU';
    const isUS = clientData.jurisdiction === 'US';
    
    if (isEU) {
      setComplianceScores({
        type: 'EU',
        gdprScore: 73,
        aiActScore: 45,
        overallRisk: 58,
        riskTier: 'Moderate',
        recommendations: [
          'Implement GDPR-compliant consent management',
          'Establish AI Act compliance documentation',
          'Create data subject rights response procedures'
        ]
      });
    } else if (isUS) {
      setComplianceScores({
        type: 'US',
        piiScore: 42,
        hipaaScore: clientData.industry?.includes('health') ? 68 : 0,
        overallRisk: clientData.industry?.includes('health') ? 55 : 42,
        riskTier: 'Moderate',
        recommendations: [
          'Enhance PII protection protocols',
          'Implement data breach response procedures',
          'Establish third-party vendor assessments'
        ]
      });
    }
  };

// Updated Report Generation Function - Replace your existing one
console.log('API Key:', process.env.REACT_APP_APITEMPLATE_API_KEY);
console.log('Template ID:', process.env.REACT_APP_APITEMPLATE_TEMPLATE_ID);

const generateReport = async () => {
  if (!clientData.company && (!mcdaAnalysis || mcdaAnalysis.solutions.length === 0)) {
    alert('Please complete client discovery and run analysis before generating report.');
    return;
  }

  try {
    // Show loading state
    const loadingDialog = document.createElement('div');
    loadingDialog.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.7); display: flex; align-items: center; 
                  justify-content: center; z-index: 9999;">
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px;">
          <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; 
                      border-top: 3px solid #BD8131; border-radius: 50%; 
                      animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
          <h3 style="margin: 0 0 10px 0; color: #333;">Generating Professional Report</h3>
          <p style="margin: 0; color: #666;">Creating your ${tierConfigs[selectedTier].name}</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This may take 15-30 seconds</p>
        </div>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    document.body.appendChild(loadingDialog);

    // Prepare data for APITemplate.io
    const templateData = {
      title: `${tierConfigs[selectedTier].name} for ${clientData.company || 'Your Organization'}`,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      body: generateReportContent() // This calls your existing content generation
    };

    // Call APITemplate.io API
    const response = await fetch('https://api.apitemplate.io/v2/create-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.REACT_APP_APITEMPLATE_API_KEY
      },
      body: JSON.stringify({
        template_id: process.env.REACT_APP_APITEMPLATE_TEMPLATE_ID,
        data: templateData,
        format: 'pdf',
        filename: `${clientData.company || 'AI-Strategy-Report'}-${tierConfigs[selectedTier].name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`,
        settings: {
          page_size: 'A4',
          margin: '0mm', // Your template already has margins
          print_background: true,
          display_header_footer: false
        }
      })
    });

    // Remove loading dialog
    document.body.removeChild(loadingDialog);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status === 'success') {
      // Download the PDF
      const link = document.createElement('a');
      link.href = result.download_url;
      link.download = result.filename || 'AI-Audit-Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Success notification
      showSuccessNotification('Professional PDF report generated successfully!');
      
    } else {
      throw new Error(result.message || 'PDF generation failed');
    }

  } catch (error) {
    console.error('Report generation error:', error);
    
    // Remove loading dialog if still present
    const loadingDialog = document.querySelector('div[style*="position: fixed"]');
    if (loadingDialog && document.body.contains(loadingDialog)) {
      document.body.removeChild(loadingDialog);
    }
    
    // Enhanced error handling
    let errorMessage = 'Report generation failed. ';
    
    if (error.message.includes('API key')) {
      errorMessage += 'Please check your API key configuration.';
    } else if (error.message.includes('template')) {
      errorMessage += 'Please check your template ID configuration.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage += 'Please check your internet connection and try again.';
    } else {
      errorMessage += 'Please try again or contact support if the problem persists.';
    }
    
    alert(errorMessage);
  }
};

// Helper function for success notifications
const showSuccessNotification = (message) => {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; 
                padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                z-index: 9999; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">✅</span>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 5000);
};

// You'll also need this content generation function - ADD this (don't replace anything)
const generateReportContent = () => {
  const tierConfig = tierConfigs[selectedTier];
  
  if (selectedTier === 1) {
    return generateTier1Content();
  } else if (selectedTier === 2) {
    return generateTier2Content();
  } else {
    return generateTier3Content();
  }
};

const generateTier1Content = () => {
  const solutions = mcdaAnalysis?.solutions?.slice(0, 5) || [];
  
  return `
    <div class="keep-together">
      <h1>Executive Summary</h1>
      <p>This ${tierConfigs[selectedTier].name.toLowerCase()} provides ${clientData.company || 'your organization'} with rapid automation solutions tailored for ${tierConfigs[selectedTier].target.toLowerCase()}.</p>
      
      ${mcdaAnalysis ? `
      <div class="highlight">
        <h3>Key Insight</h3>
        <p>Portfolio implementation will deliver ${mcdaAnalysis.expectedROI}% ROI within ${mcdaAnalysis.totalImplementationMonths} months while maintaining ${mcdaAnalysis.riskLevel.toLowerCase()} risk.</p>
      </div>
      ` : ''}
    </div>

    <div class="keep-together">
      <h1>Key Points</h1>
      <ul>
        ${clientData.painPoints?.slice(0, 5).map(point => `<li>${point}</li>`).join('') || '<li>Complete client discovery to identify pain points</li>'}
      </ul>
    </div>

    ${solutions.map((solution, index) => `
    <div class="keep-together">
      <h1>Solution ${index + 1}: ${solution.name}</h1>
      <p>${solution.description}</p>
      
      <div class="info-box">
        <div class="info-box-title">Implementation Details</div>
        <p><strong>Timeline:</strong> ${solution.implementationMonths < 1 ? 
          Math.round(solution.implementationMonths * 4) + ' weeks' : 
          solution.implementationMonths + ' month' + (solution.implementationMonths > 1 ? 's' : '')}</p>
        <p><strong>Expected ROI:</strong> ${solution.estimatedROI}%</p>
        <p><strong>Confidence Level:</strong> ${solution.confidence}</p>
      </div>
    </div>
    `).join('')}

    <div class="keep-together">
      <h1>Summary</h1>
      <p>The recommended solutions focus on quick automation wins that can be implemented rapidly with minimal disruption to current operations. Total expected ROI: ${mcdaAnalysis?.expectedROI || 'TBD'}%.</p>
    </div>
  `;
};

const generateTier2Content = () => {
  // Add more complex content for Tier 2
  return `
    ${generateTier1Content()}
    
    <div class="keep-together">
      <h1>Part A: Operations Canvas</h1>
      <p>Based on our analysis of ${clientData.company || 'your organization'}, we've identified three core operational engines:</p>
      
      <h2>1. Acquisition Engine</h2>
      <p>How ${clientData.company || 'your organization'} finds and signs new customers.</p>
      
      <h2>2. Delivery Engine</h2>
      <p>How ${clientData.company || 'your organization'} delivers products/services to clients.</p>
      
      <h2>3. Support Engine</h2>
      <p>How ${clientData.company || 'your organization'} handles customer questions and post-sale support.</p>
    </div>

    <div class="keep-together">
      <h1>Part B: Opportunity Matrix</h1>
      <p>Solutions prioritized by impact vs. implementation effort.</p>
      
      <div class="info-box">
        <div class="info-box-title">Implementation Roadmap</div>
        <p><strong>Phase 1:</strong> Quick Wins (1-2 months)</p>
        <p><strong>Phase 2:</strong> Strategic Improvements (3-6 months)</p>
        <p><strong>Expected Total ROI:</strong> ${mcdaAnalysis?.expectedROI || 'TBD'}%</p>
      </div>
    </div>
  `;
};

const generateTier3Content = () => {
  // Add most comprehensive content for Tier 3
  return `
    ${generateTier2Content()}
    
    <div class="keep-together">
      <h1>ROI Analysis</h1>
      <p>Comprehensive financial impact assessment shows significant returns on investment.</p>
      
      <div class="highlight">
        <h3>Financial Impact Summary</h3>
        <p><strong>Implementation Investment:</strong> Estimated $25,000 - $50,000</p>
        <p><strong>Expected Annual Savings:</strong> $${calculateAnnualSavings().toLocaleString()}</p>
        <p><strong>Payback Period:</strong> ${calculatePaybackMonths()} months</p>
      </div>
    </div>

    <div class="keep-together">
      <h1>Next Steps</h1>
      <p>To proceed with implementation:</p>
      <ol>
        <li>Approve Phase 1 Quick Wins for immediate start</li>
        <li>Establish project governance structure</li>
        <li>Begin change management planning</li>
        <li>Schedule monthly progress reviews</li>
      </ol>
    </div>
  `;
};

// Helper functions for Tier 3 calculations
const calculateAnnualSavings = () => {
  const employees = parseInt(clientData.employees) || 5;
  const avgSalary = 65000;
  const hourlyRate = avgSalary / 2080;
  const hoursPerWeek = 40;
  const timeSavedPct = 0.25;
  
  const hoursSavedWeek = employees * hoursPerWeek * timeSavedPct;
  const weeklySavings = hoursSavedWeek * hourlyRate;
  return Math.round(weeklySavings * 52);
};

const calculatePaybackMonths = () => {
  const annualSavings = calculateAnnualSavings();
  const implementationCost = 35000; // Average for Tier 3
  return Math.round(implementationCost / (annualSavings / 12));
};

  // HTML Report Generation
  const generateReportHTML = (data) => {
    const { client, tier, tierConfig, analysis, compliance, voiceFiles, generatedDate } = data;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${tierConfig.name} - ${client.company || 'AI Strategy Report'}</title>
        <meta charset="utf-8">
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 30px; 
                color: #333; 
                line-height: 1.6; 
                background: white;
            }
            .header { 
                display: flex; 
                align-items: center; 
                border-bottom: 4px solid #B8860B; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
            }
            .logo { 
                width: 60px; 
                height: 60px; 
                background: #000; 
                border-radius: 8px; 
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #B8860B;
                font-weight: bold;
                font-size: 24px;
            }
            .company-info h1 { 
                font-size: 28px; 
                font-weight: bold; 
                margin: 0; 
                color: #333;
            }
            .company-info p { 
                color: #B8860B; 
                font-weight: 600; 
                margin: 5px 0 0 0; 
                font-size: 14px;
            }
            .report-title { 
                font-size: 32px; 
                font-weight: bold; 
                margin: 30px 0 10px 0; 
                color: #333;
            }
            .tier-badge {
                background: linear-gradient(135deg, #B8860B, #DAA520);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
            }
            .executive-summary { 
                background: linear-gradient(135deg, #FFF8DC, #F5F5DC); 
                border-left: 5px solid #B8860B; 
                padding: 25px; 
                margin-bottom: 30px; 
                border-radius: 8px; 
            }
            .key-insight { 
                background: #B8860B; 
                color: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                font-weight: 600; 
            }
            .section { margin: 30px 0; }
            .section h2 { 
                color: #333; 
                border-bottom: 2px solid #B8860B; 
                padding-bottom: 10px; 
                font-size: 24px;
            }
            .solution-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
                gap: 20px; 
                margin: 20px 0; 
            }
            .solution-card { 
                border: 2px solid #ddd; 
                border-radius: 12px; 
                padding: 20px; 
                background: #fafafa;
            }
            .solution-name { 
                font-size: 18px; 
                font-weight: bold; 
                color: #333;
            }
            .metrics-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
                gap: 15px; 
                margin: 15px 0; 
            }
            .metric { 
                text-align: center; 
                padding: 15px 10px; 
                background: #f9f9f9; 
                border-radius: 8px; 
                border: 1px solid #eee;
            }
            .metric-value { 
                font-size: 20px; 
                font-weight: bold; 
                color: #B8860B; 
            }
            .metric-label { 
                font-size: 12px; 
                color: #666; 
                margin-top: 5px;
            }
            .footer { 
                text-align: center; 
                margin-top: 50px; 
                padding-top: 20px; 
                border-top: 2px solid #ddd; 
                color: #666; 
            }
            @media print { 
                body { margin: 0; padding: 20px; font-size: 12px; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">SA</div>
            <div class="company-info">
                <h1>SAVVY ANALYTICS</h1>
                <p>Get Savvy with Your Data</p>
            </div>
        </div>

        <div class="tier-badge">${tierConfig.name} - ${tierConfig.price}</div>
        <h1 class="report-title">${tierConfig.name} for ${client.company || 'Your Organization'}</h1>
        <p>Generated: ${generatedDate} | Delivery: ${tierConfig.turnaround}</p>

        <div class="executive-summary">
            <h2>Executive Summary</h2>
            <p>This ${tierConfig.name} provides ${client.company || 'your organization'} with ${tier === 1 ? 'rapid automation solutions' : 'strategic AI implementation guidance'} tailored for ${tierConfig.target.toLowerCase()}.</p>
            
            ${analysis ? `
            <div class="key-insight">
                <strong>KEY INSIGHT:</strong> ${tier === 1 ? 'Quick automation wins can be deployed in ' + analysis.totalImplementationMonths + ' month(s) with ' + analysis.expectedROI + '% ROI.' : 'Portfolio implementation will deliver ' + analysis.expectedROI + '% ROI while maintaining ' + analysis.riskLevel.toLowerCase() + ' risk.'}
            </div>
            ` : ''}
        </div>

        ${analysis ? `
        <div class="section">
            <h2>${tier === 1 ? 'Quick Automation Solutions' : 'AI Solution Recommendations'}</h2>
            <div class="solution-grid">
                ${analysis.solutions.map((solution, index) => `
                <div class="solution-card">
                    <div class="solution-name">${index + 1}. ${solution.name}</div>
                    <p>${solution.description}</p>
                    <div class="metrics-grid">
                        <div class="metric">
                            <div class="metric-value">${solution.implementationMonths < 1 ? Math.round(solution.implementationMonths * 4) + ' weeks' : solution.implementationMonths + ' month' + (solution.implementationMonths > 1 ? 's' : '')}</div>
                            <div class="metric-label">Timeline</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${solution.estimatedROI}%</div>
                            <div class="metric-label">Est. ROI</div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>© 2024 Savvy Analytics LLC. All rights reserved.</strong></p>
            <p>Report delivered within ${tierConfig.turnaround} as promised.</p>
        </div>
    </body>
    </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-yellow-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mr-4 p-2">
                <div className="text-yellow-600 font-bold text-xl">SA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SAVVY ANALYTICS</h1>
                <p className="text-yellow-700 text-sm font-semibold">Get Savvy with Your Data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedTier} 
                onChange={(e) => setSelectedTier(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
              >
                <option value={1}>Tier 1 - {tierConfigs[1].price}</option>
                <option value={2}>Tier 2 - {tierConfigs[2].price}</option>
                <option value={3}>Tier 3 - {tierConfigs[3].price}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tier Info Banner */}
          <div className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{tierConfigs[selectedTier].name}</h2>
                <p className="text-yellow-100">{tierConfigs[selectedTier].target} | {tierConfigs[selectedTier].turnaround} delivery</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{tierConfigs[selectedTier].price}</div>
                <div className="text-sm text-yellow-100">per engagement</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tierConfigs[selectedTier].features.map((feature, i) => (
                <span key={i} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-1">
              {tierConfigs[selectedTier].sections.map((section) => {
                const sectionNames = {
                  discovery: 'Client Discovery',
                  voice: 'Voice Processing', 
                  solutions: 'AI Solutions',
                  mcda: 'MCDA Analysis',
                  compliance: 'Compliance',
                  editing: 'Live Editing',
                  report: 'Generate Report'
                };
                
                const icons = {
                  discovery: <FileText className="w-4 h-4" />,
                  voice: <Mic className="w-4 h-4" />,
                  solutions: <BarChart3 className="w-4 h-4" />,
                  mcda: <TrendingUp className="w-4 h-4" />,
                  compliance: <AlertTriangle className="w-4 h-4" />,
                  editing: <Edit3 className="w-4 h-4" />,
                  report: <Download className="w-4 h-4" />
                };

                return (
                  <button
                    key={section}
                    onClick={() => setActiveTab(section)}
                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === section
                        ? 'border-yellow-600 text-yellow-700 bg-yellow-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {icons[section]}
                    <span>{sectionNames[section]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Client Discovery */}
            {activeTab === 'discovery' && (
              <div className="space-y-6">
                {/* Mandatory Basic Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded mr-2">Required</span>
                    Basic Client Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={clientData.company}
                        onChange={(e) => setClientData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={clientData.industry}
                        onChange={(e) => setClientData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                        required
                      >
                        <option value="">Select industry</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS</option>
                        <option value="consulting">Consulting</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={clientData.employees}
                        onChange={(e) => setClientData(prev => ({ ...prev, employees: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                        required
                      >
                        <option value="">Select team size</option>
                        <option value="1">Solopreneur (Just me)</option>
                        <option value="2-5">2-5 people</option>
                        <option value="6-15">6-15 people</option>
                        <option value="16-50">16-50 people</option>
                        <option value="51-100">51-100 people</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Range <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={clientData.budget}
                        onChange={(e) => setClientData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                        required
                      >
                        <option value="">Select budget</option>
                        <option value="under-1k">Under $1K</option>
                        <option value="1k-3k">$1K - $3K</option>
                        <option value="3k-5k">$3K - $5K</option>
                        <option value="5k-10k">$5K - $10K</option>
                        <option value="over-10k">Over $10K</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Pain Points <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={clientData.painPoints.join('\n')}
                      onChange={(e) => setClientData(prev => ({ 
                        ...prev, 
                        painPoints: e.target.value.split('\n').filter(p => p.trim()) 
                      }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                      placeholder="Enter each pain point on a new line..."
                      required
                    />
                  </div>
                </div>

                {/* Template 1: Stakeholder Interview (All Tiers) */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">Optional</span>
                    Template 1: Stakeholder Interview (30,000-Foot View)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">High-level business goals, team structures, and strategic challenges</p>
                  
                  {/* Role & Team Overview */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                      Role & Team Overview
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role and team's primary responsibilities
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.roleTeamOverview}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, roleTeamOverview: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Describe your role and your team's primary responsibilities"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main goals or KPIs this quarter/year
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.teamGoalsKPIs}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, teamGoalsKPIs: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What are the main goals or KPIs your team is responsible for?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team structure (who reports to whom)
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.teamStructure}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, teamStructure: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Walk me through your team's structure"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Core Processes & Workflow */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                      Core Processes & Workflow
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Most critical processes your team manages
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.criticalProcesses}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, criticalProcesses: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What are the most critical processes your team manages?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biggest bottlenecks or delays in workflow
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.workflowBottlenecks}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, workflowBottlenecks: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Where do you see the biggest bottlenecks or delays?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tasks that consume the most man-hours or resources
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.timeConsumingTasks}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, timeConsumingTasks: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Which tasks seem to consume the most resources?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tools & Technology */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                      Tools & Technology
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main software systems or tools your team relies on
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.mainSoftwareTools}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, mainSoftwareTools: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What are the main software systems or tools your team relies on?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biggest frustrations with current technology stack
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.technologyFrustrations}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, technologyFrustrations: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What are your biggest frustrations with your current technology stack?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Important processes outside main software (spreadsheets, email, manual)
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.outsideProcesses}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, outsideProcesses: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Are there important processes that happen outside of your main software?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pain Points & Strategic Challenges */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                      Pain Points & Strategic Challenges
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biggest challenges your team is facing right now
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.biggestChallenges}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, biggestChallenges: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What are the biggest challenges your team is facing right now?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          One problem you would solve overnight with a magic wand
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.magicWandProblem}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, magicWandProblem: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="If you had a magic wand, what is the one problem you would solve overnight?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          What prevents your team from being more efficient or effective
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.efficiencyBlockers}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, efficiencyBlockers: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="What do you feel is preventing your team from being more efficient?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Future Vision */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs mr-2">5</span>
                      Future Vision
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biggest opportunities for improvement in your department
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.improvementOpportunities}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, improvementOpportunities: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="Where do you see the biggest opportunities for improvement?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          How your team responds to new technology and adoption factors
                        </label>
                        <textarea
                          value={clientData.stakeholderInterview.technologyAdoption}
                          onChange={(e) => setClientData(prev => ({
                            ...prev,
                            stakeholderInterview: { ...prev.stakeholderInterview, technologyAdoption: e.target.value }
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                          placeholder="How does your team generally respond to new technology?"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template 2: End-User Interview (Tier 3 Only) */}
                {selectedTier === 3 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded mr-2">Tier 3 Only</span>
                      Template 2: End-User Interview (On-the-Ground Reality)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Detailed daily tasks and specific operational challenges</p>
                    
                    {/* Daily Role & Responsibilities */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                        Daily Role & Responsibilities
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Typical day or week in your role
                          </label>
                          <textarea
                            value={clientData.endUserInterview.typicalDayWeek}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, typicalDayWeek: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="Can you walk me through a typical day or week in your role?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            1-3 most common tasks performed every day
                          </label>
                          <textarea
                            value={clientData.endUserInterview.commonDailyTasks}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, commonDailyTasks: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="What are the 1-3 most common tasks you perform every day?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time spent on core responsibilities vs administrative tasks (%)
                          </label>
                          <input
                            type="text"
                            value={clientData.endUserInterview.coreVsAdminTime}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, coreVsAdminTime: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="e.g., 60% core work, 40% admin tasks"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Process Deep Dive */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                        Step-by-Step Process Deep Dive
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exact steps to complete a specific, common task
                          </label>
                          <textarea
                            value={clientData.endUserInterview.taskStepsWalkthrough}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, taskStepsWalkthrough: e.target.value }
                            }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="Walk me through the exact steps to complete [specific task like 'onboard a new client' or 'process an invoice']"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Most manual or time-consuming part of that process
                          </label>
                          <textarea
                            value={clientData.endUserInterview.mostManualTimeConsumingPart}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, mostManualTimeConsumingPart: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="Which part of that process is the most manual or takes the most time?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Information needed and where you get it from
                          </label>
                          <textarea
                            value={clientData.endUserInterview.informationNeeded}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, informationNeeded: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="What information do you need to find or reference, and where do you get it from?"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tools & Frustrations */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                        Tools & Frustrations
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Software you spend most of your day working in
                          </label>
                          <textarea
                            value={clientData.endUserInterview.primaryDailySoftware}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, primaryDailySoftware: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="What software do you spend most of your day working in?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Most frustrating aspects of the tools you use
                          </label>
                          <textarea
                            value={clientData.endUserInterview.toolFrustrations}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, toolFrustrations: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="What do you find most frustrating about the tools you have to use?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Double-entry of data or copying-pasting between systems
                          </label>
                          <textarea
                            value={clientData.endUserInterview.dataDoubleEntry}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, dataDoubleEntry: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="Is there any double-entry of data or copying-and-pasting between different systems?"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pain Points & Wishlist */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                        Pain Points & Wishlist
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Most boring or repetitive part of your job
                          </label>
                          <textarea
                            value={clientData.endUserInterview.boringRepetitiveTasks}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, boringRepetitiveTasks: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="What is the most boring or repetitive part of your job?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tasks you would immediately give to an assistant
                          </label>
                          <textarea
                            value={clientData.endUserInterview.assistantTasks}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, assistantTasks: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="If you had an assistant, what tasks would you give them immediately?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            How you currently track work or report progress
                          </label>
                          <textarea
                            value={clientData.endUserInterview.workTrackingReporting}
                            onChange={(e) => setClientData(prev => ({
                              ...prev,
                              endUserInterview: { ...prev.endUserInterview, workTrackingReporting: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 text-sm"
                            placeholder="How do you currently track your work or report on your progress?"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-fill from Voice Files Button */}
                {voiceFiles.length > 0 && voiceFiles.some(f => f.status === 'completed') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Auto-fill from Voice Files</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      You have {voiceFiles.filter(f => f.status === 'completed').length} processed voice file(s). 
                      Auto-fill interview questions with extracted information.
                    </p>
                    <button
                      onClick={() => autoFillFromVoiceData()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Auto-fill Interview Templates
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Voice Processing */}
            {activeTab === 'voice' && tierConfigs[selectedTier].sections.includes('voice') && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Notes & Meeting Files</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Voice Notes & Meeting Files</h4>
                    <p className="text-gray-500 mb-4">
                      Supports: Audio files (MP3, WAV, M4A), Meeting transcripts (JSON), Text notes (TXT), Fireflies/Read.ai exports
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".mp3,.wav,.m4a,.ogg,.json,.txt"
                      onChange={handleVoiceUpload}
                      className="hidden"
                      id="voice-upload"
                    />
                    <label
                      htmlFor="voice-upload"
                      className="inline-flex items-center px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Maximum 10MB per file</p>
                  </div>

                  {voiceFiles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Uploaded Files</h4>
                      <div className="space-y-3">
                        {voiceFiles.map((file, i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{file.name}</span>
                              <div className="flex items-center">
                                {file.status === 'processing' && (
                                  <>
                                    <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-yellow-600 text-sm">Processing...</span>
                                  </>
                                )}
                                {file.status === 'completed' && (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-green-600 text-sm">Completed</span>
                                  </>
                                )}
                                {file.status === 'error' && (
                                  <>
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-red-600 text-sm">Error</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {file.extractedData && (
                              <div className="bg-gray-50 rounded p-3 mt-2">
                                <h5 className="font-medium text-gray-700 mb-2">Extracted Information:</h5>
                                <div className="text-sm text-gray-600 space-y-2">
                                  <div><strong>Source:</strong> {file.extractedData.source || 'Voice/Note Analysis'}</div>
                                  {file.extractedData.painPoints && (
                                    <div>
                                      <strong>Key Issues:</strong>
                                      <ul className="list-disc list-inside ml-2 mt-1">
                                        {file.extractedData.painPoints.slice(0, 3).map((point, idx) => (
                                          <li key={idx} className="text-xs">{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {file.extractedData.budget && (
                                    <div><strong>Budget:</strong> {file.extractedData.budget}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => applyVoiceData(file.extractedData)}
                                  className="mt-3 px-3 py-1 bg-yellow-700 text-white text-sm rounded hover:bg-yellow-800"
                                >
                                  Apply to Client Profile
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Solutions */}
            {activeTab === 'solutions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTier === 1 ? 'Quick Automation Solutions' : 'AI Solution Recommendations'}
                  </h3>
                  <button
                    onClick={calculateMCDA}
                    className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {selectedTier === 3 ? 'Run MCDA Analysis' : 'Generate Solutions'}
                  </button>
                </div>

                {mcdaAnalysis && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mcdaAnalysis.solutions.map((solution, i) => {
                      const roi = calculateROI(solution);
                      return (
                        <div key={i} className="border border-gray-200 rounded-lg p-6 hover:border-yellow-600 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-gray-900">{solution.name}</h4>
                            {selectedTier >= 2 && (
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                solution.compositeScore >= 4.0 ? 'bg-green-100 text-green-800' :
                                solution.compositeScore >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {solution.compositeScore}/5.0
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4">{solution.description}</p>
                          
                          <div className="bg-gray-50 rounded p-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Implementation:</span>
                                <div className="font-medium">
                                  {solution.implementationMonths < 1 ? 
                                    `${Math.round(solution.implementationMonths * 4)} weeks` : 
                                    `${solution.implementationMonths} month${solution.implementationMonths > 1 ? 's' : ''}`
                                  }
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Expected ROI:</span>
                                <div className="font-medium text-green-600">{solution.estimatedROI}%</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Confidence:</span>
                                <div className="font-medium">{solution.confidence}</div>
                              </div>
                              {selectedTier === 1 && (
                                <div>
                                  <span className="text-gray-500">Budget:</span>
                                  <div className="font-medium">Under $5K</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!mcdaAnalysis && (
                  <div className="text-center text-gray-500 py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Click "Generate Solutions" to analyze opportunities for your client</p>
                  </div>
                )}
              </div>
            )}

            {/* MCDA Analysis (Tier 2+ Only) */}
            {activeTab === 'mcda' && selectedTier >= 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Multi-Criteria Decision Analysis</h3>
                
                {mcdaAnalysis && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-700 to-yellow-800 text-white p-4">
                      <h4 className="font-semibold">Portfolio Analysis Summary</h4>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-700">{mcdaAnalysis.portfolioScore}</div>
                          <div className="text-sm text-gray-500">Portfolio Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-700">{mcdaAnalysis.totalImplementationMonths}</div>
                          <div className="text-sm text-gray-500">Months Timeline</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-700">{mcdaAnalysis.expectedROI}%</div>
                          <div className="text-sm text-gray-500">Expected ROI</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            mcdaAnalysis.riskLevel === 'Low' ? 'text-green-600' :
                            mcdaAnalysis.riskLevel === 'Moderate' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {mcdaAnalysis.riskLevel}
                          </div>
                          <div className="text-sm text-gray-500">Risk Level</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Compliance Analysis */}
            {activeTab === 'compliance' && tierConfigs[selectedTier].sections.includes('compliance') && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Compliance Risk Assessment</h3>
                  <button
                    onClick={generateComplianceScores}
                    className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800"
                  >
                    Generate Assessment
                  </button>
                </div>

                {complianceScores && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className={`w-6 h-6 mr-2 ${
                        complianceScores.riskTier === 'Low' ? 'text-green-500' :
                        complianceScores.riskTier === 'Moderate' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                      <h4 className="font-semibold text-gray-900">
                        {complianceScores.type} Compliance Risk: {complianceScores.riskTier}
                      </h4>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Priority Recommendations</h5>
                      <ul className="space-y-1">
                        {complianceScores.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center">
                            <ChevronRight className="w-4 h-4 text-yellow-700 mr-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Editing (Tier 3 Only) */}
            {activeTab === 'editing' && selectedTier === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Report Customization</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      editMode 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-yellow-700 text-white hover:bg-yellow-800'
                    }`}
                  >
                    {editMode ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                    {editMode ? 'Save Changes' : 'Enable Editing'}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Content Customization</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                      <input
                        type="text"
                        defaultValue="Strategic AI Implementation Plan"
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Executive Summary</label>
                      <textarea
                        rows={4}
                        disabled={!editMode}
                        defaultValue="This strategic analysis provides your organization with actionable AI implementation guidance tailored to your specific business needs and constraints."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Report */}
            {activeTab === 'report' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Generate Professional Report</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setReportPreview(!reportPreview)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {reportPreview ? 'Hide Preview' : 'Preview'}
                    </button>
                    <button
                      className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 flex items-center"
                      onClick={generateReport}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Report Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Service Level:</span>
                      <div className="font-medium">{tierConfigs[selectedTier].name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery Time:</span>
                      <div className="font-medium">{tierConfigs[selectedTier].turnaround}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Solutions Analyzed:</span>
                      <div className="font-medium">{mcdaAnalysis ? mcdaAnalysis.solutions.length : 'Run analysis first'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Report Pages:</span>
                      <div className="font-medium">{selectedTier === 1 ? '12' : selectedTier === 2 ? '20' : '35'} pages</div>
                    </div>
                  </div>
                </div>

                {reportPreview && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900">Report Preview</h4>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center mb-6 border-b border-yellow-600 pb-4">
                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mr-4">
                          <div className="text-yellow-600 font-bold text-xl">SA</div>
                        </div>
                        <div>
                          <h1 className="text-xl font-bold text-gray-900">SAVVY ANALYTICS</h1>
                          <p className="text-yellow-700 text-sm font-semibold">Get Savvy with Your Data</p>
                        </div>
                      </div>

                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {tierConfigs[selectedTier].name} for {clientData.company || 'Your Organization'}
                      </h1>
                      <p className="text-gray-600 mb-6">
                        Delivery: {tierConfigs[selectedTier].turnaround} | Target: {tierConfigs[selectedTier].target}
                      </p>

                      {mcdaAnalysis && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
                          <h2 className="font-semibold text-gray-900 mb-2">Executive Summary</h2>
                          <p className="text-gray-700 text-sm">
                            Analysis of {mcdaAnalysis.solutions.length} solutions with portfolio score of {mcdaAnalysis.portfolioScore}/5.0. 
                            Expected {mcdaAnalysis.expectedROI}% ROI over {mcdaAnalysis.totalImplementationMonths} months implementation.
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 text-center border-t border-gray-200 pt-4">
                        <p>© 2024 Savvy Analytics LLC. All rights reserved.</p>
                        <p className="mt-1">This is a preview. The full report will contain detailed analysis and recommendations.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAuditGenerator;
