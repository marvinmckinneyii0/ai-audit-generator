import React, { useState } from 'react';
import './App.css';
import { 
  Upload, 
  FileText, 
  Building2, 
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Eye,
  Download,
  Shield,
  Edit3,
  X
} from 'lucide-react';

function App() {
  // State Management
  const [selectedTier, setSelectedTier] = useState(1);
  const [currentSection, setCurrentSection] = useState('discovery');
  const [clientData, setClientData] = useState({
    company: '',
    industry: '',
    employees: '',
    budget: '',
    painPoints: [],
    currentTools: [],
    desiredOutcomes: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    businessProcesses: null,
    orgChart: null,
    systemsInventory: null
  });
  const [voiceFiles, setVoiceFiles] = useState({
    customerSuccess: null,
    employeeInterview: null,
    workTrackingReporting: ''
  });
  const [mcdaAnalysis, setMcdaAnalysis] = useState(null);
  const [reportPreview, setReportPreview] = useState(false);
  
  // Tier configurations
  const tierConfigs = {
    1: {
      name: "Solopreneur Quick Wins",
      price: "$297",
      turnaround: "3 business days",
      target: "Solo entrepreneurs & 1-5 employee teams",
      features: ["5 Automation Recommendations", "ROI Calculations", "Quick Implementation Guide", "8-Page Strategic Report"],
      sections: ['discovery', 'voice', 'solutions', 'report']
    },
    2: {
      name: "Small Business Solution",
      price: "$697",
      turnaround: "5 business days",
      target: "Small businesses (5-50 employees)",
      features: ["Full Process Mapping", "8-12 Automation Solutions", "MCDA Scoring", "Integration Roadmap", "20-Page Strategic Report"],
      sections: ['discovery', 'voice', 'solutions', 'mcda', 'compliance', 'report']
    },
    3: {
      name: "Medium Business Deep Dive",
      price: "$1,497",
      turnaround: "7 business days",
      target: "Medium businesses (50-200 employees)",
      features: ["Complete MCDA Analysis", "Advanced AI Solutions", "Compliance Assessment", "Custom Implementation Plan", "35-Page Executive Report"],
      sections: ['discovery', 'voice', 'solutions', 'mcda', 'compliance', 'editing', 'report']
    }
  };

  // Sample MCDA Solutions Database - Updated for Solopreneurs & SMBs
  const solutionsDatabase = [
    {
      name: "AI Email Assistant",
      category: "Communication Automation",
      description: "Automated email drafting and response system using GPT-4 for customer inquiries and internal communications",
      technicalFit: 4.8,
      budgetAlignment: 4.9,
      riskLevel: 4.7,
      strategicImpact: 4.5,
      vendorStability: 4.8,
      implementationMonths: 0.5,
      estimatedROI: 280,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Document Processing Automation",
      category: "Process Automation",
      description: "OCR and AI-powered document classification, extraction, and filing system",
      technicalFit: 4.6,
      budgetAlignment: 4.5,
      riskLevel: 4.3,
      strategicImpact: 4.8,
      vendorStability: 4.7,
      implementationMonths: 1.5,
      estimatedROI: 320,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: false,
      budget: "5k-15k"
    },
    {
      name: "Chatbot Customer Service",
      category: "Customer Service",
      description: "24/7 automated customer support chatbot with escalation to human agents",
      technicalFit: 4.7,
      budgetAlignment: 4.8,
      riskLevel: 4.5,
      strategicImpact: 4.6,
      vendorStability: 4.9,
      implementationMonths: 1.0,
      estimatedROI: 250,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Automated Bookkeeping",
      category: "Financial Automation",
      description: "AI-powered expense categorization, invoice processing, and financial reporting",
      technicalFit: 4.9,
      budgetAlignment: 4.8,
      riskLevel: 4.6,
      strategicImpact: 4.7,
      vendorStability: 4.8,
      implementationMonths: 0.75,
      estimatedROI: 300,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: false,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Sales Lead Scoring AI",
      category: "Sales Automation",
      description: "Machine learning model to score and prioritize sales leads based on conversion probability",
      technicalFit: 4.4,
      budgetAlignment: 4.3,
      riskLevel: 4.2,
      strategicImpact: 4.9,
      vendorStability: 4.5,
      implementationMonths: 2.0,
      estimatedROI: 380,
      confidence: "Moderate",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: false,
      budget: "5k-15k"
    },
    {
      name: "Content Generation Platform",
      category: "Marketing Automation",
      description: "AI-powered content creation for blogs, social media, and marketing materials",
      technicalFit: 4.7,
      budgetAlignment: 4.9,
      riskLevel: 4.8,
      strategicImpact: 4.4,
      vendorStability: 4.6,
      implementationMonths: 0.5,
      estimatedROI: 220,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: true,
      budget: "under-5k"
    },
    {
      name: "Workflow Automation Platform",
      category: "Process Integration",
      description: "No-code platform to automate repetitive tasks across different software tools",
      technicalFit: 4.5,
      budgetAlignment: 4.6,
      riskLevel: 4.7,
      strategicImpact: 4.8,
      vendorStability: 4.9,
      implementationMonths: 1.0,
      estimatedROI: 260,
      confidence: "High",
      smbSuitable: true,
      enterpriseSuitable: true,
      quickWin: false,
      budget: "5k-15k"
    },
    {
      name: "Predictive Analytics Dashboard",
      category: "Business Intelligence",
      description: "AI-driven analytics platform for sales forecasting and business insights",
      technicalFit: 4.2,
      budgetAlignment: 4.0,
      riskLevel: 3.9,
      strategicImpact: 4.7,
      vendorStability: 4.4,
      implementationMonths: 3.0,
      estimatedROI: 340,
      confidence: "Moderate",
      smbSuitable: false,
      enterpriseSuitable: true,
      quickWin: false,
      budget: "5k-15k"
    }
  ];

  // MCDA Calculation Function - Updated for Budget-Conscious Solutions
  const calculateMCDA = () => {
    if (!clientData.company || clientData.painPoints.length === 0) {
      alert('Please complete client discovery before running analysis.');
      return;
    }

    const weights = {
      technicalFit: 0.30,
      budgetAlignment: 0.25,
      riskLevel: 0.20,
      strategicImpact: 0.15,
      vendorStability: 0.10
    };

    const isEnterprise = parseInt(clientData.employees) > 100;
    
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

  // Perplexity API Integration for Tier 3 Advanced Research
  const perplexityResearch = async (clientData, analysisType) => {
    const PERPLEXITY_API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      console.warn('Perplexity API key not configured - using mock data');
      return {
        analysis: `Mock analysis for ${analysisType}: Based on industry best practices for ${clientData.industry}, 
                   we recommend focusing on automation and AI-driven solutions to address the identified pain points.`,
        sources: [],
        timestamp: new Date().toISOString()
      };
    }

    const researchPrompts = {
      businessProblem: `Analyze AI implementation challenges for ${clientData.industry} companies with ${clientData.employees} employees. Focus on:
      1. Common business problems requiring AI solutions
      2. Measurable KPIs for AI ROI in this industry
      3. Specific pain points: ${clientData.painPoints.join(', ')}
      4. Budget considerations for ${clientData.budget} range
      Provide actionable insights for defining clear business objectives.`,

      dataStrategy: `Research data acquisition and preparation strategies for ${clientData.industry} with team size ${clientData.employees}. Consider:
      1. Industry-specific data sources and types
      2. Data quality challenges common in this sector
      3. Feature engineering best practices
      4. Data governance and compliance requirements
      5. Technical debt considerations in existing data infrastructure
      Focus on practical, implementable solutions.`,

      eda: `Analyze exploratory data analysis approaches for ${clientData.industry} companies. Research:
      1. Industry-specific data patterns and trends
      2. Common biases in ${clientData.industry} data
      3. Visualization techniques for business stakeholders
      4. Tools and platforms suitable for ${clientData.employees} team size
      5. Areas where additional data collection typically needed
      Emphasize practical EDA workflows for business teams.`,

      modelDevelopment: `Research AI model development strategies for ${clientData.industry} with budget ${clientData.budget}. Focus on:
      1. Appropriate ML models for common ${clientData.industry} use cases
      2. Model evaluation metrics relevant to business goals
      3. Technical debt considerations in model selection
      4. Development tools suitable for team size ${clientData.employees}
      5. Performance benchmarks for this industry
      Prioritize practical, proven approaches over cutting-edge research.`,

      deployment: `Analyze AI deployment and implementation strategies for ${clientData.industry}. Research:
      1. Production deployment best practices for ${clientData.employees} teams
      2. Change management for AI adoption
      3. Integration with existing systems and workflows
      4. Monitoring and maintenance requirements
      5. Technical debt mitigation during deployment
      6. Actionable insights generation from model outputs
      Focus on sustainable, long-term implementation approaches.`
    };

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI implementation consultant. Provide practical, actionable insights based on current industry research and real-world implementations. Focus on proven solutions over theoretical approaches.'
            },
            {
              role: 'user',
              content: researchPrompts[analysisType]
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        analysis: result.choices[0].message.content,
        sources: result.citations || [],
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Perplexity research error:', error);
      // Return mock data on error
      return {
        analysis: `Analysis for ${analysisType}: Based on industry best practices, we recommend focusing on proven solutions.`,
        sources: [],
        timestamp: new Date().toISOString()
      };
    }
  };

  // Enhanced MCDA Analysis with Perplexity Research
  const calculateAdvancedMCDA = async () => {
    if (selectedTier !== 3) {
      calculateMCDA(); // Use regular MCDA for Tiers 1-2
      return;
    }

    try {
      // Show loading state
      setMcdaAnalysis({ loading: true });

      // Conduct Perplexity research across all 5 areas
      const researchResults = await Promise.all([
        perplexityResearch(clientData, 'businessProblem'),
        perplexityResearch(clientData, 'dataStrategy'),
        perplexityResearch(clientData, 'eda'),
        perplexityResearch(clientData, 'modelDevelopment'),
        perplexityResearch(clientData, 'deployment')
      ]);

      // Enhanced weights for Tier 3 analysis
      const enhancedWeights = {
        technicalFit: 0.25,
        budgetAlignment: 0.20,
        riskLevel: 0.20,
        strategicImpact: 0.15,
        vendorStability: 0.10,
        technicalDebt: 0.10  // New criterion
      };

      // Filter solutions for Tier 3 with technical debt considerations
      const tier3Solutions = solutionsDatabase.map(solution => ({
        ...solution,
        technicalDebt: calculateTechnicalDebtScore(solution, clientData),
        researchInsights: extractRelevantInsights(solution, researchResults)
      }));

      const scoredSolutions = tier3Solutions.map(solution => {
        const compositeScore = (
          solution.technicalFit * enhancedWeights.technicalFit +
          solution.budgetAlignment * enhancedWeights.budgetAlignment +
          solution.riskLevel * enhancedWeights.riskLevel +
          solution.strategicImpact * enhancedWeights.strategicImpact +
          solution.vendorStability * enhancedWeights.vendorStability +
          solution.technicalDebt * enhancedWeights.technicalDebt
        );

        return {
          ...solution,
          compositeScore: parseFloat(compositeScore.toFixed(2)),
          confidence: compositeScore >= 4.2 ? 'High' : compositeScore >= 3.8 ? 'Moderate' : 'Low'
        };
      });

      const topSolutions = scoredSolutions
        .filter(s => s.compositeScore >= 3.5)
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 10);

      setMcdaAnalysis({
        solutions: topSolutions,
        portfolioScore: parseFloat((topSolutions.reduce((sum, s) => sum + s.compositeScore, 0) / topSolutions.length).toFixed(2)),
        totalImplementationMonths: Math.max(...topSolutions.map(s => s.implementationMonths)),
        expectedROI: Math.round(topSolutions.reduce((sum, s) => sum + s.estimatedROI, 0) / topSolutions.length),
        riskLevel: assessOverallRisk(topSolutions),
        researchInsights: researchResults,
        technicalDebtAssessment: assessTechnicalDebt(clientData),
        aiImplementationFramework: generateImplementationFramework(researchResults),
        loading: false
      });

    } catch (error) {
      console.error('Advanced MCDA analysis failed:', error);
      setMcdaAnalysis({ 
        error: 'Research analysis failed. Using standard MCDA.',
        loading: false 
      });
      calculateMCDA(); // Fallback to standard analysis
    }
  };

  // Technical Debt Assessment
  const calculateTechnicalDebtScore = (solution, clientData) => {
    let score = 4.0; // Start with neutral score

    // Assess based on current tools and infrastructure
    const hasLegacySystems = clientData.painPoints.some(point => 
      point.toLowerCase().includes('legacy') || 
      point.toLowerCase().includes('outdated') ||
      point.toLowerCase().includes('manual')
    );

    if (hasLegacySystems) {
      score -= 0.5; // Legacy systems increase technical debt risk
    }

    // Team size considerations
    const teamSize = parseInt(clientData.employees) || 5;
    if (teamSize < 10 && solution.category.includes('Enterprise')) {
      score -= 0.3; // Complex solutions may create debt for small teams
    }

    // Integration complexity
    if (solution.name.toLowerCase().includes('integration') || 
        solution.name.toLowerCase().includes('platform')) {
      score += 0.2; // Integration solutions often reduce technical debt
    }

    return Math.max(1.0, Math.min(5.0, score));
  };

  // Extract relevant insights from research
  const extractRelevantInsights = (solution, researchResults) => {
    const relevantInsights = researchResults
      .filter(research => research.analysis.toLowerCase().includes(
        solution.category.toLowerCase().split(' ')[0]
      ))
      .map(research => research.analysis.substring(0, 200) + '...');

    return relevantInsights.length > 0 ? relevantInsights[0] : 
      'No specific research insights found for this solution category.';
  };

  // Assess overall portfolio risk
  const assessOverallRisk = (solutions) => {
    const avgConfidence = solutions.reduce((sum, s) => {
      const confScore = s.confidence === 'High' ? 3 : s.confidence === 'Moderate' ? 2 : 1;
      return sum + confScore;
    }, 0) / solutions.length;

    return avgConfidence >= 2.5 ? 'Low' : avgConfidence >= 2.0 ? 'Moderate' : 'High';
  };

  // Technical debt assessment
  const assessTechnicalDebt = (clientData) => {
    const debtIndicators = [
      { indicator: 'Manual processes', present: clientData.painPoints.some(p => p.toLowerCase().includes('manual')) },
      { indicator: 'Legacy systems', present: clientData.painPoints.some(p => p.toLowerCase().includes('legacy')) },
      { indicator: 'Data silos', present: clientData.painPoints.some(p => p.toLowerCase().includes('silo') || p.toLowerCase().includes('separate')) },
      { indicator: 'Outdated tools', present: clientData.painPoints.some(p => p.toLowerCase().includes('outdated')) }
    ];

    const debtScore = debtIndicators.filter(d => d.present).length;
    
    return {
      score: debtScore,
      level: debtScore >= 3 ? 'High' : debtScore >= 2 ? 'Moderate' : 'Low',
      indicators: debtIndicators.filter(d => d.present).map(d => d.indicator),
      recommendations: generateDebtRecommendations(debtScore)
    };
  };

  // Generate implementation framework
  const generateImplementationFramework = (researchResults) => {
    return {
      phase1: 'Business Problem Definition & Data Assessment (Weeks 1-4)',
      phase2: 'Data Preparation & Exploratory Analysis (Weeks 5-8)', 
      phase3: 'Model Development & Validation (Weeks 9-16)',
      phase4: 'Deployment & Integration (Weeks 17-20)',
      phase5: 'Monitoring & Optimization (Ongoing)',
      keyInsights: researchResults.map(r => r.analysis.split('\n')[0]).slice(0, 3)
    };
  };

  // Debt recommendations
  const generateDebtRecommendations = (debtScore) => {
    const recommendations = {
      0: ['Maintain current systems', 'Focus on incremental improvements'],
      1: ['Address identified inefficiency', 'Plan for gradual modernization'],
      2: ['Prioritize automation initiatives', 'Develop integration strategy'],
      3: ['Immediate technical debt reduction needed', 'Consider phased system replacement'],
      4: ['Critical technical debt situation', 'Comprehensive modernization required']
    };
    
    return recommendations[Math.min(debtScore, 4)];
  };

  // Generate Markdown Report
  const generateMarkdownReport = () => {
    const tierConfig = tierConfigs[selectedTier];
    const solutions = mcdaAnalysis?.solutions || [];
    
    let markdown = `# ${tierConfig.name} - AI Strategy Report

## Client: ${clientData.company || 'Your Organization'}
**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Industry:** ${clientData.industry || 'Not specified'}
**Team Size:** ${clientData.employees || 'Not specified'} employees

---

## Executive Summary

This ${tierConfig.name.toLowerCase()} provides ${clientData.company || 'your organization'} with ${selectedTier === 1 ? 'rapid automation solutions' : selectedTier === 2 ? 'comprehensive automation and AI solutions' : 'advanced AI implementation strategies'} tailored for ${tierConfig.target.toLowerCase()}.

${mcdaAnalysis ? `
### Key Metrics
- **Portfolio Score:** ${mcdaAnalysis.portfolioScore}/5.0
- **Expected ROI:** ${mcdaAnalysis.expectedROI}%
- **Implementation Timeline:** ${mcdaAnalysis.totalImplementationMonths} months
- **Risk Level:** ${mcdaAnalysis.riskLevel}
` : ''}

---

## Pain Points Identified

${clientData.painPoints?.map((point, index) => `${index + 1}. ${point}`).join('\n') || 'No pain points identified yet.'}

---

## Recommended Solutions

`;

    solutions.forEach((solution, index) => {
      markdown += `
### Solution ${index + 1}: ${solution.name}

**Category:** ${solution.category}
**Description:** ${solution.description}

#### Implementation Details
- **Timeline:** ${solution.implementationMonths < 1 ? 
    Math.round(solution.implementationMonths * 4) + ' weeks' : 
    solution.implementationMonths + ' month' + (solution.implementationMonths > 1 ? 's' : '')}
- **Expected ROI:** ${solution.estimatedROI}%
- **Confidence Level:** ${solution.confidence}
- **Composite Score:** ${solution.compositeScore}/5.0

${solution.researchInsights ? `
#### Research Insights
${solution.researchInsights}
` : ''}

---
`;
    });

    if (selectedTier === 3 && mcdaAnalysis?.technicalDebtAssessment) {
      markdown += `
## Technical Debt Assessment

**Overall Level:** ${mcdaAnalysis.technicalDebtAssessment.level}

### Identified Issues
${mcdaAnalysis.technicalDebtAssessment.indicators.map(ind => `- ${ind}`).join('\n')}

### Recommendations
${mcdaAnalysis.technicalDebtAssessment.recommendations.map(rec => `- ${rec}`).join('\n')}

---
`;
    }

    if (selectedTier === 3 && mcdaAnalysis?.aiImplementationFramework) {
      markdown += `
## Implementation Framework

1. **${mcdaAnalysis.aiImplementationFramework.phase1}**
2. **${mcdaAnalysis.aiImplementationFramework.phase2}**
3. **${mcdaAnalysis.aiImplementationFramework.phase3}**
4. **${mcdaAnalysis.aiImplementationFramework.phase4}**
5. **${mcdaAnalysis.aiImplementationFramework.phase5}**

---
`;
    }

    markdown += `
## Next Steps

1. Review and approve recommended solutions
2. Establish project governance structure
3. Begin with Phase 1 quick wins
4. Schedule regular progress reviews
5. Monitor ROI and adjust as needed

---

*This report was generated using advanced AI analysis and industry best practices. For questions or clarifications, please contact your AI strategy consultant.*
`;

    return markdown;
  };

  // Download Markdown Report
  const downloadMarkdownReport = () => {
    if (!clientData.company || !mcdaAnalysis) {
      alert('Please complete client discovery and run analysis before generating report.');
      return;
    }

    const markdown = generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientData.company || 'AI-Strategy-Report'}-${tierConfigs[selectedTier].name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate PDF Report (using APITemplate.io)
  const generatePDFReport = async () => {
    if (!clientData.company || !mcdaAnalysis) {
      alert('Please complete client discovery and run analysis before generating report.');
      return;
    }

    const APITEMPLATE_API_KEY = process.env.REACT_APP_APITEMPLATE_API_KEY;
    const TEMPLATE_ID = process.env.REACT_APP_APITEMPLATE_TEMPLATE_ID;

    if (!APITEMPLATE_API_KEY || !TEMPLATE_ID) {
      // Fallback to markdown download if API keys not configured
      console.warn('APITemplate.io not configured - downloading markdown instead');
      downloadMarkdownReport();
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
      `;
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
      document.body.appendChild(loadingDialog);

      const templateData = {
        company: clientData.company,
        tier: tierConfigs[selectedTier].name,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        body: generateReportContent()
      };

      const response = await fetch('https://api.apitemplate.io/v2/create-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': APITEMPLATE_API_KEY
        },
        body: JSON.stringify({
          template_id: TEMPLATE_ID,
          data: templateData,
          format: 'pdf',
          filename: `${clientData.company || 'AI-Strategy-Report'}-${tierConfigs[selectedTier].name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`,
          settings: {
            page_size: 'A4',
            margin: '0mm',
            print_background: true,
            display_header_footer: false
          }
        })
      });

      document.body.removeChild(loadingDialog);
      document.head.removeChild(style);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.download_url) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.download_url;
        link.download = result.filename || 'AI-Audit-Report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccessNotification('Professional PDF report generated successfully!');
      } else {
        throw new Error('No download URL received');
      }

    } catch (error) {
      console.error('Report generation error:', error);
      // Fallback to markdown
      alert('PDF generation failed. Downloading markdown report instead.');
      downloadMarkdownReport();
    }
  };

  // Generate report content for PDF
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

  // Show success notification
  const showSuccessNotification = (message) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
  };

  // File upload handlers
  const handleFileUpload = (fileType, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleVoiceFileUpload = (fileType, file) => {
    setVoiceFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  // Pain point management
  const addPainPoint = () => {
    const input = document.getElementById('painPointInput');
    if (input && input.value.trim()) {
      setClientData(prev => ({
        ...prev,
        painPoints: [...prev.painPoints, input.value.trim()]
      }));
      input.value = '';
    }
  };

  const removePainPoint = (index) => {
    setClientData(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== index)
    }));
  };

  // Current tool management
  const addCurrentTool = () => {
    const input = document.getElementById('currentToolInput');
    if (input && input.value.trim()) {
      setClientData(prev => ({
        ...prev,
        currentTools: [...prev.currentTools, input.value.trim()]
      }));
      input.value = '';
    }
  };

  const removeCurrentTool = (index) => {
    setClientData(prev => ({
      ...prev,
      currentTools: prev.currentTools.filter((_, i) => i !== index)
    }));
  };

  // Navigation
  const canProceedToNext = () => {
    switch (currentSection) {
      case 'discovery':
        return clientData.company && clientData.industry && clientData.employees && clientData.budget;
      case 'voice':
        return voiceFiles.customerSuccess || voiceFiles.employeeInterview || voiceFiles.workTrackingReporting;
      case 'solutions':
        return true;
      case 'mcda':
        return mcdaAnalysis !== null;
      case 'compliance':
        return true;
      case 'editing':
        return true;
      default:
        return true;
    }
  };

  const nextSection = () => {
    const sections = tierConfigs[selectedTier].sections;
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1 && canProceedToNext()) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  const prevSection = () => {
    const sections = tierConfigs[selectedTier].sections;
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  // Render the UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-8 h-8 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Audit Report Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Selected Tier:</span>
              <span className="font-semibold text-yellow-700">{tierConfigs[selectedTier].name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tier Selection */}
        {currentSection === 'tierSelection' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Service Tier</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(tierConfigs).map(([tier, config]) => (
                <div 
                  key={tier}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedTier === parseInt(tier) 
                      ? 'border-yellow-600 bg-yellow-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTier(parseInt(tier))}
                >
                  <h3 className="font-bold text-xl mb-2">{config.name}</h3>
                  <p className="text-3xl font-bold text-yellow-700 mb-2">{config.price}</p>
                  <p className="text-sm text-gray-600 mb-4">{config.turnaround}</p>
                  <p className="text-sm font-medium mb-3">{config.target}</p>
                  <ul className="space-y-2">
                    {config.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentSection('discovery')}
                className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Start Your Audit
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {currentSection !== 'tierSelection' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {tierConfigs[selectedTier].sections.map((section, index) => {
                const sectionNames = {
                  discovery: 'Discovery',
                  voice: 'Voice of Customer',
                  solutions: 'Solutions',
                  mcda: 'MCDA Analysis',
                  compliance: 'Compliance',
                  editing: 'Edit & Review',
                  report: 'Generate Report'
                };
                
                const sectionIcons = {
                  discovery: <Building2 className="w-4 h-4" />,
                  voice: <FileText className="w-4 h-4" />,
                  solutions: <Lightbulb className="w-4 h-4" />,
                  mcda: <TrendingUp className="w-4 h-4" />,
                  compliance: <Shield className="w-4 h-4" />,
                  editing: <Edit3 className="w-4 h-4" />,
                  report: <Download className="w-4 h-4" />
                };
                
                const isActive = section === currentSection;
                const isCompleted = tierConfigs[selectedTier].sections.indexOf(section) < tierConfigs[selectedTier].sections.indexOf(currentSection);
                
                return (
                  <div key={section} className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        isActive ? 'bg-yellow-600 text-white' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : sectionIcons[section]}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-yellow-700' : 
                      isCompleted ? 'text-green-700' : 
                      'text-gray-500'
                    }`}>
                      {sectionNames[section]}
                    </span>
                    {index < tierConfigs[selectedTier].sections.length - 1 && (
                      <div className={`w-16 h-0.5 ml-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Content */}
        {currentSection === 'discovery' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Client Discovery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={clientData.company}
                  onChange={(e) => setClientData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={clientData.industry}
                  onChange={(e) => setClientData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <select
                  value={clientData.employees}
                  onChange={(e) => setClientData(prev => ({ ...prev, employees: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="1-5">1-5</option>
                  <option value="6-20">6-20</option>
                  <option value="21-50">21-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-200">101-200</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Budget for AI/Automation
                </label>
                <select
                  value={clientData.budget}
                  onChange={(e) => setClientData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="Under $5k">Under $5k</option>
                  <option value="$5k-$15k">$5k-$15k</option>
                  <option value="$15k-$50k">$15k-$50k</option>
                  <option value="$50k-$100k">$50k-$100k</option>
                  <option value="Over $100k">Over $100k</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Pain Points
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  id="painPointInput"
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter a pain point"
                  onKeyPress={(e) => e.key === 'Enter' && addPainPoint()}
                />
                <button
                  onClick={addPainPoint}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {clientData.painPoints.map((point, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{point}</span>
                    <button
                      onClick={() => removePainPoint(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Tools & Systems
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  id="currentToolInput"
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter a tool or system"
                  onKeyPress={(e) => e.key === 'Enter' && addCurrentTool()}
                />
                <button
                  onClick={addCurrentTool}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {clientData.currentTools.map((tool, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{tool}</span>
                    <button
                      onClick={() => removeCurrentTool(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Business Outcomes
              </label>
              <textarea
                value={clientData.desiredOutcomes}
                onChange={(e) => setClientData(prev => ({ ...prev, desiredOutcomes: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows="4"
                placeholder="Describe what success looks like for your organization..."
              />
            </div>
          </div>
        )}

        {currentSection === 'voice' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Voice of Customer</h2>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Customer Success Story</h3>
                <p className="text-sm text-gray-600 mb-4">Upload a document or recording describing a successful customer interaction</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.mp3,.wav,.m4a"
                  onChange={(e) => handleVoiceFileUpload('customerSuccess', e.target.files[0])}
                  className="hidden"
                  id="customerSuccess"
                />
                <label
                  htmlFor="customerSuccess"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </label>
                {voiceFiles.customerSuccess && (
                  <p className="mt-2 text-sm text-green-600">✓ {voiceFiles.customerSuccess.name}</p>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Employee Interview</h3>
                <p className="text-sm text-gray-600 mb-4">Upload a document or recording of employee feedback about processes</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.mp3,.wav,.m4a"
                  onChange={(e) => handleVoiceFileUpload('employeeInterview', e.target.files[0])}
                  className="hidden"
                  id="employeeInterview"
                />
                <label
                  htmlFor="employeeInterview"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </label>
                {voiceFiles.employeeInterview && (
                  <p className="mt-2 text-sm text-green-600">✓ {voiceFiles.employeeInterview.name}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Work Tracking & Reporting Challenges</h3>
                <p className="text-sm text-gray-600 mb-4">Describe how your team currently tracks work and reports on progress</p>
                <textarea
                  value={voiceFiles.workTrackingReporting}
                  onChange={(e) => setVoiceFiles(prev => ({ ...prev, workTrackingReporting: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows="4"
                  placeholder="E.g., We use spreadsheets to track projects but struggle with real-time updates..."
                />
              </div>
            </div>
          </div>
        )}

        {currentSection === 'solutions' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">AI & Automation Solutions</h2>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Based on your tier selection and company profile, we'll analyze the most suitable solutions for your organization.
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={selectedTier === 3 ? calculateAdvancedMCDA : calculateMCDA}
                className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                disabled={mcdaAnalysis?.loading}
              >
                {mcdaAnalysis?.loading ? 'Analyzing...' : 'Run MCDA Analysis'}
              </button>
            </div>
            
            {mcdaAnalysis && !mcdaAnalysis.loading && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Portfolio Score</p>
                    <p className="text-2xl font-bold text-yellow-700">{mcdaAnalysis.portfolioScore}/5.0</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Expected ROI</p>
                    <p className="text-2xl font-bold text-green-600">{mcdaAnalysis.expectedROI}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Implementation Time</p>
                    <p className="text-2xl font-bold text-blue-600">{mcdaAnalysis.totalImplementationMonths}mo</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold text-orange-600">{mcdaAnalysis.riskLevel}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mcdaAnalysis.solutions.map((solution, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{solution.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{solution.category}</p>
                          <p className="text-sm mt-2">{solution.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-2xl font-bold text-yellow-700">{solution.compositeScore}</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Timeline:</span>
                          <span className="ml-2 font-medium">{solution.implementationMonths}mo</span>
                        </div>
                        <div>
                          <span className="text-gray-500">ROI:</span>
                          <span className="ml-2 font-medium text-green-600">{solution.estimatedROI}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Confidence:</span>
                          <span className="ml-2 font-medium">{solution.confidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentSection === 'mcda' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">MCDA Deep Dive</h2>
            {mcdaAnalysis ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Scoring Methodology</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our Multi-Criteria Decision Analysis evaluates each solution across five key dimensions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Technical Fit (30%)</h4>
                      <p className="text-sm text-gray-600">How well the solution aligns with your technical infrastructure</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Budget Alignment (25%)</h4>
                      <p className="text-sm text-gray-600">Cost-effectiveness and budget compatibility</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Risk Level (20%)</h4>
                      <p className="text-sm text-gray-600">Implementation and operational risk assessment</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Strategic Impact (15%)</h4>
                      <p className="text-sm text-gray-600">Long-term business value and competitive advantage</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Vendor Stability (10%)</h4>
                      <p className="text-sm text-gray-600">Reliability and longevity of solution providers</p>
                    </div>
                    {selectedTier === 3 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium">Technical Debt (10%)</h4>
                        <p className="text-sm text-gray-600">Impact on existing technical debt and future flexibility</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTier === 3 && mcdaAnalysis.technicalDebtAssessment && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Technical Debt Assessment</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="font-medium text-yellow-800">
                        Overall Technical Debt Level: {mcdaAnalysis.technicalDebtAssessment.level}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-yellow-700 mb-2">Identified Issues:</p>
                        <ul className="list-disc list-inside text-sm text-yellow-600">
                          {mcdaAnalysis.technicalDebtAssessment.indicators.map((ind, idx) => (
                            <li key={idx}>{ind}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-yellow-700 mb-2">Recommendations:</p>
                        <ul className="list-disc list-inside text-sm text-yellow-600">
                          {mcdaAnalysis.technicalDebtAssessment.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">Please run the MCDA analysis first in the Solutions section.</p>
              </div>
            )}
          </div>
        )}

        {currentSection === 'compliance' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Compliance & Governance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">AI Ethics Framework</h3>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div>
                      <p className="font-medium">Transparency & Explainability</p>
                      <p className="text-sm text-gray-600">Ensure AI decisions can be understood and explained</p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div>
                      <p className="font-medium">Fairness & Non-discrimination</p>
                      <p className="text-sm text-gray-600">Prevent bias in AI systems and ensure equitable outcomes</p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div>
                      <p className="font-medium">Privacy & Data Protection</p>
                      <p className="text-sm text-gray-600">Comply with GDPR, CCPA, and other data regulations</p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <div>
                      <p className="font-medium">Human Oversight</p>
                      <p className="text-sm text-gray-600">Maintain human control over critical AI decisions</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Industry-Specific Regulations</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Based on your industry ({clientData.industry || 'Not specified'}), consider these regulations:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm text-blue-700">
                    <li>GDPR (General Data Protection Regulation)</li>
                    <li>Industry-specific compliance requirements</li>
                    <li>Local data residency laws</li>
                    <li>AI Act compliance (if applicable)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'editing' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Edit & Review</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Review Your Information</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Company Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="ml-2">{clientData.company || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Industry:</span>
                        <span className="ml-2">{clientData.industry || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Employees:</span>
                        <span className="ml-2">{clientData.employees || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <span className="ml-2">{clientData.budget || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Analysis Summary</h4>
                    {mcdaAnalysis ? (
                      <div className="text-sm">
                        <p>Solutions Identified: {mcdaAnalysis.solutions.length}</p>
                        <p>Portfolio Score: {mcdaAnalysis.portfolioScore}/5.0</p>
                        <p>Expected ROI: {mcdaAnalysis.expectedROI}%</p>
                        <p>Risk Level: {mcdaAnalysis.riskLevel}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No analysis completed yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows="4"
                  placeholder="Add any additional notes or special considerations for the report..."
                />
              </div>
            </div>
          </div>
        )}

        {currentSection === 'report' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Generate Report</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your {tierConfigs[selectedTier].name} is Ready!</h3>
                <p className="text-gray-600 mb-6">
                  Generate your comprehensive AI audit report with all findings and recommendations.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                    onClick={() => setReportPreview(!reportPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {reportPreview ? 'Hide Preview' : 'Preview'}
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                    onClick={generatePDFReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    onClick={downloadMarkdownReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Markdown
                  </button>
                </div>
              </div>

              {reportPreview && (
                <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4">Report Preview</h4>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: generateMarkdownReport().replace(/\n/g, '<br>') }} />
                  </div>
                </div>
              )}

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
                    <div className="font-medium">{mcdaAnalysis?.solutions.length || 0}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected ROI:</span>
                    <div className="font-medium">{mcdaAnalysis?.expectedROI || 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentSection !== 'tierSelection' && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevSection}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={tierConfigs[selectedTier].sections.indexOf(currentSection) === 0}
            >
              Previous
            </button>
            <button
              onClick={nextSection}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!canProceedToNext() || tierConfigs[selectedTier].sections.indexOf(currentSection) === tierConfigs[selectedTier].sections.length - 1}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;