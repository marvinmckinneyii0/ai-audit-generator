import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PDFRequest {
  auditId: string;
  htmlContent: string;
  reportName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { auditId, htmlContent, reportName }: PDFRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const styledHtml = wrapHTMLWithStyles(htmlContent);

    const pdfApiKey = Deno.env.get('PDF_API_KEY');

    if (!pdfApiKey) {
      const fileName = `reports/${auditId}/${reportName}_${Date.now()}.html`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audit-reports')
        .upload(fileName, styledHtml, {
          contentType: 'text/html',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Failed to upload HTML: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('audit-reports')
        .getPublicUrl(fileName);

      return new Response(
        JSON.stringify({
          success: true,
          htmlUrl: urlData.publicUrl,
          pdfUrl: null,
          message: 'PDF generation not configured - HTML report saved',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    try {
      const pdfResponse = await fetch('https://api.html2pdf.app/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pdfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: styledHtml,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
          }
        })
      });

      if (!pdfResponse.ok) {
        throw new Error(`PDF API error: ${pdfResponse.statusText}`);
      }

      const pdfBlob = await pdfResponse.arrayBuffer();

      const pdfFileName = `reports/${auditId}/${reportName}_${Date.now()}.pdf`;
      const { data: pdfUploadData, error: pdfUploadError } = await supabase.storage
        .from('audit-reports')
        .upload(pdfFileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (pdfUploadError) {
        throw new Error(`Failed to upload PDF: ${pdfUploadError.message}`);
      }

      const { data: pdfUrlData } = supabase.storage
        .from('audit-reports')
        .getPublicUrl(pdfFileName);

      const htmlFileName = `reports/${auditId}/${reportName}_${Date.now()}.html`;
      await supabase.storage
        .from('audit-reports')
        .upload(htmlFileName, styledHtml, {
          contentType: 'text/html',
          upsert: true
        });

      const { data: htmlUrlData } = supabase.storage
        .from('audit-reports')
        .getPublicUrl(htmlFileName);

      return new Response(
        JSON.stringify({
          success: true,
          pdfUrl: pdfUrlData.publicUrl,
          htmlUrl: htmlUrlData.publicUrl,
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);

      const htmlFileName = `reports/${auditId}/${reportName}_${Date.now()}.html`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audit-reports')
        .upload(htmlFileName, styledHtml, {
          contentType: 'text/html',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Failed to upload HTML fallback: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('audit-reports')
        .getPublicUrl(htmlFileName);

      return new Response(
        JSON.stringify({
          success: true,
          htmlUrl: urlData.publicUrl,
          pdfUrl: null,
          message: 'PDF generation failed - HTML report saved',
          error: pdfError.message,
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate report',
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

function wrapHTMLWithStyles(htmlContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Audit Report - Savvy Analytics</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: white;
      padding: 40px;
    }

    .report-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 40px;
      border-radius: 8px;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 16px;
      opacity: 0.95;
    }

    .section {
      margin-bottom: 40px;
      background: #f8fafc;
      padding: 30px;
      border-radius: 8px;
      border-left: 4px solid #fbbf24;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }

    .subsection {
      margin-bottom: 25px;
    }

    .subsection-title {
      font-size: 18px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
    }

    .content {
      font-size: 14px;
      line-height: 1.8;
      color: #475569;
    }

    .solution-card {
      background: white;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 15px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .solution-title {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .solution-description {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 12px;
    }

    .metrics {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .metric {
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
    }

    .metric-label {
      font-weight: 600;
      color: #475569;
    }

    .metric-value {
      color: #0f172a;
      margin-left: 6px;
    }

    .recommendation-list {
      list-style: none;
      padding-left: 0;
    }

    .recommendation-list li {
      padding: 12px 16px;
      margin-bottom: 10px;
      background: white;
      border-left: 3px solid #fbbf24;
      border-radius: 4px;
      font-size: 14px;
      color: #475569;
    }

    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 13px;
    }

    .footer strong {
      color: #0f172a;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      border-radius: 6px;
      overflow: hidden;
    }

    th {
      background: #f8fafc;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      font-size: 13px;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #475569;
      font-size: 13px;
    }

    .score-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .score-high {
      background: #dcfce7;
      color: #166534;
    }

    .score-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .score-low {
      background: #fee2e2;
      color: #991b1b;
    }

    @media print {
      body {
        padding: 20px;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    ${htmlContent}
    <div class="footer">
      <p><strong>Savvy Analytics</strong> | AI Audit & Automation Consulting</p>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
  `;
}
