
'use client';

import { useState } from 'react';

export default function AnalysisTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0] || null;
    if (uploaded && uploaded.type !== 'text/csv') {
      setError('Upload error: Please select only CSV file.');
      setFile(null);
      return;
    }
    setError('');
    setFile(uploaded);
    setDownloadUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
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
    } catch (err) {
      setError('Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setError('');
  };

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '2rem',
        flexDirection: 'column',
      }}
    >
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
          }}
        >
          {error}
        </div>
      )}

      {!file && !downloadUrl && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            iloveITF
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Upload your CSV to get the latest paperwork
          </p>
          <label
            htmlFor="csv-upload"
            style={{
              display: 'inline-block',
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Select CSV File or Drag & Drop Here
          </label>
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {file && !downloadUrl && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <p style={{ fontWeight: '500', marginBottom: '1rem' }}>{file.name}</p>
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '0.9rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {loading ? (
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #fff',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite',
                }}
              ></span>
            ) : (
              'Analyze Document'
            )}
          </button>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {downloadUrl && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <a
            href={downloadUrl}
            download="Driver_Paperwork_Summary.xlsx"
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            Download Document
          </a>
          <button
            onClick={reset}
            style={{
              marginLeft: '1rem',
              backgroundColor: '#e5e7eb',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              verticalAlign: 'middle',
            }}
          >
            ←
          </button>
        </div>
      )}
    </main>
  );
}
