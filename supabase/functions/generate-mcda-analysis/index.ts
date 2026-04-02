import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MCDARequest {
  solutions: Array<{
    name: string;
    category: string;
    technicalFit: number;
    budgetAlignment: number;
    riskLevel: number;
    strategicImpact: number;
    vendorStability: number;
    implementationMonths: number;
    estimatedROI: number;
  }>;
  clientData: {
    industry: string;
    techMaturity: number;
    budget?: string;
    timeline?: string;
  };
  tier: number;
}

interface CriteriaWeights {
  technicalFit: number;
  budgetAlignment: number;
  riskLevel: number;
  strategicImpact: number;
  vendorStability: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { solutions, clientData, tier }: MCDARequest = await req.json();

    const criteriaWeights = determineCriteriaWeights(clientData, tier);

    const scoredSolutions = solutions.map(solution => ({
      ...solution,
      mcdaScore: calculateMCDAScore(solution, criteriaWeights),
      confidenceScore: calculateConfidenceScore(solution),
      normalizedScores: {
        technicalFit: normalize(solution.technicalFit),
        budgetAlignment: normalize(solution.budgetAlignment),
        riskLevel: normalize(solution.riskLevel),
        strategicImpact: normalize(solution.strategicImpact),
        vendorStability: normalize(solution.vendorStability)
      }
    }));

    scoredSolutions.sort((a, b) => b.mcdaScore - a.mcdaScore);

    const technicalDebtScore = calculateTechnicalDebtScore(clientData);
    const overallRiskAssessment = assessOverallRisk(scoredSolutions);
    const implementationFramework = generateImplementationFramework(scoredSolutions, clientData, tier);
    const recommendations = generateRecommendations(scoredSolutions, technicalDebtScore, tier);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          criteriaWeights,
          scoredSolutions,
          technicalDebtScore,
          overallRiskAssessment,
          implementationFramework,
          recommendations,
          topSolutions: scoredSolutions.slice(0, tier === 1 ? 5 : tier === 2 ? 12 : 15)
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
    console.error('Error generating MCDA analysis:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate MCDA analysis',
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

function determineCriteriaWeights(clientData: any, tier: number): CriteriaWeights {
  const techMaturity = clientData.techMaturity || 1;

  let weights: CriteriaWeights;

  if (tier === 1) {
    weights = {
      technicalFit: 0.15,
      budgetAlignment: 0.35,
      riskLevel: 0.25,
      strategicImpact: 0.15,
      vendorStability: 0.10
    };
  } else if (tier === 2) {
    weights = {
      technicalFit: 0.25,
      budgetAlignment: 0.25,
      riskLevel: 0.20,
      strategicImpact: 0.20,
      vendorStability: 0.10
    };
  } else {
    weights = {
      technicalFit: 0.30,
      budgetAlignment: 0.15,
      riskLevel: 0.15,
      strategicImpact: 0.30,
      vendorStability: 0.10
    };
  }

  if (techMaturity <= 2) {
    weights.riskLevel += 0.10;
    weights.technicalFit -= 0.05;
    weights.strategicImpact -= 0.05;
  } else if (techMaturity >= 4) {
    weights.technicalFit += 0.10;
    weights.strategicImpact += 0.05;
    weights.riskLevel -= 0.10;
    weights.budgetAlignment -= 0.05;
  }

  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  Object.keys(weights).forEach(key => {
    weights[key as keyof CriteriaWeights] = weights[key as keyof CriteriaWeights] / total;
  });

  return weights;
}

function normalize(value: number, min: number = 0, max: number = 5): number {
  return (value - min) / (max - min);
}

function calculateMCDAScore(solution: any, weights: CriteriaWeights): number {
  const normalizedScores = {
    technicalFit: normalize(solution.technicalFit),
    budgetAlignment: normalize(solution.budgetAlignment),
    riskLevel: normalize(solution.riskLevel),
    strategicImpact: normalize(solution.strategicImpact),
    vendorStability: normalize(solution.vendorStability)
  };

  const weightedScore =
    normalizedScores.technicalFit * weights.technicalFit +
    normalizedScores.budgetAlignment * weights.budgetAlignment +
    normalizedScores.riskLevel * weights.riskLevel +
    normalizedScores.strategicImpact * weights.strategicImpact +
    normalizedScores.vendorStability * weights.vendorStability;

  return Math.round(weightedScore * 100 * 100) / 100;
}

function calculateConfidenceScore(solution: any): number {
  const criteriaCount = 5;
  const scoreVariance = calculateVariance([
    solution.technicalFit,
    solution.budgetAlignment,
    solution.riskLevel,
    solution.strategicImpact,
    solution.vendorStability
  ]);

  const avgScore = (
    solution.technicalFit +
    solution.budgetAlignment +
    solution.riskLevel +
    solution.strategicImpact +
    solution.vendorStability
  ) / criteriaCount;

  const confidenceBase = avgScore / 5;
  const variancePenalty = Math.min(scoreVariance / 2, 0.3);

  const confidence = Math.max(0, Math.min(1, confidenceBase - variancePenalty));

  return Math.round(confidence * 100);
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateTechnicalDebtScore(clientData: any): number {
  const techMaturity = clientData.techMaturity || 1;
  const legacySystemIndicators = [
    clientData.currentTools?.includes('Excel'),
    clientData.currentTools?.includes('Manual'),
    clientData.painPoints?.includes('integration'),
    clientData.painPoints?.includes('legacy')
  ].filter(Boolean).length;

  const baseScore = (5 - techMaturity) * 20;
  const legacyPenalty = legacySystemIndicators * 10;

  return Math.min(100, baseScore + legacyPenalty);
}

function assessOverallRisk(solutions: any[]): string {
  const avgConfidence = solutions.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / solutions.length;
  const avgRisk = solutions.reduce((sum, s) => sum + s.riskLevel, 0) / solutions.length;

  if (avgConfidence >= 80 && avgRisk >= 4) {
    return 'Low Risk - High confidence in recommended solutions with strong risk mitigation';
  } else if (avgConfidence >= 60 && avgRisk >= 3.5) {
    return 'Moderate Risk - Good confidence with standard risk management required';
  } else if (avgConfidence >= 40) {
    return 'Elevated Risk - Additional validation recommended before implementation';
  } else {
    return 'High Risk - Detailed risk assessment and pilot programs strongly recommended';
  }
}

function generateImplementationFramework(solutions: any[], clientData: any, tier: number): any {
  const phases = [];
  const sortedSolutions = [...solutions].sort((a, b) => a.implementationMonths - b.implementationMonths);

  if (tier === 1) {
    phases.push({
      name: 'Quick Wins (Weeks 1-4)',
      solutions: sortedSolutions.slice(0, 3).map(s => s.name),
      focus: 'Immediate value with minimal technical complexity',
      expectedOutcome: 'Initial ROI and team buy-in'
    });

    phases.push({
      name: 'Scale & Optimize (Weeks 5-12)',
      solutions: sortedSolutions.slice(3, 5).map(s => s.name),
      focus: 'Expand successful implementations',
      expectedOutcome: 'Full automation coverage of identified processes'
    });
  } else if (tier === 2) {
    phases.push({
      name: 'Foundation (Months 1-2)',
      solutions: sortedSolutions.slice(0, 4).map(s => s.name),
      focus: 'Core infrastructure and quick wins',
      expectedOutcome: 'Foundational automation framework established'
    });

    phases.push({
      name: 'Expansion (Months 3-4)',
      solutions: sortedSolutions.slice(4, 8).map(s => s.name),
      focus: 'Broader process coverage and integration',
      expectedOutcome: 'Cross-functional automation implementation'
    });

    phases.push({
      name: 'Optimization (Months 5-6)',
      solutions: sortedSolutions.slice(8, 12).map(s => s.name),
      focus: 'Advanced features and continuous improvement',
      expectedOutcome: 'Mature automation ecosystem'
    });
  } else {
    phases.push({
      name: 'Strategic Foundation (Months 1-3)',
      solutions: sortedSolutions.slice(0, 5).map(s => s.name),
      focus: 'Enterprise architecture and governance',
      expectedOutcome: 'Scalable automation platform'
    });

    phases.push({
      name: 'Enterprise Integration (Months 4-8)',
      solutions: sortedSolutions.slice(5, 10).map(s => s.name),
      focus: 'Department-wide rollout and integration',
      expectedOutcome: 'Organization-wide automation coverage'
    });

    phases.push({
      name: 'Transformation & Innovation (Months 9-14)',
      solutions: sortedSolutions.slice(10, 15).map(s => s.name),
      focus: 'Advanced AI and continuous innovation',
      expectedOutcome: 'AI-driven business transformation'
    });
  }

  return {
    phases,
    totalDuration: tier === 1 ? '3 months' : tier === 2 ? '6 months' : '14 months',
    criticalSuccessFactors: [
      'Executive sponsorship and budget allocation',
      'Change management and user training',
      'Regular progress monitoring and adjustment',
      'Clear KPIs and success metrics',
      'Technical support and resources'
    ]
  };
}

function generateRecommendations(solutions: any[], technicalDebtScore: number, tier: number): any {
  const topSolutions = solutions.slice(0, tier === 1 ? 5 : tier === 2 ? 8 : 10);

  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[],
    riskMitigation: [] as string[]
  };

  recommendations.immediate.push(
    `Prioritize ${topSolutions[0].name} for immediate implementation due to high MCDA score`,
    `Conduct team training on ${topSolutions.slice(0, 3).map(s => s.name).join(', ')}`,
    'Establish success metrics and baseline measurements'
  );

  recommendations.shortTerm.push(
    `Implement ${topSolutions.slice(1, 4).map(s => s.name).join(', ')} in parallel`,
    'Set up integration framework for seamless tool connectivity',
    'Monitor ROI metrics weekly during first 3 months'
  );

  recommendations.longTerm.push(
    'Build internal automation champions program',
    'Develop continuous improvement process for automation',
    'Plan for advanced AI capabilities integration'
  );

  if (technicalDebtScore > 60) {
    recommendations.riskMitigation.push(
      'Address technical debt before major implementations',
      'Invest in system modernization alongside automation',
      'Consider phased approach to minimize disruption'
    );
  }

  const avgRisk = topSolutions.reduce((sum, s) => sum + s.riskLevel, 0) / topSolutions.length;
  if (avgRisk < 3.5) {
    recommendations.riskMitigation.push(
      'Conduct pilot programs before full rollout',
      'Implement robust testing and validation procedures',
      'Establish rollback procedures for failed implementations'
    );
  }

  return recommendations;
}
