import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecommendationRequest {
  clientData: {
    industry: string;
    employees?: string;
    techMaturity: number;
    budget?: string;
    painPoints?: string[];
    currentTools?: string[];
  };
  tier: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { clientData, tier }: RecommendationRequest = await req.json();

    const solutionsDatabase = getSolutionsDatabase();

    let filteredSolutions = solutionsDatabase.filter(solution => {
      if (tier === 1) {
        return solution.category === 'No-Code Automation' ||
               solution.category === 'Workflow Automation' ||
               solution.implementationMonths <= 2;
      }
      return true;
    });

    const scoredSolutions = filteredSolutions.map(solution => {
      const relevanceScore = calculateRelevanceScore(solution, clientData);
      const budgetScore = calculateBudgetScore(solution, clientData.budget);
      const maturityScore = calculateMaturityScore(solution, clientData.techMaturity);
      const industryScore = calculateIndustryScore(solution, clientData.industry);
      const painPointScore = calculatePainPointScore(solution, clientData.painPoints);

      const overallScore = (
        relevanceScore * 0.25 +
        budgetScore * 0.20 +
        maturityScore * 0.20 +
        industryScore * 0.20 +
        painPointScore * 0.15
      );

      return {
        ...solution,
        relevanceScore: overallScore,
        technicalFit: maturityScore,
        budgetAlignment: budgetScore,
        strategicImpact: industryScore,
        riskLevel: calculateRiskLevel(solution, clientData.techMaturity),
        vendorStability: solution.vendorStability || 4.0
      };
    });

    scoredSolutions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const topCount = tier === 1 ? 5 : tier === 2 ? 12 : 15;
    const recommendations = scoredSolutions.slice(0, topCount);

    const roiCalculations = recommendations.map(solution => ({
      solutionName: solution.name,
      annualSavings: calculateAnnualSavings(solution, clientData),
      implementationCost: calculateImplementationCost(solution, clientData),
      paybackMonths: calculatePaybackMonths(solution, clientData),
      fiveYearValue: calculateFiveYearValue(solution, clientData)
    }));

    return new Response(
      JSON.stringify({
        success: true,
        recommendations,
        roiCalculations,
        summary: {
          totalSolutions: recommendations.length,
          averageROI: Math.round(
            recommendations.reduce((sum, s) => sum + s.estimatedROI, 0) / recommendations.length
          ),
          averageImplementationTime: Math.round(
            recommendations.reduce((sum, s) => sum + s.implementationMonths, 0) / recommendations.length
          ),
          recommendedStartWith: recommendations.slice(0, 3).map(s => s.name)
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
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate recommendations',
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

function calculateRelevanceScore(solution: any, clientData: any): number {
  let score = 3.5;

  if (solution.description.toLowerCase().includes(clientData.industry.toLowerCase())) {
    score += 1.0;
  }

  if (clientData.painPoints) {
    const painPointMatches = clientData.painPoints.filter((pain: string) =>
      solution.description.toLowerCase().includes(pain.toLowerCase()) ||
      solution.category.toLowerCase().includes(pain.toLowerCase())
    ).length;
    score += painPointMatches * 0.3;
  }

  return Math.min(5, score);
}

function calculateBudgetScore(solution: any, budget?: string): number {
  if (!budget) return 3.5;

  const monthlyCost = solution.monthlyCost || solution.implementationMonths * 500;

  const budgetRanges: { [key: string]: number } = {
    'under $5k': 5000,
    '$5k-$15k': 15000,
    '$15k-$50k': 50000,
    'over $50k': 100000
  };

  const maxBudget = budgetRanges[budget.toLowerCase()] || 50000;
  const totalFirstYearCost = monthlyCost * 12 + (solution.implementationMonths * 2000);

  if (totalFirstYearCost <= maxBudget * 0.3) return 5.0;
  if (totalFirstYearCost <= maxBudget * 0.5) return 4.5;
  if (totalFirstYearCost <= maxBudget * 0.7) return 4.0;
  if (totalFirstYearCost <= maxBudget) return 3.5;
  if (totalFirstYearCost <= maxBudget * 1.2) return 3.0;

  return 2.5;
}

function calculateMaturityScore(solution: any, techMaturity: number): number {
  const complexity = solution.implementationMonths;

  if (techMaturity <= 2) {
    if (complexity <= 2) return 5.0;
    if (complexity <= 4) return 3.5;
    return 2.5;
  } else if (techMaturity === 3) {
    if (complexity <= 3) return 5.0;
    if (complexity <= 6) return 4.0;
    return 3.5;
  } else {
    if (complexity <= 6) return 5.0;
    if (complexity <= 12) return 4.5;
    return 4.0;
  }
}

function calculateIndustryScore(solution: any, industry: string): number {
  const industrySpecific = solution.industries || [];

  if (industrySpecific.includes(industry)) {
    return 5.0;
  }

  if (solution.category.includes('General') || solution.smbSuitable) {
    return 4.0;
  }

  return 3.5;
}

function calculatePainPointScore(solution: any, painPoints?: string[]): number {
  if (!painPoints || painPoints.length === 0) return 3.5;

  let matchCount = 0;
  const solutionText = `${solution.name} ${solution.category} ${solution.description}`.toLowerCase();

  for (const pain of painPoints) {
    if (solutionText.includes(pain.toLowerCase())) {
      matchCount++;
    }
  }

  return Math.min(5, 3.5 + (matchCount * 0.5));
}

function calculateRiskLevel(solution: any, techMaturity: number): number {
  let risk = 4.0;

  if (solution.implementationMonths > 6) {
    risk -= 0.5;
  }

  if (techMaturity <= 2 && solution.implementationMonths > 3) {
    risk -= 0.5;
  }

  if (solution.category.includes('AI') || solution.category.includes('Advanced')) {
    risk -= 0.3;
  }

  return Math.max(2.5, Math.min(5, risk));
}

function calculateAnnualSavings(solution: any, clientData: any): number {
  const employeeCount = parseInt(clientData.employees) || 10;
  const baseHourlySavings = solution.estimatedROI / 100 * 20;
  const weeksPerYear = 48;

  const annualSavings = baseHourlySavings * weeksPerYear * Math.min(employeeCount * 0.3, 10) * 50;

  return Math.round(annualSavings);
}

function calculateImplementationCost(solution: any, clientData: any): number {
  const baseCost = solution.implementationMonths * 3000;
  const employeeCount = parseInt(clientData.employees) || 10;

  const trainingCost = employeeCount * 200;
  const licensingCost = (solution.monthlyCost || 500) * 12;

  return Math.round(baseCost + trainingCost + licensingCost);
}

function calculatePaybackMonths(solution: any, clientData: any): number {
  const annualSavings = calculateAnnualSavings(solution, clientData);
  const implementationCost = calculateImplementationCost(solution, clientData);

  if (annualSavings === 0) return 24;

  const paybackMonths = (implementationCost / (annualSavings / 12));

  return Math.round(Math.min(paybackMonths, 36));
}

function calculateFiveYearValue(solution: any, clientData: any): number {
  const annualSavings = calculateAnnualSavings(solution, clientData);
  const implementationCost = calculateImplementationCost(solution, clientData);
  const annualCost = (solution.monthlyCost || 500) * 12;

  const fiveYearSavings = annualSavings * 5;
  const fiveYearCosts = implementationCost + (annualCost * 5);

  return Math.round(fiveYearSavings - fiveYearCosts);
}

function getSolutionsDatabase(): any[] {
  return [
    {
      name: "n8n Workflow Automation",
      category: "No-Code Automation",
      description: "Self-hosted workflow automation that connects apps and automates repetitive tasks",
      implementationMonths: 1,
      estimatedROI: 320,
      vendorStability: 4.0,
      monthlyCost: 0,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Make (Integromat)",
      category: "Workflow Automation",
      description: "Visual workflow automation platform with 1500+ app integrations",
      implementationMonths: 1,
      estimatedROI: 280,
      vendorStability: 4.5,
      monthlyCost: 99,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Zapier Business",
      category: "No-Code Automation",
      description: "Industry-leading automation platform with 5000+ app connections",
      implementationMonths: 1,
      estimatedROI: 250,
      vendorStability: 5.0,
      monthlyCost: 299,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Airtable Enterprise",
      category: "Database Automation",
      description: "Collaborative database with built-in automation and workflow management",
      implementationMonths: 2,
      estimatedROI: 220,
      vendorStability: 4.5,
      monthlyCost: 45,
      smbSuitable: true,
      industries: []
    },
    {
      name: "HubSpot Marketing Automation",
      category: "Marketing Automation",
      description: "Comprehensive marketing automation with CRM integration",
      implementationMonths: 3,
      estimatedROI: 380,
      vendorStability: 5.0,
      monthlyCost: 800,
      smbSuitable: true,
      industries: ['marketing', 'sales', 'ecommerce']
    },
    {
      name: "ChatGPT API Integration",
      category: "AI Assistant",
      description: "Custom AI assistant for customer support, content creation, and analysis",
      implementationMonths: 2,
      estimatedROI: 340,
      vendorStability: 5.0,
      monthlyCost: 200,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Salesforce Einstein AI",
      category: "CRM AI",
      description: "AI-powered CRM insights and automation for sales teams",
      implementationMonths: 4,
      estimatedROI: 420,
      vendorStability: 5.0,
      monthlyCost: 1500,
      smbSuitable: false,
      industries: ['sales', 'enterprise']
    },
    {
      name: "UiPath Process Automation",
      category: "RPA",
      description: "Enterprise robotic process automation for complex workflows",
      implementationMonths: 6,
      estimatedROI: 450,
      vendorStability: 4.5,
      monthlyCost: 2000,
      smbSuitable: false,
      industries: ['finance', 'healthcare', 'manufacturing']
    },
    {
      name: "Notion AI Workspace",
      category: "Knowledge Management",
      description: "AI-enhanced workspace for documentation and project management",
      implementationMonths: 1,
      estimatedROI: 180,
      vendorStability: 4.5,
      monthlyCost: 15,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Intercom AI Chatbot",
      category: "Customer Support",
      description: "AI-powered customer support automation with live chat",
      implementationMonths: 2,
      estimatedROI: 360,
      vendorStability: 4.5,
      monthlyCost: 499,
      smbSuitable: true,
      industries: ['saas', 'ecommerce', 'services']
    },
    {
      name: "DocuSign Automation",
      category: "Document Management",
      description: "Electronic signature and document workflow automation",
      implementationMonths: 1,
      estimatedROI: 290,
      vendorStability: 5.0,
      monthlyCost: 40,
      smbSuitable: true,
      industries: ['legal', 'real estate', 'finance']
    },
    {
      name: "QuickBooks Online + Auto-entry",
      category: "Financial Automation",
      description: "Automated bookkeeping and expense management",
      implementationMonths: 2,
      estimatedROI: 310,
      vendorStability: 5.0,
      monthlyCost: 125,
      smbSuitable: true,
      industries: ['finance', 'accounting']
    },
    {
      name: "Asana Workflow Automation",
      category: "Project Management",
      description: "Project management with built-in workflow automation",
      implementationMonths: 2,
      estimatedROI: 200,
      vendorStability: 4.5,
      monthlyCost: 24,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Calendly Scheduling Automation",
      category: "Scheduling",
      description: "Automated meeting scheduling and calendar management",
      implementationMonths: 1,
      estimatedROI: 150,
      vendorStability: 4.5,
      monthlyCost: 12,
      smbSuitable: true,
      industries: ['sales', 'consulting', 'services']
    },
    {
      name: "Loom + AI Summary",
      category: "Video Communication",
      description: "Async video messaging with AI-generated summaries",
      implementationMonths: 1,
      estimatedROI: 170,
      vendorStability: 4.0,
      monthlyCost: 12,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Power BI with AI Insights",
      category: "Business Intelligence",
      description: "Advanced data analytics and automated reporting",
      implementationMonths: 4,
      estimatedROI: 380,
      vendorStability: 5.0,
      monthlyCost: 20,
      smbSuitable: true,
      industries: ['enterprise', 'data-driven']
    },
    {
      name: "Stripe Revenue Recognition",
      category: "Payment Automation",
      description: "Automated payment processing and revenue tracking",
      implementationMonths: 2,
      estimatedROI: 340,
      vendorStability: 5.0,
      monthlyCost: 0,
      smbSuitable: true,
      industries: ['ecommerce', 'saas', 'subscription']
    },
    {
      name: "Grammarly Business",
      category: "Writing Assistance",
      description: "AI-powered writing assistant for team communication",
      implementationMonths: 1,
      estimatedROI: 140,
      vendorStability: 4.5,
      monthlyCost: 15,
      smbSuitable: true,
      industries: []
    },
    {
      name: "Typeform + Logic Jumps",
      category: "Form Automation",
      description: "Smart forms with conditional logic and automation",
      implementationMonths: 1,
      estimatedROI: 160,
      vendorStability: 4.0,
      monthlyCost: 35,
      smbSuitable: true,
      industries: ['marketing', 'hr', 'research']
    },
    {
      name: "Monday.com Work OS",
      category: "Work Management",
      description: "Customizable work management with automation recipes",
      implementationMonths: 2,
      estimatedROI: 240,
      vendorStability: 4.5,
      monthlyCost: 39,
      smbSuitable: true,
      industries: []
    }
  ];
}
