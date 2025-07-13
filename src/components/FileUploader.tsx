import React, { useState } from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
// import { Document, Packer, Paragraph, TextRun } from 'docx';

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

    // Only allow .txt files for upload
    if (!file.name.endsWith(".txt")) {
      alert("⚠️ Apenas arquivos .txt são permitidos para upload.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      setFileName(file.name);
      setIsUploading(false);

      // Notificar componente pai se callback fornecido
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

  const handleExportPDF = () => {
    if (!fileContent) {
      alert("⚠️ Nenhum conteúdo para exportar.");
      return;
    }

    try {
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(fileContent, 180);
      doc.text(lines, 10, 10);

      const pdfFileName = fileName ? fileName.replace(/\.[^/.]+$/, "") + ".pdf" : "saphira_export.pdf";
      doc.save(pdfFileName);

      console.log(`📄 PDF exportado: ${pdfFileName}`);
    } catch (error) {
      console.error("❌ Erro ao exportar PDF:", error);
      alert("❌ Erro ao exportar PDF. Tente novamente.");
    }
  };

  const handleExportDOC = async () => {
    if (!fileContent) {
      alert("⚠️ Nenhum conteúdo para exportar.");
      return;
    }

    try {
      // const doc = new Document({
      //   sections: [
      //     {
      //       properties: {},
      //       children: [
      //         new Paragraph({
      //           children: [new TextRun(fileContent)],
      //         }),
      //       ],
      //     },
      //   ],
      // });

      // const blob = await Packer.toBlob(doc);
      const docFileName = fileName ? fileName.replace(/\.[^/.]+$/, "") + ".docx" : "saphira_export.docx";
      // saveAs(blob, docFileName);
      alert("❌ Exportação DOC não suportada no momento.");

      console.log(`📝 DOC exportado: ${docFileName}`);
    } catch (error) {
      console.error("❌ Erro ao exportar DOC:", error);
      alert("❌ Erro ao exportar DOC. Tente novamente.");
    }
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

  return (
    <div className="file-uploader">
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          📁 Selecionar Arquivo (.txt)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file-input"
        />
        <div className="upload-info">
          <p className="upload-note">📝 Suporte futuro: PDF e DOC</p>
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

          <div className="export-buttons">
            <button 
              onClick={handleExportPDF} 
              className="export-button pdf-button"
              title="Exportar como PDF"
            >
              📄 Exportar PDF
            </button>
            <button 
              onClick={handleExportDOC}
              className="export-button doc-button"
              title="Exportar como DOC"
            >
              📝 Exportar DOC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;