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
    
// Perplexity API Integration for Tier 3 Advanced Research
  const perplexityResearch = async (clientData, analysisType) => {
    const PERPLEXITY_API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY;
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
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
      throw error;
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
      throw new Error('Perplexity API key not configured');
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
      Focus on sustainable, long-term implementation approaches.`,
      
      'compliance-eu': `Research EU compliance requirements for ${clientData.industry} companies implementing AI solutions. Focus on:
      1. GDPR compliance for AI data processing
      2. EU AI Act requirements and risk classifications
      3. Industry-specific regulations (${clientData.industry})
      4. Data governance best practices
      5. Current regulatory developments and enforcement trends
      Provide specific, actionable compliance recommendations.`,
      
      'compliance-us': `Research US compliance requirements for ${clientData.industry} companies implementing AI solutions. Focus on:
      1. Federal and state privacy law compliance
      2. Industry-specific regulations (${clientData.industry === 'healthcare' ? 'HIPAA, FDA' : clientData.industry === 'finance' ? 'SOX, PCI DSS, GLBA' : 'sector-specific rules'})
      3. AI/ML regulatory guidance and best practices
      4. Algorithmic accountability requirements
      5. Emerging state AI legislation
      Provide specific, actionable compliance recommendations.`
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
      throw error;
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
    const allPainPoints = allExtractedData.flatMap(data => data?.painPoints || []);
    
    // Auto-fill stakeholder interview fields (basic mapping)
    const combinedChallenges = allPainPoints.join('; ');
    const extractedTools = allExtractedData.flatMap(data => data?.metrics?.currentTools || []).join(', ');
    
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
    const isCA = clientData.jurisdiction === 'CA';
    const isUK = clientData.jurisdiction === 'UK';
    
    // Determine data types based on industry and inputs
    const dataTypes = [];
    if (clientData.stakeholderInterview.mainSoftwareTools?.toLowerCase().includes('crm') ||
        clientData.stakeholderInterview.processData?.toLowerCase().includes('customer')) {
      dataTypes.push('Customer PII');
    }
    if (clientData.industry === 'healthcare') {
      dataTypes.push('Health Records', 'Biometric Data');
    }
    if (clientData.industry === 'finance') {
      dataTypes.push('Financial Records', 'Transaction Data');
    }
    if (clientData.stakeholderInterview.processData?.toLowerCase().includes('employee') ||
        clientData.stakeholderInterview.teamStructure) {
      dataTypes.push('Employee Data');
    }
    if (clientData.currentTools.some(tool => tool.toLowerCase().includes('analytics'))) {
      dataTypes.push('Behavioral Analytics');
    }
    if (dataTypes.length === 0) {
      dataTypes.push('General Business Data');
    }
    
    // Enhanced compliance scoring based on jurisdiction
    if (isEU) {
      const gdprScore = calculateGDPRScore();
      const aiActScore = calculateAIActScore();
      const industryScore = calculateIndustrySpecificScore();
      const overallRisk = Math.round((100 - gdprScore + 100 - aiActScore + 100 - industryScore) / 3);
      
      setComplianceScores({
        type: 'EU',
        jurisdiction: 'European Union',
        gdprScore,
        aiActScore,
        industryScore,
        overallRisk,
        riskTier: overallRisk < 30 ? 'Low' : overallRisk < 60 ? 'Moderate' : 'High',
        regulations: ['GDPR', 'EU AI Act', ...(clientData.industry === 'healthcare' ? ['EU MDR'] : []),
                      ...(clientData.industry === 'finance' ? ['MiFID II', 'PSD2'] : [])],
        dataTypes,
        complianceGaps: identifyComplianceGaps('EU'),
        recommendations: generateEURecommendations(),
        nextSteps: [
          'Conduct comprehensive GDPR data mapping exercise',
          'Perform AI Act risk classification assessment',
          'Implement privacy-by-design principles',
          'Establish DPO role or equivalent oversight',
          'Create incident response and breach notification procedures'
        ]
      });
    } else if (isUS) {
      const piiScore = calculateUSPrivacyScore();
      const hipaaScore = clientData.industry === 'healthcare' ? calculateHIPAAScore() : 0;
      const industryScore = calculateIndustrySpecificScore();
      const overallRisk = Math.round(
        (100 - piiScore + (hipaaScore > 0 ? 100 - hipaaScore : 0) + 100 - industryScore) / 
        (hipaaScore > 0 ? 3 : 2)
      );
      
      setComplianceScores({
        type: 'US',
        jurisdiction: 'United States',
        piiScore,
        hipaaScore,
        industryScore,
        overallRisk,
        riskTier: overallRisk < 30 ? 'Low' : overallRisk < 60 ? 'Moderate' : 'High',
        regulations: [
          'State Privacy Laws (CCPA/CPRA, etc.)',
          ...(clientData.industry === 'healthcare' ? ['HIPAA', 'FDA Regulations'] : []),
          ...(clientData.industry === 'finance' ? ['SOX', 'GLBA', 'PCI DSS'] : []),
          'FTC Act Section 5'
        ],
        dataTypes,
        complianceGaps: identifyComplianceGaps('US'),
        recommendations: generateUSRecommendations(),
        nextSteps: [
          'Map data flows across state lines',
          'Implement state-specific privacy controls',
          'Establish vendor management program',
          'Create algorithmic impact assessments',
          'Develop consumer rights response procedures'
        ]
      });
    } else if (isCA) {
      const pipedaScore = calculatePIPEDAScore();
      const industryScore = calculateIndustrySpecificScore();
      const overallRisk = Math.round((100 - pipedaScore + 100 - industryScore) / 2);
      
      setComplianceScores({
        type: 'CA',
        jurisdiction: 'Canada',
        pipedaScore,
        industryScore,
        overallRisk,
        riskTier: overallRisk < 30 ? 'Low' : overallRisk < 60 ? 'Moderate' : 'High',
        regulations: [
          'PIPEDA',
          'Provincial Privacy Laws',
          ...(clientData.industry === 'healthcare' ? ['PHIPA'] : []),
          'Bill C-27 (when enacted)'
        ],
        dataTypes,
        complianceGaps: identifyComplianceGaps('CA'),
        recommendations: generateCARecommendations(),
        nextSteps: [
          'Review PIPEDA compliance requirements',
          'Assess provincial law obligations',
          'Implement privacy policy updates',
          'Establish consent management',
          'Prepare for Bill C-27 requirements'
        ]
      });
    } else if (isUK) {
      const ukGdprScore = calculateUKGDPRScore();
      const industryScore = calculateIndustrySpecificScore();
      const overallRisk = Math.round((100 - ukGdprScore + 100 - industryScore) / 2);
      
      setComplianceScores({
        type: 'UK',
        jurisdiction: 'United Kingdom',
        ukGdprScore,
        industryScore,
        overallRisk,
        riskTier: overallRisk < 30 ? 'Low' : overallRisk < 60 ? 'Moderate' : 'High',
        regulations: [
          'UK GDPR',
          'Data Protection Act 2018',
          ...(clientData.industry === 'finance' ? ['FCA Regulations'] : []),
          'AI Regulation (proposed)'
        ],
        dataTypes,
        complianceGaps: identifyComplianceGaps('UK'),
        recommendations: generateUKRecommendations(),
        nextSteps: [
          'Conduct UK GDPR gap analysis',
          'Review ICO guidance on AI',
          'Implement accountability measures',
          'Establish UK representative if needed',
          'Create age-appropriate design considerations'
        ]
      });
    }
  };
  
  // Helper functions for compliance scoring
  const calculateGDPRScore = () => {
    let score = 50; // Base score
    
    if (clientData.stakeholderInterview.dataGovernance?.includes('consent')) score += 10;
    if (clientData.stakeholderInterview.dataGovernance?.includes('retention')) score += 10;
    if (clientData.currentTools.some(tool => tool.toLowerCase().includes('privacy'))) score += 15;
    if (clientData.employees === '1' || clientData.employees === '2-5') score -= 10; // Small teams struggle more
    if (clientData.techMaturity >= 3) score += 10;
    if (clientData.budget === '<$5k' || clientData.budget === '$5k-$25k') score -= 15;
    
    return Math.max(20, Math.min(95, score));
  };
  
  const calculateAIActScore = () => {
    let score = 30; // Base score (AI Act is new)
    
    if (clientData.aiReadiness?.ethicalAI?.includes('fairness')) score += 15;
    if (clientData.aiReadiness?.ethicalAI?.includes('transparency')) score += 15;
    if (clientData.techMaturity >= 4) score += 20;
    if (clientData.industry === 'healthcare' || clientData.industry === 'finance') score -= 10; // High-risk sectors
    
    return Math.max(15, Math.min(85, score));
  };
  
  const calculateUSPrivacyScore = () => {
    let score = 40; // Base score
    
    if (clientData.stakeholderInterview.dataGovernance?.includes('minimization')) score += 10;
    if (clientData.currentTools.some(tool => tool.toLowerCase().includes('security'))) score += 15;
    if (clientData.budget === '>$100k') score += 20;
    if (clientData.techMaturity >= 3) score += 10;
    
    return Math.max(25, Math.min(90, score));
  };
  
  const calculateHIPAAScore = () => {
    let score = 50; // Base score for healthcare
    
    if (clientData.stakeholderInterview.dataGovernance?.includes('encryption')) score += 20;
    if (clientData.stakeholderInterview.dataGovernance?.includes('access control')) score += 15;
    if (clientData.employees === '16-50' || clientData.employees === '50+') score += 10;
    
    return Math.max(30, Math.min(95, score));
  };
  
  const calculatePIPEDAScore = () => {
    let score = 45; // Base score
    
    if (clientData.stakeholderInterview.dataGovernance?.includes('consent')) score += 15;
    if (clientData.techMaturity >= 3) score += 15;
    if (clientData.currentTools.length > 3) score += 10;
    
    return Math.max(30, Math.min(90, score));
  };
  
  const calculateUKGDPRScore = () => {
    let score = 48; // Base score
    
    if (clientData.stakeholderInterview.dataGovernance?.includes('accountability')) score += 12;
    if (clientData.stakeholderInterview.dataGovernance?.includes('privacy by design')) score += 15;
    if (clientData.techMaturity >= 3) score += 10;
    
    return Math.max(25, Math.min(92, score));
  };
  
  const calculateIndustrySpecificScore = () => {
    let score = 60; // Base score
    
    // Industry-specific adjustments
    if (clientData.industry === 'healthcare') {
      if (clientData.stakeholderInterview.processData?.includes('patient')) score -= 15;
      if (clientData.currentTools.some(tool => tool.toLowerCase().includes('ehr'))) score += 10;
    } else if (clientData.industry === 'finance') {
      if (clientData.stakeholderInterview.processData?.includes('transaction')) score -= 10;
      if (clientData.currentTools.some(tool => tool.toLowerCase().includes('kyc'))) score += 15;
    } else if (clientData.industry === 'ecommerce') {
      if (clientData.stakeholderInterview.processData?.includes('payment')) score -= 5;
      if (clientData.currentTools.some(tool => tool.toLowerCase().includes('pci'))) score += 10;
    }
    
    // Maturity and budget factors
    if (clientData.techMaturity >= 4) score += 15;
    if (clientData.budget === '>$100k') score += 10;
    
    return Math.max(20, Math.min(95, score));
  };
  
  const identifyComplianceGaps = (jurisdiction) => {
    const gaps = [];
    
    // Common gaps
    if (!clientData.stakeholderInterview.dataGovernance?.includes('inventory')) {
      gaps.push('No comprehensive data inventory or mapping');
    }
    if (!clientData.stakeholderInterview.dataGovernance?.includes('retention')) {
      gaps.push('Missing data retention and deletion policies');
    }
    
    // Jurisdiction-specific gaps
    if (jurisdiction === 'EU') {
      if (!clientData.stakeholderInterview.dataGovernance?.includes('dpia')) {
        gaps.push('No Data Protection Impact Assessment (DPIA) process');
      }
      if (!clientData.stakeholderInterview.dataGovernance?.includes('privacy by design')) {
        gaps.push('Privacy by design principles not implemented');
      }
      if (clientData.techMaturity < 3) {
        gaps.push('Insufficient technical measures for GDPR compliance');
      }
    } else if (jurisdiction === 'US') {
      if (!clientData.stakeholderInterview.dataGovernance?.includes('breach')) {
        gaps.push('No breach notification procedures');
      }
      if (!clientData.currentTools.some(tool => tool.toLowerCase().includes('consent'))) {
        gaps.push('Inadequate consent management for state laws');
      }
    }
    
    // Industry-specific gaps
    if (clientData.industry === 'healthcare' && !clientData.stakeholderInterview.dataGovernance?.includes('audit')) {
      gaps.push('Missing audit trails for health data access');
    }
    if (clientData.industry === 'finance' && !clientData.currentTools.some(tool => tool.toLowerCase().includes('monitoring'))) {
      gaps.push('Insufficient transaction monitoring capabilities');
    }
    
    return gaps;
  };
  
  const generateEURecommendations = () => {
    const recs = [
      'Implement comprehensive GDPR-compliant consent management system',
      'Establish Data Protection Officer (DPO) role or equivalent oversight',
      'Create detailed Records of Processing Activities (ROPA)',
      'Develop AI transparency documentation for EU AI Act compliance'
    ];
    
    if (clientData.techMaturity < 3) {
      recs.push('Upgrade technical infrastructure to support privacy controls');
    }
    
    if (clientData.industry === 'healthcare') {
      recs.push('Ensure AI systems meet Medical Device Regulation (MDR) requirements');
    }
    
    if (selectedTier === 3) {
      recs.push('Implement automated privacy rights fulfillment system');
      recs.push('Deploy AI explainability tools for algorithmic decisions');
      recs.push('Establish cross-border data transfer mechanisms (SCCs/BCRs)');
    }
    
    return recs;
  };
  
  const generateUSRecommendations = () => {
    const recs = [
      'Create state-by-state privacy compliance matrix',
      'Implement universal opt-out mechanisms for all states',
      'Establish comprehensive vendor assessment program',
      'Develop algorithmic bias testing procedures'
    ];
    
    if (clientData.industry === 'healthcare') {
      recs.push('Ensure HIPAA-compliant AI data processing safeguards');
      recs.push('Implement FDA-compliant validation for AI medical devices');
    }
    
    if (clientData.industry === 'finance') {
      recs.push('Implement SOX-compliant AI model governance');
      recs.push('Ensure PCI DSS compliance for payment AI systems');
    }
    
    if (selectedTier === 3) {
      recs.push('Deploy automated privacy rights management platform');
      recs.push('Implement real-time compliance monitoring dashboard');
      recs.push('Create AI ethics board with external advisors');
    }
    
    return recs;
  };
  
  const generateCARecommendations = () => {
    const recs = [
      'Implement PIPEDA-compliant consent mechanisms',
      'Establish privacy breach notification procedures',
      'Create transparency reports for AI decision-making',
      'Prepare for Bill C-27 AI and data requirements'
    ];
    
    if (clientData.techMaturity < 3) {
      recs.push('Upgrade systems to support meaningful consent');
    }
    
    return recs;
  };
  
  const generateUKRecommendations = () => {
    const recs = [
      'Align with ICO guidance on AI and data protection',
      'Implement UK GDPR accountability measures',
      'Create age-appropriate design for AI systems',
      'Establish transparent AI decision-making processes'
    ];
    
    if (clientData.industry === 'finance') {
      recs.push('Ensure FCA compliance for AI in financial services');
    }
    
    return recs;
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
                        Jurisdiction <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={clientData.jurisdiction}
                        onChange={(e) => setClientData(prev => ({ ...prev, jurisdiction: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="EU">European Union</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Other">Other</option>
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
                    onClick={selectedTier === 3 ? calculateAdvancedMCDA : calculateMCDA}
                    className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {selectedTier === 3 ? 'Run Advanced AI Research' : 'Generate Solutions'}
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

                {/* Advanced Research Display for Tier 3 */}
                {mcdaAnalysis && selectedTier === 3 && mcdaAnalysis.researchInsights && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">AI Implementation Research Framework</h4>
                    
                    {mcdaAnalysis.aiImplementationFramework && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 mb-2">5-Phase Implementation Timeline</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>Phase 1:</strong> {mcdaAnalysis.aiImplementationFramework.phase1}</div>
                          <div><strong>Phase 2:</strong> {mcdaAnalysis.aiImplementationFramework.phase2}</div>
                          <div><strong>Phase 3:</strong> {mcdaAnalysis.aiImplementationFramework.phase3}</div>
                          <div><strong>Phase 4:</strong> {mcdaAnalysis.aiImplementationFramework.phase4}</div>
                          <div><strong>Phase 5:</strong> {mcdaAnalysis.aiImplementationFramework.phase5}</div>
                        </div>
                      </div>
                    )}

                    {mcdaAnalysis.technicalDebtAssessment && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h5 className="font-medium text-orange-900 mb-2">Technical Debt Assessment</h5>
                        <div className="text-sm">
                          <div className="mb-2">
                            <span className="font-medium">Risk Level:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              mcdaAnalysis.technicalDebtAssessment.level === 'High' ? 'bg-red-100 text-red-800' :
                              mcdaAnalysis.technicalDebtAssessment.level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {mcdaAnalysis.technicalDebtAssessment.level}
                            </span>
                          </div>
                          {mcdaAnalysis.technicalDebtAssessment.indicators.length > 0 && (
                            <div className="mb-2">
                              <span className="font-medium">Debt Indicators:</span>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {mcdaAnalysis.technicalDebtAssessment.indicators.map((indicator, i) => (
                                  <li key={i}>{indicator}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Recommendations:</span>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {mcdaAnalysis.technicalDebtAssessment.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
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

            {/* Enhanced Compliance Analysis */}
            {activeTab === 'compliance' && tierConfigs[selectedTier].sections.includes('compliance') && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Comprehensive Compliance Analysis</h3>
                  <button
                    onClick={generateComplianceScores}
                    className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800"
                  >
                    Generate Assessment
                  </button>
                </div>

                {complianceScores && (
                  <div className="space-y-6">
                    {/* Overall Risk Assessment */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className={`w-6 h-6 mr-2 ${
                          complianceScores.riskTier === 'Low' ? 'text-green-500' :
                          complianceScores.riskTier === 'Moderate' ? 'text-yellow-500' :
                          'text-red-500'
                        }`} />
                        <h4 className="font-semibold text-gray-900">
                          {complianceScores.jurisdiction} Compliance Risk: {complianceScores.riskTier}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-2xl font-bold text-gray-900">{complianceScores.overallRisk}%</div>
                          <div className="text-sm text-gray-500">Overall Risk</div>
                        </div>
                        {complianceScores.type === 'EU' && (
                          <>
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="text-2xl font-bold text-blue-600">{complianceScores.gdprScore}</div>
                              <div className="text-sm text-gray-500">GDPR Score</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded">
                              <div className="text-2xl font-bold text-purple-600">{complianceScores.aiActScore}</div>
                              <div className="text-sm text-gray-500">AI Act Score</div>
                            </div>
                          </>
                        )}
                        {complianceScores.type === 'US' && (
                          <>
                            <div className="text-center p-3 bg-blue-50 rounded">
                              <div className="text-2xl font-bold text-blue-600">{complianceScores.piiScore}</div>
                              <div className="text-sm text-gray-500">PII Score</div>
                            </div>
                            {complianceScores.hipaaScore > 0 && (
                              <div className="text-center p-3 bg-green-50 rounded">
                                <div className="text-2xl font-bold text-green-600">{complianceScores.hipaaScore}</div>
                                <div className="text-sm text-gray-500">HIPAA Score</div>
                              </div>
                            )}
                          </>
                        )}
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-2xl font-bold text-orange-600">{complianceScores.industryScore}</div>
                          <div className="text-sm text-gray-500">Industry Score</div>
                        </div>
                      </div>

                      {/* Applicable Regulations */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Applicable Regulations</h5>
                        <div className="flex flex-wrap gap-2">
                          {complianceScores.regulations.map((reg, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {reg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Data Types Processed */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Data Types Processed</h5>
                        <div className="flex flex-wrap gap-2">
                          {complianceScores.dataTypes.map((type, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Compliance Gaps */}
                    {complianceScores.complianceGaps && complianceScores.complianceGaps.length > 0 && (
                      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                        <h4 className="font-medium text-red-900 mb-2">Identified Compliance Gaps</h4>
                        <ul className="space-y-1">
                          {complianceScores.complianceGaps.map((gap, i) => (
                            <li key={i} className="text-sm text-red-700 flex items-center">
                              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Priority Recommendations */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Priority Compliance Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {complianceScores.recommendations.map((rec, i) => (
                          <div key={i} className="bg-gray-50 rounded p-3">
                            <div className="flex items-start">
                              <ChevronRight className="w-4 h-4 text-yellow-700 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{rec}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    {complianceScores.nextSteps && (
                      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h4 className="font-medium text-blue-900 mb-3">Recommended Next Steps</h4>
                        <ol className="space-y-2">
                          {complianceScores.nextSteps.map((step, i) => (
                            <li key={i} className="text-sm text-blue-700 flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Tier 3 Enhanced Insights */}
                    {selectedTier === 3 && complianceScores.recommendations.length > 6 && (
                      <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                        <h4 className="font-medium text-purple-900 mb-2">
                          🔬 Advanced Compliance Research (Tier 3)
                        </h4>
                        <p className="text-sm text-purple-700">
                          Enhanced recommendations based on current regulatory developments and industry best practices.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!complianceScores && (
                  <div className="text-center text-gray-500 py-12">
                    <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Click "Generate Assessment" to analyze compliance requirements for your client</p>
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
