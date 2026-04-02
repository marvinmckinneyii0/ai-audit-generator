import React, { useState } from 'react';
import { Upload, Mic, FileText, CircleCheck as CheckCircle, Loader, CircleAlert as AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const VoiceUpload = ({ auditId, onProcessed }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        const fileName = `${auditId}/${Date.now()}_${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('voice-files')
          .getPublicUrl(fileName);

        const { data: dbData, error: dbError } = await supabase
          .from('voice_uploads')
          .insert({
            audit_id: auditId,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type.includes('audio') ? 'audio' : file.type.includes('json') ? 'json' : 'text',
            file_size: file.size
          })
          .select()
          .single();

        if (dbError) throw dbError;

        setUploadedFiles(prev => [...prev, {
          id: dbData.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: urlData.publicUrl
        }]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const processFiles = async () => {
    setProcessing(true);
    setError(null);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      for (const file of uploadedFiles) {
        let requestBody = {
          fileType: file.type.includes('audio') ? 'audio' :
                    file.type.includes('json') ? 'json' : 'text'
        };

        if (file.type.includes('audio')) {
          requestBody.audioUrl = file.url;
        } else if (file.type.includes('json')) {
          const response = await fetch(file.url);
          const jsonData = await response.json();
          requestBody.jsonData = jsonData;
        } else {
          const response = await fetch(file.url);
          const textData = await response.text();
          requestBody.textData = textData;
        }

        const response = await fetch(
          `${supabaseUrl}/functions/v1/process-audio-transcription`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to process file');
        }

        const result = await response.json();

        await supabase
          .from('voice_uploads')
          .update({
            transcript: result.transcript,
            extracted_data: result.extractedData,
            processed_at: new Date().toISOString()
          })
          .eq('audit_id', auditId);

        if (onProcessed) {
          onProcessed(result.extractedData);
        }
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Voice & Document Upload
          </h2>
          <p className="text-slate-600">
            Upload interview recordings, notes, or JSON exports for automated processing
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="audio/*,.json,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploading ? (
                <>
                  <Loader className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-slate-700">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    Click to upload files
                  </p>
                  <p className="text-sm text-slate-500">
                    Audio, JSON, or text files
                  </p>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Uploaded Files ({uploadedFiles.length})
              </h3>

              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.includes('audio') ? (
                        <Mic className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>

              <button
                onClick={processFiles}
                disabled={processing}
                className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing Files...
                  </>
                ) : (
                  <>
                    Process & Extract Data
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceUpload;
