import React, { useState } from "react";

interface FileUploaderProps {
  onFileContentChange?: (content: string, fileName: string, file?: File) => void;
}

// FUNÇÕES DE SEGURANÇA
const validateFileSignature = (bytes: Uint8Array, mimeType: string, extension: string): boolean => {
  const magicNumbers = {
    '.pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    '.txt': [], // TXT não tem magic number específico
    '.doc': [0xD0, 0xCF, 0x11, 0xE0], // Microsoft Office
    '.docx': [0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00] // ZIP (DOCX é ZIP)
  };

  const expectedMagic = magicNumbers[extension as keyof typeof magicNumbers];
  
  // TXT é permitido sem validação de magic number
  if (extension === '.txt') return true;
  
  if (!expectedMagic) return false;
  
  // Verifica se os primeiros bytes correspondem
  for (let i = 0; i < expectedMagic.length; i++) {
    if (bytes[i] !== expectedMagic[i]) {
      return false;
    }
  }
  
  return true;
};

const validateFileName = (fileName: string): boolean => {
  // Apenas caracteres alfanuméricos, hífen, underscore e ponto
  const validNameRegex = /^[a-zA-Z0-9._-]+$/;
  
  // Verifica extensões duplas maliciosas
  const suspiciousExtensions = /\.(exe|bat|cmd|scr|vbs|js|jar|com|pif)(\.|$)/i;
  
  return validNameRegex.test(fileName) && !suspiciousExtensions.test(fileName) && fileName.length <= 255;
};

const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
};

function FileUploader({ onFileContentChange }: FileUploaderProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. VALIDAÇÃO DE EXTENSÃO RIGOROSA
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      alert("⚠️ Apenas arquivos .txt, .pdf, .doc e .docx são permitidos para upload.");
      return;
    }

    // 2. VALIDAÇÃO DE MAGIC NUMBERS (ASSINATURA DE ARQUIVO)
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    const isValidFileType = validateFileSignature(uint8Array, file.type, fileExtension);
    if (!isValidFileType) {
      alert("🚨 SEGURANÇA: Arquivo rejeitado. Assinatura não corresponde ao tipo declarado.");
      e.target.value = ''; // Limpa o input
      return;
    }

    // 3. VALIDAÇÃO DE NOME DE ARQUIVO
    if (!validateFileName(file.name)) {
      alert("⚠️ Nome de arquivo inválido. Use apenas caracteres alfanuméricos, hífen e underscore.");
      e.target.value = '';
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