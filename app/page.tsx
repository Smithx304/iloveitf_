'use client';

import React, { useState, useCallback } from 'react';
import { FiDownload, FiArrowLeft, FiUploadCloud } from 'react-icons/fi';
import styles from './page.module.css'; // we’ll add CSS next

export default function Home() {
  type Stage = 'upload' | 'preview' | 'processing' | 'done';
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Handles both click/select and drop
  const handleFiles = (f: File) => {
    if (f.type !== 'text/csv') {
      setError('Upload error: Please select only CSV file.');
      return;
    }
    setError('');
    setFile(f);
    setStage('preview');
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files[0]);
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFiles(f);
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
      setDownloadUrl(window.URL.createObjectURL(blob));
      setStage('done');
    } catch {
      setError('Processing failed. Try again.');
      setStage('preview');
    }
  };

  const reset = () => {
    setError('');
    setFile(null);
    setDownloadUrl(null);
    setStage('upload');
  };

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.card}>
        <h1 className={styles.title}>iloveITF</h1>
        {stage === 'upload' && (
          <p className={styles.subtitle}>Upload your CSV to get the latest paperwork</p>
        )}

        {stage === 'upload' && (
          <div
            className={styles.uploadBtn}
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <FiUploadCloud size={32} />
            <span className={styles.uploadText}>Select CSV File or Drag & Drop</span>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={onSelect}
              className={styles.fileInput}
            />
          </div>
        )}

        {stage === 'preview' && file && (
          <>
            <p className={styles.fileName}>📄 {file.name}</p>
            <button className={styles.primaryBtn} onClick={analyze}>Analyze Document</button>
            <button className={styles.linkBtn} onClick={reset}>← Change File</button>
          </>
        )}

        {stage === 'processing' && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner} />
            <p className={styles.processingText}>Processing…</p>
          </div>
        )}

        {stage === 'done' && downloadUrl && (
          <div className={styles.resultBtns}>
            <button className={styles.circleBtn} onClick={reset}>
              <FiArrowLeft size={20} />
            </button>
            <a
              href={downloadUrl}
              download="Driver_Paperwork_Summary.xlsx"
              className={styles.primaryBtn}
            >
              <FiDownload size={20} style={{ marginRight: 6 }} />
              Download Document
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
