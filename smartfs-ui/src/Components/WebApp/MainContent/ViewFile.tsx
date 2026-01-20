import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - CRITICAL for PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function TextViewer({ fileUrl }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      setLoading(true);
      setError(null);
      fetch(fileUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to load file: ${res.status} ${res.statusText}`);
          }
          return res.text();
        })
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading text file:', err);
          setError(err.message || 'Failed to load file');
          setLoading(false);
        });
    }, [fileUrl]);
    
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading text file...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#dc2626',
          backgroundColor: '#fee2e2',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <p><strong>Error loading file:</strong></p>
          <p>{error}</p>
        </div>
      );
    }
    
    return (
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        overflow: 'auto',
        maxHeight: '600px'
      }}>
        {content}
      </pre>
    );
}

function FileViewer({ fileUrl, fileType, fileName }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError(error.message || 'Failed to load PDF');
    setPdfLoading(false);
  };
  
  const renderByType = () => {
    // PDF
    if (fileType === 'application/pdf' || fileName?.endsWith('.pdf')) {
      return (
        <div style={{ width: '100%' }}>
          {pdfLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading PDF...</p>
            </div>
          )}
          
          {pdfError && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#dc2626',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              margin: '20px'
            }}>
              <p><strong>Error loading PDF:</strong></p>
              <p>{pdfError}</p>
              <a 
                href={fileUrl} 
                download={fileName}
                style={{ 
                  display: 'inline-block',
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                Download PDF Instead
              </a>
            </div>
          )}
          
          {!pdfError && (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading PDF...</p>
                </div>
              }
            >
              {numPages && Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} style={{ marginBottom: '20px' }}>
                  <Page 
                    pageNumber={index + 1}
                    width={Math.min(window.innerWidth * 0.8, 800)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    marginTop: '8px'
                  }}>
                    Page {index + 1} of {numPages}
                  </p>
                </div>
              ))}
            </Document>
          )}
        </div>
      );
    }
    
    // Images
    if (fileType?.startsWith('image/')) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <img 
            src={fileUrl} 
            alt={fileName}
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.innerHTML = '<p style="color: #dc2626;">Failed to load image</p>';
              e.currentTarget.parentElement?.appendChild(errorDiv);
            }}
          />
        </div>
      );
    }
    
    // Videos
    if (fileType?.startsWith('video/')) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <video 
            controls 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '8px'
            }}
          >
            <source src={fileUrl} type={fileType} />
            Your browser doesn't support video playback.
          </video>
        </div>
      );
    }
    
    // Office Documents (Word, Excel, PowerPoint)
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      fileType === 'application/msword' ||
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.ms-powerpoint' ||
      fileName?.match(/\.(docx|xlsx|pptx|doc|xls|ppt)$/i)
    ) {
      const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      return (
        <iframe
          src={viewerUrl}
          width="100%"
          height="600px"
          style={{ 
            border: 'none',
            borderRadius: '8px'
          }}
          title={`Office document viewer - ${fileName}`}
        />
      );
    }
    
    // Text files
    if (fileType?.startsWith('text/') || fileName?.match(/\.(txt|md|json|xml|csv|log)$/i)) {
      return <TextViewer fileUrl={fileUrl} />;
    }
    
    // Fallback: Download link
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <i className="fa-solid fa-file fa-4x" style={{ color: '#9ca3af', marginBottom: '1rem' }}></i>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Preview not available for this file type ({fileType || 'unknown'})
        </p>
        <a 
          href={fileUrl} 
          download={fileName}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i>
          Download {fileName}
        </a>
      </div>
    );
  };
  
  return (
    <div className="file-viewer" style={{ width: '100%' }}>
      {renderByType()}
    </div>
  );
}

export default FileViewer;
export { FileViewer };