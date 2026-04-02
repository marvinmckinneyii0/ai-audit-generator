import { supabase } from '../lib/supabaseClient';

export const auditService = {
  async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        company_name: clientData.company,
        industry: clientData.industry,
        employee_count: parseInt(clientData.employees) || null,
        revenue_range: clientData.revenue,
        tech_maturity: clientData.techMaturity || 1,
        jurisdiction: clientData.jurisdiction || 'US',
        budget_range: clientData.budget,
        timeline: clientData.timeline,
        pain_points: clientData.painPoints || [],
        current_tools: clientData.currentTools || []
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createAudit(clientId, tier) {
    const turnaroundDays = tier === 1 ? 3 : tier === 2 ? 7 : 14;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + turnaroundDays);

    const { data, error } = await supabase
      .from('audits')
      .insert([{
        client_id: clientId,
        tier: tier,
        status: 'draft',
        turnaround_deadline: deadline.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveStakeholderInterview(auditId, interviewData) {
    const { data, error } = await supabase
      .from('stakeholder_interviews')
      .insert([{
        audit_id: auditId,
        role_team_overview: interviewData.roleTeamOverview || '',
        team_goals_kpis: interviewData.teamGoalsKPIs || '',
        team_structure: interviewData.teamStructure || '',
        critical_processes: interviewData.criticalProcesses || '',
        workflow_bottlenecks: interviewData.workflowBottlenecks || '',
        time_consuming_tasks: interviewData.timeConsumingTasks || '',
        main_software_tools: interviewData.mainSoftwareTools || '',
        technology_frustrations: interviewData.technologyFrustrations || '',
        outside_processes: interviewData.outsideProcesses || '',
        biggest_challenges: interviewData.biggestChallenges || '',
        magic_wand_problem: interviewData.magicWandProblem || '',
        efficiency_blockers: interviewData.efficiencyBlockers || '',
        improvement_opportunities: interviewData.improvementOpportunities || '',
        technology_adoption: interviewData.technologyAdoption || ''
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveEndUserInterview(auditId, interviewData) {
    const { data, error } = await supabase
      .from('end_user_interviews')
      .insert([{
        audit_id: auditId,
        typical_day_week: interviewData.typicalDayWeek || '',
        common_daily_tasks: interviewData.commonDailyTasks || '',
        core_vs_admin_time: interviewData.coreVsAdminTime || '',
        task_steps_walkthrough: interviewData.taskStepsWalkthrough || '',
        most_manual_time_consuming_part: interviewData.mostManualTimeConsumingPart || '',
        information_needed: interviewData.informationNeeded || '',
        primary_daily_software: interviewData.primaryDailySoftware || '',
        tool_frustrations: interviewData.toolFrustrations || '',
        data_double_entry: interviewData.dataDoubleEntry || '',
        boring_repetitive_tasks: interviewData.boringRepetitiveTasks || '',
        assistant_tasks: interviewData.assistantTasks || '',
        work_tracking_reporting: interviewData.workTrackingReporting || ''
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadVoiceFile(auditId, file, fileUrl) {
    const { data, error } = await supabase
      .from('voice_uploads')
      .insert([{
        audit_id: auditId,
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type.includes('audio') ? 'audio' : file.type.includes('json') ? 'json' : 'text',
        file_size: file.size
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveSolutions(auditId, solutions) {
    const solutionsToInsert = solutions.map(solution => ({
      audit_id: auditId,
      name: solution.name,
      category: solution.category,
      description: solution.description,
      technical_fit: solution.technicalFit || 0,
      budget_alignment: solution.budgetAlignment || 0,
      risk_level: solution.riskLevel || 0,
      strategic_impact: solution.strategicImpact || 0,
      vendor_stability: solution.vendorStability || 0,
      implementation_months: solution.implementationMonths || 0,
      estimated_roi: solution.estimatedROI || 0,
      mcda_score: solution.mcdaScore || 0,
      confidence_score: solution.confidenceScore || 0,
      research_insights: solution.researchInsights || {},
      is_recommended: solution.isRecommended || false
    }));

    const { data, error } = await supabase
      .from('solutions')
      .insert(solutionsToInsert)
      .select();

    if (error) throw error;
    return data;
  },

  async saveMCDAAnalysis(auditId, analysisData) {
    const { data, error } = await supabase
      .from('mcda_analysis')
      .insert([{
        audit_id: auditId,
        criteria_weights: analysisData.criteriaWeights || {},
        overall_risk_assessment: analysisData.overallRiskAssessment || '',
        technical_debt_score: analysisData.technicalDebtScore || 0,
        implementation_framework: analysisData.implementationFramework || {},
        recommendations: analysisData.recommendations || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveComplianceAssessment(auditId, complianceData) {
    const { data, error } = await supabase
      .from('compliance_assessments')
      .insert([{
        audit_id: auditId,
        gdpr_score: complianceData.gdprScore || 0,
        ai_act_score: complianceData.aiActScore || 0,
        us_privacy_score: complianceData.usPrivacyScore || 0,
        hipaa_score: complianceData.hipaaScore || 0,
        pipeda_score: complianceData.pipedaScore || 0,
        uk_gdpr_score: complianceData.ukGdprScore || 0,
        industry_specific_score: complianceData.industrySpecificScore || 0,
        compliance_gaps: complianceData.complianceGaps || {},
        recommendations: complianceData.recommendations || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveReport(auditId, reportContent, pdfUrl = null) {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        audit_id: auditId,
        html_content: reportContent,
        pdf_url: pdfUrl,
        version: 1,
        is_final: false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveROICalculations(auditId, solutionId, roiData) {
    const { data, error } = await supabase
      .from('roi_calculations')
      .insert([{
        audit_id: auditId,
        solution_id: solutionId,
        annual_savings: roiData.annualSavings || 0,
        implementation_cost: roiData.implementationCost || 0,
        payback_months: roiData.paybackMonths || 0,
        five_year_value: roiData.fiveYearValue || 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAuditById(auditId) {
    const { data, error } = await supabase
      .from('audits')
      .select(`
        *,
        clients (*),
        stakeholder_interviews (*),
        end_user_interviews (*),
        solutions (*),
        mcda_analysis (*),
        compliance_assessments (*),
        reports (*),
        roi_calculations (*)
      `)
      .eq('id', auditId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateAuditStatus(auditId, status) {
    const updates = {
      status: status
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('audits')
      .update(updates)
      .eq('id', auditId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
