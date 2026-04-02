/*
  # AI Audit Generator Database Schema

  ## Overview
  Complete database schema for the AI Audit Generator application supporting three service tiers:
  - Tier 1: Solopreneur Automation Sprint ($150)
  - Tier 2: Small Business Growth Pack ($375)
  - Tier 3: SMB Transformation Suite ($750)

  ## New Tables

  ### 1. clients
  Stores client business information and basic profile
  - `id` (uuid, primary key)
  - `company_name` (text)
  - `industry` (text)
  - `employee_count` (integer)
  - `revenue_range` (text)
  - `tech_maturity` (integer, 1-5 scale)
  - `jurisdiction` (text) - US, EU, UK, CA
  - `budget_range` (text)
  - `timeline` (text)
  - `pain_points` (text[])
  - `current_tools` (text[])
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. audits
  Main audit records tracking the audit lifecycle
  - `id` (uuid, primary key)
  - `client_id` (uuid, foreign key)
  - `tier` (integer) - 1, 2, or 3
  - `status` (text) - draft, in_progress, completed, delivered
  - `assigned_analyst` (uuid) - future auth integration
  - `turnaround_deadline` (timestamptz)
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 3. stakeholder_interviews
  Interview data collected from stakeholders (Tiers 1-3)
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - All interview question fields (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. end_user_interviews
  Detailed end-user interview data (Tier 3 only)
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - All end-user question fields (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. voice_uploads
  Audio files and transcription data
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `file_name` (text)
  - `file_url` (text)
  - `file_type` (text) - audio, json, text
  - `file_size` (integer)
  - `transcript` (text)
  - `extracted_data` (jsonb)
  - `processed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. solutions
  AI-recommended automation solutions
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `name` (text)
  - `category` (text)
  - `description` (text)
  - `technical_fit` (numeric)
  - `budget_alignment` (numeric)
  - `risk_level` (numeric)
  - `strategic_impact` (numeric)
  - `vendor_stability` (numeric)
  - `implementation_months` (integer)
  - `estimated_roi` (numeric)
  - `mcda_score` (numeric)
  - `confidence_score` (numeric)
  - `research_insights` (jsonb)
  - `is_recommended` (boolean)
  - `created_at` (timestamptz)

  ### 7. mcda_analysis
  Multi-criteria decision analysis results
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `criteria_weights` (jsonb)
  - `overall_risk_assessment` (text)
  - `technical_debt_score` (numeric)
  - `implementation_framework` (jsonb)
  - `recommendations` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. compliance_assessments
  Regulatory compliance analysis
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `gdpr_score` (numeric)
  - `ai_act_score` (numeric)
  - `us_privacy_score` (numeric)
  - `hipaa_score` (numeric)
  - `pipeda_score` (numeric)
  - `uk_gdpr_score` (numeric)
  - `industry_specific_score` (numeric)
  - `compliance_gaps` (jsonb)
  - `recommendations` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. reports
  Generated audit reports
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `html_content` (text)
  - `pdf_url` (text)
  - `version` (integer)
  - `is_final` (boolean)
  - `live_edit_sessions` (jsonb)
  - `generated_at` (timestamptz)
  - `edited_by` (uuid)

  ### 10. roi_calculations
  ROI tracking for each solution
  - `id` (uuid, primary key)
  - `audit_id` (uuid, foreign key)
  - `solution_id` (uuid, foreign key)
  - `annual_savings` (numeric)
  - `implementation_cost` (numeric)
  - `payback_months` (numeric)
  - `five_year_value` (numeric)
  - `calculated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies restrict access to authenticated analysts
  - Future: Client portal access to their own data

  ## Notes
  - All monetary values stored as numeric for precision
  - JSONB fields for flexible nested data
  - Timestamps for audit trails
  - Indexes on foreign keys and frequently queried fields
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  industry text NOT NULL,
  employee_count integer,
  revenue_range text,
  tech_maturity integer DEFAULT 1 CHECK (tech_maturity BETWEEN 1 AND 5),
  jurisdiction text DEFAULT 'US',
  budget_range text,
  timeline text,
  pain_points text[] DEFAULT '{}',
  current_tools text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tier integer NOT NULL CHECK (tier IN (1, 2, 3)),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'delivered')),
  assigned_analyst uuid,
  turnaround_deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create stakeholder_interviews table
CREATE TABLE IF NOT EXISTS stakeholder_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  role_team_overview text DEFAULT '',
  team_goals_kpis text DEFAULT '',
  team_structure text DEFAULT '',
  critical_processes text DEFAULT '',
  workflow_bottlenecks text DEFAULT '',
  time_consuming_tasks text DEFAULT '',
  main_software_tools text DEFAULT '',
  technology_frustrations text DEFAULT '',
  outside_processes text DEFAULT '',
  biggest_challenges text DEFAULT '',
  magic_wand_problem text DEFAULT '',
  efficiency_blockers text DEFAULT '',
  improvement_opportunities text DEFAULT '',
  technology_adoption text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create end_user_interviews table (Tier 3 only)
CREATE TABLE IF NOT EXISTS end_user_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  typical_day_week text DEFAULT '',
  common_daily_tasks text DEFAULT '',
  core_vs_admin_time text DEFAULT '',
  task_steps_walkthrough text DEFAULT '',
  most_manual_time_consuming_part text DEFAULT '',
  information_needed text DEFAULT '',
  primary_daily_software text DEFAULT '',
  tool_frustrations text DEFAULT '',
  data_double_entry text DEFAULT '',
  boring_repetitive_tasks text DEFAULT '',
  assistant_tasks text DEFAULT '',
  work_tracking_reporting text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create voice_uploads table
CREATE TABLE IF NOT EXISTS voice_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('audio', 'json', 'text')),
  file_size integer,
  transcript text,
  extracted_data jsonb DEFAULT '{}',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  technical_fit numeric(3,2) DEFAULT 0,
  budget_alignment numeric(3,2) DEFAULT 0,
  risk_level numeric(3,2) DEFAULT 0,
  strategic_impact numeric(3,2) DEFAULT 0,
  vendor_stability numeric(3,2) DEFAULT 0,
  implementation_months integer DEFAULT 0,
  estimated_roi numeric(10,2) DEFAULT 0,
  mcda_score numeric(5,2) DEFAULT 0,
  confidence_score numeric(3,2) DEFAULT 0,
  research_insights jsonb DEFAULT '{}',
  is_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create mcda_analysis table
CREATE TABLE IF NOT EXISTS mcda_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  criteria_weights jsonb DEFAULT '{}',
  overall_risk_assessment text DEFAULT '',
  technical_debt_score numeric(5,2) DEFAULT 0,
  implementation_framework jsonb DEFAULT '{}',
  recommendations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create compliance_assessments table
CREATE TABLE IF NOT EXISTS compliance_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  gdpr_score numeric(3,2) DEFAULT 0,
  ai_act_score numeric(3,2) DEFAULT 0,
  us_privacy_score numeric(3,2) DEFAULT 0,
  hipaa_score numeric(3,2) DEFAULT 0,
  pipeda_score numeric(3,2) DEFAULT 0,
  uk_gdpr_score numeric(3,2) DEFAULT 0,
  industry_specific_score numeric(3,2) DEFAULT 0,
  compliance_gaps jsonb DEFAULT '{}',
  recommendations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  html_content text DEFAULT '',
  pdf_url text,
  version integer DEFAULT 1,
  is_final boolean DEFAULT false,
  live_edit_sessions jsonb DEFAULT '{}',
  generated_at timestamptz DEFAULT now(),
  edited_by uuid
);

-- Create roi_calculations table
CREATE TABLE IF NOT EXISTS roi_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  solution_id uuid NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  annual_savings numeric(12,2) DEFAULT 0,
  implementation_cost numeric(12,2) DEFAULT 0,
  payback_months numeric(5,2) DEFAULT 0,
  five_year_value numeric(12,2) DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audits_client_id ON audits(client_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_stakeholder_interviews_audit_id ON stakeholder_interviews(audit_id);
CREATE INDEX IF NOT EXISTS idx_end_user_interviews_audit_id ON end_user_interviews(audit_id);
CREATE INDEX IF NOT EXISTS idx_voice_uploads_audit_id ON voice_uploads(audit_id);
CREATE INDEX IF NOT EXISTS idx_solutions_audit_id ON solutions(audit_id);
CREATE INDEX IF NOT EXISTS idx_mcda_analysis_audit_id ON mcda_analysis(audit_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_audit_id ON compliance_assessments(audit_id);
CREATE INDEX IF NOT EXISTS idx_reports_audit_id ON reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_roi_calculations_audit_id ON roi_calculations(audit_id);
CREATE INDEX IF NOT EXISTS idx_roi_calculations_solution_id ON roi_calculations(solution_id);

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE end_user_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcda_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Authenticated users can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for audits table
CREATE POLICY "Authenticated users can view all audits"
  ON audits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audits"
  ON audits FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update audits"
  ON audits FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for stakeholder_interviews table
CREATE POLICY "Authenticated users can view stakeholder interviews"
  ON stakeholder_interviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stakeholder interviews"
  ON stakeholder_interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stakeholder interviews"
  ON stakeholder_interviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for end_user_interviews table
CREATE POLICY "Authenticated users can view end user interviews"
  ON end_user_interviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert end user interviews"
  ON end_user_interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update end user interviews"
  ON end_user_interviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for voice_uploads table
CREATE POLICY "Authenticated users can view voice uploads"
  ON voice_uploads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert voice uploads"
  ON voice_uploads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update voice uploads"
  ON voice_uploads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for solutions table
CREATE POLICY "Authenticated users can view solutions"
  ON solutions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert solutions"
  ON solutions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update solutions"
  ON solutions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete solutions"
  ON solutions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for mcda_analysis table
CREATE POLICY "Authenticated users can view mcda analysis"
  ON mcda_analysis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert mcda analysis"
  ON mcda_analysis FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update mcda analysis"
  ON mcda_analysis FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for compliance_assessments table
CREATE POLICY "Authenticated users can view compliance assessments"
  ON compliance_assessments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert compliance assessments"
  ON compliance_assessments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update compliance assessments"
  ON compliance_assessments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for reports table
CREATE POLICY "Authenticated users can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for roi_calculations table
CREATE POLICY "Authenticated users can view roi calculations"
  ON roi_calculations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert roi calculations"
  ON roi_calculations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update roi calculations"
  ON roi_calculations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholder_interviews_updated_at BEFORE UPDATE ON stakeholder_interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_end_user_interviews_updated_at BEFORE UPDATE ON end_user_interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcda_analysis_updated_at BEFORE UPDATE ON mcda_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_assessments_updated_at BEFORE UPDATE ON compliance_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
