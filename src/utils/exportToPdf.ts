
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  reportContent: string;
  metricsElement?: HTMLElement;
  metadata?: {
    timestamp: string;
    verificationCode?: string;
    originalText?: string;
    fileName?: string;
  };
}

export const exportToPDF = async (data: ExportData): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Configurar fontes
    pdf.setFont('helvetica');
    
    // === PÁGINA 1: RELATÓRIO ===
    
    // Header da página 1
    addHeader(pdf, pageWidth, margin);
    
    let yPosition = 40;
    
    // Título do relatório
    pdf.setFontSize(18);
    pdf.setTextColor(30, 41, 59); // #1e293b
    pdf.text('Relatório de Análise Técnica', margin, yPosition);
    yPosition += 15;
    
    // Timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // #64748b
    const timestamp = data.metadata?.timestamp ? 
      new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
      new Date().toLocaleString('pt-BR');
    pdf.text(`Gerado em: ${timestamp}`, margin, yPosition);
    yPosition += 15;
    
    // Código de verificação
    if (data.metadata?.verificationCode) {
      pdf.text(`Código de Verificação: ${data.metadata.verificationCode}`, margin, yPosition);
      yPosition += 10;
    }
    
    // Nome do arquivo (se existir)
    if (data.metadata?.fileName) {
      pdf.text(`Arquivo Analisado: ${data.metadata.fileName}`, margin, yPosition);
      yPosition += 15;
    } else {
      yPosition += 5;
    }
    
    // Linha separadora
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(226, 232, 240); // #e2e8f0
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Conteúdo do relatório
    pdf.setFontSize(11);
    pdf.setTextColor(55, 65, 81); // #374151
    
    const reportLines = pdf.splitTextToSize(data.reportContent, contentWidth);
    const maxLinesPerPage = Math.floor((pageHeight - yPosition - 30) / 5);
    
    let currentLine = 0;
    while (currentLine < reportLines.length) {
      const linesToAdd = Math.min(maxLinesPerPage, reportLines.length - currentLine);
      const pageLines = reportLines.slice(currentLine, currentLine + linesToAdd);
      
      pageLines.forEach((line: string, index: number) => {
        pdf.text(line, margin, yPosition + (index * 5));
      });
      
      currentLine += linesToAdd;
      
      if (currentLine < reportLines.length) {
        addFooter(pdf, pageWidth, pageHeight, margin);
        pdf.addPage();
        addHeader(pdf, pageWidth, margin);
        yPosition = 40;
      }
    }
    
    // Footer da página 1
    addFooter(pdf, pageWidth, pageHeight, margin);
    
    // === PÁGINA 2: MÉTRICAS VISUAIS ===
    
    if (data.metricsElement) {
      pdf.addPage();
      addHeader(pdf, pageWidth, margin);
      
      yPosition = 40;
      
      // Título da página 2
      pdf.setFontSize(18);
      pdf.setTextColor(30, 41, 59);
      pdf.text('Análise de Métricas', margin, yPosition);
      yPosition += 20;
      
      try {
        // Capturar elemento de métricas como imagem
        const canvas = await html2canvas(data.metricsElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Verificar se a imagem cabe na página
        if (yPosition + imgHeight > pageHeight - 30) {
          // Reduzir tamanho se necessário
          const maxHeight = pageHeight - yPosition - 30;
          const scaledHeight = maxHeight;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          
          pdf.addImage(imgData, 'PNG', margin, yPosition, scaledWidth, scaledHeight);
        } else {
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        }
      } catch (error) {
        console.warn('Erro ao capturar métricas visuais:', error);
        pdf.setFontSize(12);
        pdf.setTextColor(239, 68, 68); // #ef4444
        pdf.text('Erro ao capturar visualização de métricas', margin, yPosition);
      }
      
      addFooter(pdf, pageWidth, pageHeight, margin);
    }
    
    // Salvar PDF
    const fileName = `saphira_relatorio_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
    pdf.save(fileName);
    
    console.log(`📄 PDF exportado: ${fileName}`);
    
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw new Error('Falha ao gerar PDF. Tente novamente.');
  }
};

const addHeader = (pdf: jsPDF, pageWidth: number, margin: number) => {
  // Logo/Título Saphira
  pdf.setFontSize(16);
  pdf.setTextColor(59, 130, 246); // #3b82f6
  pdf.text('💙 Saphira', margin, margin);
  
  // Subtítulo
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Análise Inteligente, Técnica e Auditável', margin, margin + 8);
  
  // Linha header
  pdf.setLineWidth(1);
  pdf.setDrawColor(59, 130, 246);
  pdf.line(margin, margin + 12, pageWidth - margin, margin + 12);
};

const addFooter = (pdf: jsPDF, pageWidth: number, pageHeight: number, margin: number) => {
  const footerY = pageHeight - 15;
  
  // Linha footer
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  // Texto footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Gerado pela Saphira - Análise Inteligente, Técnica e Auditável', margin, footerY);
  
  // Número da página
  const pageNumber = pdf.internal.getCurrentPageInfo().pageNumber;
  pdf.text(`Página ${pageNumber}`, pageWidth - margin - 20, footerY);
};
