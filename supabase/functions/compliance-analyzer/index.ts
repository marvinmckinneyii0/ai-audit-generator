import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ComplianceRequest {
  clientData: {
    industry: string;
    jurisdiction: string;
    employees?: string;
    dataTypes?: string[];
  };
  solutions: Array<{
    name: string;
    category: string;
    description: string;
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { clientData, solutions }: ComplianceRequest = await req.json();

    const scores = {
      gdprScore: calculateGDPRScore(clientData, solutions),
      aiActScore: calculateAIActScore(clientData, solutions),
      usPrivacyScore: calculateUSPrivacyScore(clientData, solutions),
      hipaaScore: calculateHIPAAScore(clientData, solutions),
      pipedaScore: calculatePIPEDAScore(clientData, solutions),
      ukGdprScore: calculateUKGDPRScore(clientData, solutions),
      industrySpecificScore: calculateIndustrySpecificScore(clientData, solutions)
    };

    const complianceGaps = identifyComplianceGaps(clientData, solutions, scores);
    const recommendations = generateRecommendations(clientData, complianceGaps, scores);

    return new Response(
      JSON.stringify({
        success: true,
        assessment: {
          scores,
          complianceGaps,
          recommendations,
          overallCompliance: calculateOverallCompliance(scores, clientData.jurisdiction),
          priorityActions: generatePriorityActions(complianceGaps),
          estimatedCost: estimateComplianceCost(complianceGaps, clientData)
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error analyzing compliance:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze compliance',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function calculateGDPRScore(clientData: any, solutions: any[]): number {
  let score = 70;

  const highRiskIndustries = ['healthcare', 'finance', 'legal', 'insurance'];
  if (highRiskIndustries.some(ind => clientData.industry.toLowerCase().includes(ind))) {
    score -= 15;
  }

  const aiSolutions = solutions.filter(s =>
    s.category.toLowerCase().includes('ai') ||
    s.description.toLowerCase().includes('artificial intelligence')
  );
  if (aiSolutions.length > 0) {
    score -= aiSolutions.length * 3;
  }

  const dataSolutions = solutions.filter(s =>
    s.description.toLowerCase().includes('data') ||
    s.description.toLowerCase().includes('analytics')
  );
  if (dataSolutions.length > 3) {
    score -= 10;
  }

  return Math.max(45, Math.min(95, score));
}

function calculateAIActScore(clientData: any, solutions: any[]): number {
  let score = 75;

  const aiSolutions = solutions.filter(s =>
    s.category.toLowerCase().includes('ai') ||
    s.description.toLowerCase().includes('artificial intelligence') ||
    s.description.toLowerCase().includes('machine learning')
  );

  if (aiSolutions.length === 0) {
    return 95;
  }

  const highRiskAI = aiSolutions.filter(s =>
    s.description.toLowerCase().includes('decision') ||
    s.description.toLowerCase().includes('automated') ||
    s.description.toLowerCase().includes('hiring') ||
    s.description.toLowerCase().includes('credit')
  );

  if (highRiskAI.length > 0) {
    score -= highRiskAI.length * 8;
  } else {
    score -= aiSolutions.length * 3;
  }

  return Math.max(40, Math.min(95, score));
}

function calculateUSPrivacyScore(clientData: any, solutions: any[]): number {
  let score = 80;

  const regulatedIndustries = ['healthcare', 'finance', 'education', 'government'];
  if (regulatedIndustries.some(ind => clientData.industry.toLowerCase().includes(ind))) {
    score -= 20;
  }

  const dataCollectionSolutions = solutions.filter(s =>
    s.description.toLowerCase().includes('customer') ||
    s.description.toLowerCase().includes('user data') ||
    s.description.toLowerCase().includes('analytics')
  );

  if (dataCollectionSolutions.length > 2) {
    score -= dataCollectionSolutions.length * 4;
  }

  return Math.max(50, Math.min(95, score));
}

function calculateHIPAAScore(clientData: any, solutions: any[]): number {
  if (!clientData.industry.toLowerCase().includes('health')) {
    return 100;
  }

  let score = 60;

  const phiSolutions = solutions.filter(s =>
    s.description.toLowerCase().includes('patient') ||
    s.description.toLowerCase().includes('medical') ||
    s.description.toLowerCase().includes('health')
  );

  if (phiSolutions.length > 0) {
    score -= phiSolutions.length * 5;
  }

  const cloudSolutions = solutions.filter(s =>
    s.description.toLowerCase().includes('cloud') ||
    s.category.toLowerCase().includes('saas')
  );

  if (cloudSolutions.length > 3) {
    score -= 10;
  }

  return Math.max(35, Math.min(85, score));
}

function calculatePIPEDAScore(clientData: any, solutions: any[]): number {
  if (clientData.jurisdiction !== 'CA') {
    return 100;
  }

  let score = 75;

  const commercialActivities = solutions.filter(s =>
    s.description.toLowerCase().includes('customer') ||
    s.description.toLowerCase().includes('commerce') ||
    s.description.toLowerCase().includes('transaction')
  );

  if (commercialActivities.length > 2) {
    score -= commercialActivities.length * 4;
  }

  return Math.max(50, Math.min(95, score));
}

function calculateUKGDPRScore(clientData: any, solutions: any[]): number {
  if (clientData.jurisdiction !== 'UK') {
    return 100;
  }

  let score = calculateGDPRScore(clientData, solutions);
  score -= 5;

  return Math.max(45, Math.min(95, score));
}

function calculateIndustrySpecificScore(clientData: any, solutions: any[]): number {
  let score = 85;

  const industryRegulations: { [key: string]: number } = {
    'finance': -20,
    'healthcare': -25,
    'education': -15,
    'government': -30,
    'legal': -18,
    'insurance': -20
  };

  for (const [industry, penalty] of Object.entries(industryRegulations)) {
    if (clientData.industry.toLowerCase().includes(industry)) {
      score += penalty;
      break;
    }
  }

  return Math.max(40, Math.min(95, score));
}

function identifyComplianceGaps(clientData: any, solutions: any[], scores: any): any {
  const gaps: any = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  if (scores.gdprScore < 60 && (clientData.jurisdiction === 'EU' || clientData.jurisdiction === 'UK')) {
    gaps.critical.push({
      area: 'GDPR Compliance',
      issue: 'Significant GDPR compliance gaps identified',
      impact: 'Fines up to €20M or 4% of annual revenue',
      solutions: ['Conduct DPIA', 'Implement data mapping', 'Review vendor contracts']
    });
  }

  if (scores.aiActScore < 65 && clientData.jurisdiction === 'EU') {
    gaps.high.push({
      area: 'AI Act Compliance',
      issue: 'AI systems may require conformity assessment',
      impact: 'Fines up to €30M or 6% of global turnover',
      solutions: ['AI risk assessment', 'Documentation requirements', 'Human oversight implementation']
    });
  }

  if (scores.hipaaScore < 70 && clientData.industry.toLowerCase().includes('health')) {
    gaps.critical.push({
      area: 'HIPAA Compliance',
      issue: 'Protected Health Information security gaps',
      impact: 'Fines up to $1.5M per violation category',
      solutions: ['BAA agreements', 'Encryption implementation', 'Access controls', 'Audit logging']
    });
  }

  if (scores.usPrivacyScore < 65 && clientData.jurisdiction === 'US') {
    gaps.high.push({
      area: 'US Privacy Laws',
      issue: 'State privacy law compliance required',
      impact: 'State-specific penalties and enforcement actions',
      solutions: ['CCPA/CPRA compliance', 'Privacy policy updates', 'Consumer rights implementation']
    });
  }

  const aiSolutions = solutions.filter(s =>
    s.category.toLowerCase().includes('ai') ||
    s.description.toLowerCase().includes('artificial intelligence')
  );

  if (aiSolutions.length > 0) {
    gaps.medium.push({
      area: 'AI Transparency',
      issue: 'AI decision-making transparency requirements',
      impact: 'Regulatory scrutiny and potential restrictions',
      solutions: ['Explainable AI implementation', 'Decision audit trails', 'User notification systems']
    });
  }

  const dataSolutions = solutions.filter(s =>
    s.description.toLowerCase().includes('analytics') ||
    s.description.toLowerCase().includes('data processing')
  );

  if (dataSolutions.length > 3) {
    gaps.medium.push({
      area: 'Data Governance',
      issue: 'Multiple data processing systems require governance',
      impact: 'Data quality and compliance risks',
      solutions: ['Data governance framework', 'Data lineage tracking', 'Quality controls']
    });
  }

  gaps.low.push({
    area: 'Documentation',
    issue: 'Comprehensive documentation needed for all AI/automation systems',
    impact: 'Audit preparation and regulatory inquiries',
    solutions: ['System documentation', 'Process documentation', 'Training materials']
  });

  return gaps;
}

function generateRecommendations(clientData: any, gaps: any, scores: any): any {
  const recommendations: any = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    byJurisdiction: {}
  };

  if (gaps.critical.length > 0) {
    recommendations.immediate.push(
      'Address all critical compliance gaps before system deployment',
      'Engage legal counsel for compliance review',
      'Halt high-risk implementations until gaps resolved'
    );
  }

  recommendations.immediate.push(
    'Conduct comprehensive data inventory and mapping',
    'Review and update privacy policies',
    'Implement basic security controls (encryption, access management)'
  );

  recommendations.shortTerm.push(
    'Establish data governance framework',
    'Conduct vendor security assessments',
    'Implement privacy by design principles',
    'Set up compliance monitoring and reporting',
    'Train staff on compliance requirements'
  );

  recommendations.longTerm.push(
    'Build privacy and security into organizational culture',
    'Establish continuous compliance monitoring program',
    'Regular third-party compliance audits',
    'Stay current with evolving regulations',
    'Build internal compliance expertise'
  );

  if (clientData.jurisdiction === 'EU' || clientData.jurisdiction === 'UK') {
    recommendations.byJurisdiction.EU = [
      'Appoint Data Protection Officer if required',
      'Implement GDPR Article 30 records of processing',
      'Establish lawful basis for all processing activities',
      'Implement data subject rights procedures',
      'Prepare for AI Act requirements (2024-2026)'
    ];
  }

  if (clientData.jurisdiction === 'US') {
    recommendations.byJurisdiction.US = [
      'Assess CCPA/CPRA applicability',
      'Implement state-specific privacy requirements',
      'Review sector-specific regulations (HIPAA, GLBA, FERPA)',
      'Establish consumer rights request procedures',
      'Monitor emerging state privacy laws'
    ];
  }

  if (clientData.jurisdiction === 'CA') {
    recommendations.byJurisdiction.Canada = [
      'Ensure PIPEDA compliance for commercial activities',
      'Provincial privacy law compliance (PIPA)',
      'Consent management implementation',
      'Cross-border data transfer assessments',
      'Prepare for Bill C-27 changes'
    ];
  }

  return recommendations;
}

function calculateOverallCompliance(scores: any, jurisdiction: string): any {
  let relevantScores: number[] = [];

  if (jurisdiction === 'EU') {
    relevantScores = [scores.gdprScore, scores.aiActScore, scores.industrySpecificScore];
  } else if (jurisdiction === 'UK') {
    relevantScores = [scores.ukGdprScore, scores.aiActScore, scores.industrySpecificScore];
  } else if (jurisdiction === 'US') {
    relevantScores = [scores.usPrivacyScore, scores.hipaaScore, scores.industrySpecificScore];
  } else if (jurisdiction === 'CA') {
    relevantScores = [scores.pipedaScore, scores.industrySpecificScore];
  } else {
    relevantScores = Object.values(scores).filter(s => typeof s === 'number');
  }

  const avgScore = relevantScores.reduce((sum, s) => sum + s, 0) / relevantScores.length;

  let status = '';
  let riskLevel = '';

  if (avgScore >= 85) {
    status = 'Strong Compliance';
    riskLevel = 'Low';
  } else if (avgScore >= 70) {
    status = 'Moderate Compliance';
    riskLevel = 'Medium';
  } else if (avgScore >= 55) {
    status = 'Compliance Gaps Identified';
    riskLevel = 'High';
  } else {
    status = 'Critical Compliance Issues';
    riskLevel = 'Critical';
  }

  return {
    score: Math.round(avgScore),
    status,
    riskLevel
  };
}

function generatePriorityActions(gaps: any): string[] {
  const actions: string[] = [];

  if (gaps.critical.length > 0) {
    gaps.critical.forEach((gap: any) => {
      actions.push(`CRITICAL: ${gap.area} - ${gap.solutions[0]}`);
    });
  }

  if (gaps.high.length > 0) {
    gaps.high.forEach((gap: any) => {
      actions.push(`HIGH: ${gap.area} - ${gap.solutions[0]}`);
    });
  }

  if (actions.length === 0) {
    actions.push('Maintain current compliance standards');
    actions.push('Continue monitoring regulatory changes');
  }

  return actions.slice(0, 5);
}

function estimateComplianceCost(gaps: any, clientData: any): any {
  let minCost = 5000;
  let maxCost = 15000;

  minCost += gaps.critical.length * 10000;
  maxCost += gaps.critical.length * 25000;

  minCost += gaps.high.length * 5000;
  maxCost += gaps.high.length * 15000;

  minCost += gaps.medium.length * 2000;
  maxCost += gaps.medium.length * 8000;

  const employeeCount = parseInt(clientData.employees) || 10;
  if (employeeCount > 100) {
    minCost *= 1.5;
    maxCost *= 2;
  } else if (employeeCount > 25) {
    minCost *= 1.2;
    maxCost *= 1.5;
  }

  return {
    estimatedRange: `$${minCost.toLocaleString()} - $${maxCost.toLocaleString()}`,
    breakdown: {
      legalReview: `$${Math.round(minCost * 0.3).toLocaleString()} - $${Math.round(maxCost * 0.3).toLocaleString()}`,
      implementation: `$${Math.round(minCost * 0.5).toLocaleString()} - $${Math.round(maxCost * 0.5).toLocaleString()}`,
      training: `$${Math.round(minCost * 0.1).toLocaleString()} - $${Math.round(maxCost * 0.1).toLocaleString()}`,
      ongoing: `$${Math.round(minCost * 0.1).toLocaleString()} - $${Math.round(maxCost * 0.1).toLocaleString()} annually`
    },
    timeline: gaps.critical.length > 0 ? '3-6 months' : '2-4 months'
  };
}
