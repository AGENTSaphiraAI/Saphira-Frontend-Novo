import React, { useState } from "react";

interface FileUploaderProps {
  onFileContentChange?: (content: string, fileName: string, file?: File) => void;
}

function FileUploader({ onFileContentChange }: FileUploaderProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      alert("⚠️ Apenas arquivos .txt, .pdf, .doc e .docx são permitidos para upload.");
      return;
    }

    setIsUploading(true);

    // Verificar limite de 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ Arquivo muito grande! O limite é de 10MB. Por favor, selecione um arquivo menor.");
       setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      setFileName(file.name);
      setIsUploading(false);


      if (onFileContentChange) {
        onFileContentChange(content, file.name, file); // Passando o File object também
      }

      console.log(`📁 Arquivo carregado: ${file.name} (${content.length} caracteres)`);
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert("❌ Erro ao ler o arquivo. Tente novamente.");
    };

    reader.readAsText(file);
  };


  const handleRemoveFile = () => {
    setFileContent(null);
    setFileName(null);

    // Reset input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    console.log("🗑️ Arquivo removido");
  };

  const [uploading, setUploading] = useState(false);

  return (
    <div className="file-uploader">
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          <span className="upload-text">
            ☁️ Selecionar Arquivo (.txt, .pdf, .docx)
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file-input"
        />
        <div className="upload-info">
          <p className="upload-note">📝 Suporte ativo: TXT, PDF, DOC e DOCX</p>
        </div>
      </div>

      {isUploading && (
        <div className="upload-status">
          🔄 Carregando arquivo...
        </div>
      )}

      {fileName && fileContent && (
        <div className="file-preview">
          <div className="file-header">
            <div className="file-info">
              <strong>📄 Arquivo:</strong> <span className="file-name">{fileName}</span>
              <span className="file-size">({fileContent.length} caracteres)</span>
            </div>
            <button 
              onClick={handleRemoveFile} 
              className="remove-button"
              title="Remover arquivo"
            >
              🗑️
            </button>
          </div>

          <div className="file-content">
            <pre className="content-preview">
              {fileContent.length > 500 
                ? fileContent.substring(0, 500) + "..." 
                : fileContent
              }
            </pre>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-uploader {
          width: 100%;
          padding: 1rem;
          box-sizing: border-box;
        }

        .upload-section {
          margin-bottom: 1rem;
        }

        .upload-label {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem;
          background-color: #f0f0f0;
          border: 1px dashed #ccc;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 0.5rem;
          text-align: center; /* Centralize o texto */
        }

        .upload-text {
          display: inline; /* Garante que o texto fique na mesma linha */
        }

        .file-input {
          display: none;
        }

        .upload-info {
          text-align: center;
        }

        .upload-note {
          font-size: 0.875rem;
          color: #777;
        }

        .upload-status {
          text-align: center;
          margin-bottom: 1rem;
        }

        .file-preview {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 1rem;
        }

        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .file-info {
          display: flex;
          align-items: center;
        }

        .file-name {
          margin-left: 0.5rem;
          font-weight: bold;
        }

        .file-size {
          margin-left: 0.5rem;
          font-size: 0.875rem;
          color: #777;
        }

        .remove-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .content-preview {
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 0.875rem;
          max-height: 200px;
          overflow-y: auto;
          padding: 0.5rem;
          background-color: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        @media (max-width: 600px) {
          .upload-label {
            padding: 0.5rem;
            flex-direction: column; /* Empilha os elementos verticalmente */
          }

          .upload-text {
            margin-top: 0.25rem; /* Adiciona espaço entre o ícone e o texto */
          }

          .file-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .file-name {
            margin-left: 0;
            margin-top: 0.25rem;
          }

          .file-size {
            margin-left: 0;
            margin-top: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FileUploader;