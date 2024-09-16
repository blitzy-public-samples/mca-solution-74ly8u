import React, { useState, useEffect } from 'react';
import { getDocuments, uploadDocument } from '../services/api';
import { formatDate } from '../utils/formatters';

// HUMAN ASSISTANCE NEEDED
// The following component needs review and potential improvements for production readiness.
// Areas that may need attention:
// - Error handling for API calls
// - Accessibility improvements
// - Performance optimizations for large document lists
// - Proper typing for state variables and function parameters

const DocumentViewer: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments(applicationId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // TODO: Implement proper error handling and user feedback
    }
  };

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadDocument(applicationId, file);
      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      // TODO: Implement proper error handling and user feedback
    }
  };

  return (
    <div className="document-viewer">
      <h2>Documents</h2>
      <div className="document-list">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="document-item"
            onClick={() => handleDocumentClick(doc)}
          >
            <span>{doc.name}</span>
            <span>{formatDate(doc.uploadDate)}</span>
          </div>
        ))}
      </div>
      
      {selectedDocument && (
        <div className="document-preview">
          <h3>Preview: {selectedDocument.name}</h3>
          {/* TODO: Implement actual document preview based on file type */}
          <p>Document preview not implemented</p>
        </div>
      )}
      
      <div className="document-upload">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>
          Upload Document
        </button>
      </div>
    </div>
  );
};

export default DocumentViewer;