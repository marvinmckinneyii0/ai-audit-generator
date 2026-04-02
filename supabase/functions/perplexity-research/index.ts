import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ResearchRequest {
  clientData: {
    company?: string;
    industry: string;
    employees?: string;
    revenue?: string;
    techMaturity?: number;
    painPoints?: string[];
    currentTools?: string[];
  };
  analysisType: 'industry' | 'solutions' | 'compliance' | 'technical';
  specificQuery?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { clientData, analysisType, specificQuery }: ResearchRequest = await req.json();

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

    if (!perplexityApiKey) {
      return new Response(
        JSON.stringify({
          success: true,
          insights: generateMockInsights(clientData, analysisType),
          source: 'mock',
          message: 'Using mock data - Perplexity API key not configured'
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const prompt = buildResearchPrompt(clientData, analysisType, specificQuery);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an AI automation and business process expert. Provide detailed, actionable insights based on current market data and best practices.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json();
      const insights = result.choices[0]?.message?.content || '';

      return new Response(
        JSON.stringify({
          success: true,
          insights: parseInsights(insights, analysisType),
          rawInsights: insights,
          source: 'perplexity',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (apiError) {
      console.error('Perplexity API error:', apiError);

      return new Response(
        JSON.stringify({
          success: true,
          insights: generateMockInsights(clientData, analysisType),
          source: 'mock',
          message: 'Perplexity API unavailable, using fallback data',
          error: apiError.message
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error processing research request:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process research request',
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

function buildResearchPrompt(clientData: any, analysisType: string, specificQuery?: string): string {
  const { industry, employees, painPoints, currentTools } = clientData;

  const baseContext = `Industry: ${industry}
Company Size: ${employees || 'Not specified'}
Pain Points: ${painPoints?.join(', ') || 'Not specified'}
Current Tools: ${currentTools?.join(', ') || 'Not specified'}`;

  const prompts = {
    industry: `${baseContext}

Analyze the ${industry} industry's current AI and automation landscape. Focus on:
1. Top 5 automation opportunities specific to this industry
2. Common workflow bottlenecks and solutions
3. ROI expectations for automation initiatives
4. Industry-specific compliance considerations
5. Technology adoption trends

Provide specific, actionable insights with approximate cost ranges and implementation timelines.`,

    solutions: `${baseContext}
${specificQuery ? `Specific Focus: ${specificQuery}` : ''}

Recommend the top AI and automation solutions for this business. Include:
1. Specific tool names and categories (workflow automation, CRM, AI assistants, etc.)
2. Integration capabilities with existing tools
3. Estimated costs (monthly/annual)
4. Implementation complexity (low/medium/high)
5. Expected ROI and payback period
6. Vendor stability and market position

Focus on practical, proven solutions available in 2024-2026.`,

    compliance: `${baseContext}

Analyze compliance requirements for AI implementation in ${industry}. Cover:
1. Industry-specific regulations (GDPR, HIPAA, AI Act, etc.)
2. Data privacy considerations
3. AI governance requirements
4. Risk mitigation strategies
5. Compliance costs and timelines
6. Recommended compliance frameworks

Provide specific guidance for their jurisdiction and industry.`,

    technical: `${baseContext}
${specificQuery ? `Technical Area: ${specificQuery}` : ''}

Provide technical analysis for AI implementation including:
1. Technical debt assessment for current systems
2. Integration architecture recommendations
3. Data infrastructure requirements
4. Security considerations
5. Scalability planning
6. Team skill requirements and training needs

Focus on practical technical roadmap and resource requirements.`
  };

  return prompts[analysisType as keyof typeof prompts] || prompts.industry;
}

function parseInsights(rawInsights: string, analysisType: string): any {
  const sections = rawInsights.split(/\n\n+/);

  return {
    summary: sections[0] || rawInsights.substring(0, 300),
    details: sections.slice(1).join('\n\n'),
    analysisType,
    keyPoints: extractKeyPoints(rawInsights),
    recommendations: extractRecommendations(rawInsights)
  };
}

function extractKeyPoints(text: string): string[] {
  const points: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.match(/^[\d\-\*•]\s+/) || line.includes(':')) {
      const cleaned = line.replace(/^[\d\-\*•]\s+/, '').trim();
      if (cleaned.length > 20 && cleaned.length < 200) {
        points.push(cleaned);
      }
    }
  }

  return points.slice(0, 10);
}

function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];
  const lines = text.split('\n');

  let inRecommendations = false;
  for (const line of lines) {
    if (line.toLowerCase().includes('recommend')) {
      inRecommendations = true;
    }
    if (inRecommendations && line.match(/^[\d\-\*•]\s+/)) {
      const cleaned = line.replace(/^[\d\-\*•]\s+/, '').trim();
      if (cleaned.length > 20) {
        recommendations.push(cleaned);
      }
    }
  }

  return recommendations.slice(0, 5);
}

function generateMockInsights(clientData: any, analysisType: string): any {
  const mockInsights = {
    industry: {
      summary: `Based on ${clientData.industry} industry analysis, there are significant automation opportunities focusing on workflow optimization, data processing, and customer engagement.`,
      details: `Key automation opportunities include:\n\n1. Workflow Automation: Implement tools like n8n or Make to connect disparate systems and automate repetitive tasks. Expected ROI: 250-400% in first year.\n\n2. Document Processing: AI-powered document extraction and processing can save 10-15 hours per week for knowledge workers.\n\n3. Customer Service Automation: Chatbots and AI assistants can handle 60-70% of routine inquiries, improving response times.\n\n4. Data Analytics: Automated reporting and insights generation can reduce manual analysis time by 70%.\n\n5. Process Optimization: AI-driven process mining can identify inefficiencies and suggest improvements.`,
      keyPoints: [
        'Workflow automation offers 250-400% ROI in first year',
        'Document processing can save 10-15 hours per week',
        'AI chatbots handle 60-70% of routine inquiries',
        'Automated reporting reduces analysis time by 70%',
        'Process mining identifies hidden inefficiencies'
      ],
      recommendations: [
        'Start with no-code automation tools for quick wins',
        'Focus on high-volume, repetitive processes first',
        'Implement gradual rollout with pilot programs',
        'Train staff on new automation tools',
        'Monitor ROI metrics monthly'
      ]
    },
    solutions: {
      summary: `Recommended solutions focus on no-code/low-code platforms with strong integration capabilities and proven ROI.`,
      details: `Top Solutions:\n\n1. n8n (Workflow Automation): Self-hosted, unlimited workflows, $0-$500/month. Perfect for custom automation needs.\n\n2. Make (formerly Integromat): Visual automation builder, $9-$299/month depending on operations. Excellent for complex workflows.\n\n3. Zapier: Easiest to use, $20-$599/month. Best for simple integrations.\n\n4. ChatGPT/Claude API: AI assistance integration, $20-$200/month. Great for content and support automation.\n\n5. Airtable: Database + automation, $20-$50/user/month. Ideal for project management automation.`,
      keyPoints: [
        'n8n offers unlimited self-hosted automation',
        'Make provides powerful visual workflow builder',
        'Zapier has largest app ecosystem (5000+ apps)',
        'AI APIs enable intelligent automation',
        'Airtable combines database and automation'
      ],
      recommendations: [
        'Start with Zapier for quick proof of concept',
        'Migrate to n8n for cost savings at scale',
        'Integrate AI APIs for intelligent processing',
        'Use Airtable for team collaboration automation',
        'Implement gradual tool adoption strategy'
      ]
    },
    compliance: {
      summary: `Compliance focus on data privacy, AI transparency, and industry-specific regulations.`,
      details: `Compliance Requirements:\n\n1. GDPR (EU): Data processing agreements, right to explanation for AI decisions, data minimization.\n\n2. AI Act (EU): Risk-based approach, transparency requirements, human oversight for high-risk AI.\n\n3. US Privacy Laws: CCPA, state-specific regulations, sector-specific rules (HIPAA, GLBA).\n\n4. Data Security: Encryption, access controls, audit logging, incident response.\n\n5. AI Governance: Documentation of AI systems, bias testing, regular audits.`,
      keyPoints: [
        'GDPR requires data processing agreements for all vendors',
        'AI Act mandates transparency for high-risk systems',
        'US compliance varies by state and industry',
        'Data encryption and access controls are mandatory',
        'Regular compliance audits reduce risk'
      ],
      recommendations: [
        'Conduct data protection impact assessment',
        'Implement privacy by design principles',
        'Choose vendors with strong compliance records',
        'Document all AI decision-making processes',
        'Regular compliance training for staff'
      ]
    },
    technical: {
      summary: `Technical implementation requires focus on integration architecture, data security, and scalability.`,
      details: `Technical Considerations:\n\n1. Integration Architecture: API-first approach, event-driven architecture, microservices for scalability.\n\n2. Data Infrastructure: Centralized data warehouse, ETL pipelines, real-time data sync.\n\n3. Security: Zero-trust architecture, API authentication, encryption at rest and in transit.\n\n4. Scalability: Cloud-native design, horizontal scaling, caching strategies.\n\n5. Skills Required: API integration, workflow automation, basic scripting, change management.`,
      keyPoints: [
        'API-first architecture enables flexible integrations',
        'Centralized data warehouse improves analytics',
        'Zero-trust security model reduces breach risk',
        'Cloud-native design enables easy scaling',
        'Staff training crucial for successful adoption'
      ],
      recommendations: [
        'Start with API inventory and documentation',
        'Implement API gateway for centralized control',
        'Use infrastructure-as-code for consistency',
        'Invest in staff training and upskilling',
        'Build internal automation champions program'
      ]
    }
  };

  return mockInsights[analysisType as keyof typeof mockInsights] || mockInsights.industry;
}
