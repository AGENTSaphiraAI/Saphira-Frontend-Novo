import React, { useState } from "react";

interface FileUploaderProps {
  onFileContentChange?: (content: string, fileName: string) => void;
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

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      setFileName(file.name);
      setIsUploading(false);


      if (onFileContentChange) {
        onFileContentChange(content, file.name);
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
          ☁️ Selecionar Arquivo (.txt, .pdf, .docx)
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
              <strong>📄 Arquivo:</strong> {fileName}
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
    </div>
  );
}

export default FileUploader;