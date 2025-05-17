'use client';

import React, { useState, useCallback } from 'react';
import { FiDownload, FiArrowLeft, FiUploadCloud } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export default function Home() {
  type Stage = 'upload' | 'preview' | 'processing' | 'done';
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Handle both drag/drop and file selection
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      setStage('preview');
    }
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setFile(f);
      setStage('preview');
    }
  };

  const analyze = async () => {
    if (!file) return;
    setStage('processing');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://iloveitf-backend.onrender.com/api/process', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStage('done');
    } catch {
      alert('Processing failed. Try again.');
      setStage('preview');
    }
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setStage('upload');
  };

  return (
    <main style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#f3f4f6', padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: 600, textAlign: 'center',
        background: '#fff', padding: '2rem', borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>iloveITF</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Upload your CSV to get the latest paperwork
        </p>

        {stage === 'upload' && (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            style={{
              border: '2px dashed #3b82f6',
              borderRadius: 8,
              padding: '3rem 1rem',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <FiUploadCloud size={48} color="#3b82f6" />
            <p style={{ margin: '1rem 0', color: '#3b82f6', fontWeight: 600 }}>
              Select CSV File or Drag & Drop Here
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={onSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {stage === 'preview' && file && (
          <>
            <p style={{ marginBottom: '1rem', color: '#374151' }}>
              📄 {file.name}
            </p>
            <button
              onClick={analyze}
              style={{
                background: '#3b82f6', color: '#fff',
                padding: '0.75rem 1.5rem', border: 'none',
                borderRadius: 6, fontSize: '1rem', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Analyze Document
            </button>
            <button
              onClick={reset}
              style={{
                marginLeft: 12, background: 'none', border: 'none',
                color: '#6b7280', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              ← Change File
            </button>
          </>
        )}

        {stage === 'processing' && (
          <div style={{ margin: '2rem 0' }}>
            <ImSpinner2 className="spin" size={32} color="#3b82f6" />
            <p style={{ marginTop: 8, color: '#374151' }}>Processing…</p>
          </div>
        )}

        {stage === 'done' && downloadUrl && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={reset}
              style={{
                background: '#3b82f6', color: '#fff',
                width: 40, height: 40, borderRadius: '50%',
                border: 'none', cursor: 'pointer'
              }}
            >
              <FiArrowLeft size={20} />
            </button>
            <a
              href={downloadUrl}
              download="Driver_Paperwork_Summary.xlsx"
              style={{
                background: '#3b82f6', color: '#fff',
                padding: '0.75rem 1.5rem', borderRadius: 6,
                fontSize: '1rem', fontWeight: 600, textDecoration: 'none'
              }}
            >
              <FiDownload style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Download Document
            </a>
          </div>
        )}
      </div>

      {/* Simple CSS spinner */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
    </main>
  );
}
