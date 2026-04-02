import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TranscriptionRequest {
  audioUrl?: string;
  audioBase64?: string;
  jsonData?: any;
  textData?: string;
  fileType: 'audio' | 'json' | 'text';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: TranscriptionRequest = await req.json();
    const { audioUrl, audioBase64, jsonData, textData, fileType } = requestData;

    let transcript = '';
    let extractedData: any = {};

    if (fileType === 'json') {
      extractedData = jsonData || {};
      transcript = JSON.stringify(jsonData, null, 2);
    } else if (fileType === 'text') {
      transcript = textData || '';
      extractedData = parseTextData(transcript);
    } else if (fileType === 'audio') {
      const apiKey = Deno.env.get('OPENAI_API_KEY');

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: 'OpenAI API key not configured',
            transcript: '[Audio transcription unavailable - API key not set]',
            extractedData: {}
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

      try {
        let audioData: ArrayBuffer;

        if (audioBase64) {
          const binaryString = atob(audioBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          audioData = bytes.buffer;
        } else if (audioUrl) {
          const audioResponse = await fetch(audioUrl);
          audioData = await audioResponse.arrayBuffer();
        } else {
          throw new Error('No audio data provided');
        }

        const formData = new FormData();
        formData.append('file', new Blob([audioData], { type: 'audio/mpeg' }), 'audio.mp3');
        formData.append('model', 'whisper-1');

        const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          body: formData,
        });

        if (!transcriptionResponse.ok) {
          throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);
        }

        const transcriptionResult = await transcriptionResponse.json();
        transcript = transcriptionResult.text || '';
        extractedData = parseTextData(transcript);
      } catch (error) {
        console.error('Audio transcription error:', error);
        return new Response(
          JSON.stringify({
            error: 'Audio transcription failed',
            transcript: '[Audio transcription failed]',
            extractedData: {},
            details: error.message
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
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcript,
        extractedData,
        processedAt: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process file',
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

function parseTextData(text: string): any {
  const extractedData: any = {};

  const patterns = {
    company: /company[:\s]+([^\n]+)/i,
    industry: /industry[:\s]+([^\n]+)/i,
    employees: /employees?[:\s]+(\d+)/i,
    revenue: /revenue[:\s]+([^\n]+)/i,
    challenges: /challenge[s]?[:\s]+([^\n]+)/i,
    processes: /process[es]*[:\s]+([^\n]+)/i,
    tools: /tools?[:\s]+([^\n]+)/i,
    goals: /goals?[:\s]+([^\n]+)/i,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData[key] = match[1].trim();
    }
  }

  return extractedData;
}
