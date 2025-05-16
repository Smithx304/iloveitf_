'use client';

import React, { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'upload' | 'analyze' | 'result'>('upload');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setLoading(true);
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setDownloadUrl(null);
    setStage('analyze');

    // Simulate short loading to preview file
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://iloveitf-backend.onrender.com/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStage('result');
    } catch {
      alert('Failed to process file. Please try again.');
      setStage('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDownloadUrl(null);
    setFileName(null);
    setStage('upload');
  };

  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        maxWidth: '520px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#111827'
        }}>iloveITF</h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Upload your CSV to get the latest paperwork
        </p>

        {stage === 'upload' && (
          <>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{
                fontSize: '1rem',
                padding: '0.75rem',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          </>
        )}

        {stage === 'analyze' && fileName && (
          <>
            {loading && <p style={{ marginTop: '1rem' }}>Loading...</p>}
            {!loading && (
              <>
                <p style={{ marginTop: '1rem', color: '#4b5563' }}>📄 {fileName}</p>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  style={{
                    marginTop: '1.5rem',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    padding: '0.8rem 1.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Processing...' : 'Analyze Document'}
                </button>
              </>
            )}
          </>
        )}

        {stage === 'result' && downloadUrl && (
          <>
            <a
              href={downloadUrl}
              download="Driver_Paperwork_Summary.xlsx"
              style={{
                display: 'block',
                marginTop: '1.5rem',
                backgroundColor: '#3b82f6',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Download Document
            </a>
            <button
              onClick={handleReset}
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              ← Go Back
            </button>
          </>
        )}
      </div>
    </main>
  );
}
