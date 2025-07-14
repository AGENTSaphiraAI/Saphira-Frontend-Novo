
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResponse {
  humanized_text?: string;
  technical_data?: any;
  verificationCode?: string;
  [key: string]: any;
}

export const exportSaphiraReportToPdf = async (response: AnalysisResponse): Promise<void> => {
  try {
    const pdf = new jsPDF();
    
    // Configurações da página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (2 * margin);
    
    // === PÁGINA 1: RELATÓRIO PRINCIPAL ===
    
    // Cabeçalho com logo
    pdf.setFillColor(11, 116, 229); // Azul Saphira
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Título
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🔬 RELATÓRIO SAPHIRA', margin, 25);
    
    // Subtítulo
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Análise Técnica de Conteúdo', margin, 32);
    
    // Data e código de verificação
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    const currentDate = new Date().toLocaleString('pt-BR');
    pdf.text(`Data: ${currentDate}`, margin, 55);
    
    if (response.verificationCode) {
      pdf.text(`Código: ${response.verificationCode}`, margin, 62);
    }
    
    // Linha separadora
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, 70, pageWidth - margin, 70);
    
    // Conteúdo da análise
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ANÁLISE INTERPRETADA', margin, 85);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const analysisText = response.humanized_text || 'Análise não disponível';
    const lines = pdf.splitTextToSize(analysisText, maxWidth);
    
    let yPosition = 95;
    const lineHeight = 6;
    
    for (const line of lines) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    }
    
    // === PÁGINA 2: MÉTRICAS VISUAIS ===
    
    // Tentar capturar a aba de métricas
    try {
      const metricsTab = document.querySelector('.metrics-grid');
      if (metricsTab) {
        const canvas = await html2canvas(metricsTab as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        pdf.addPage();
        
        // Cabeçalho da segunda página
        pdf.setFillColor(11, 116, 229);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('📊 MÉTRICAS VISUAIS', margin, 20);
        
        // Adicionar a imagem das métricas
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = maxWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let imgY = 40;
        if (imgHeight > pageHeight - 60) {
          const scale = (pageHeight - 60) / imgHeight;
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;
          pdf.addImage(imgData, 'PNG', margin, imgY, scaledWidth, scaledHeight);
        } else {
          pdf.addImage(imgData, 'PNG', margin, imgY, imgWidth, imgHeight);
        }
      }
    } catch (metricsError) {
      console.warn('Não foi possível capturar métricas visuais:', metricsError);
      
      // Página alternativa com dados técnicos em texto
      pdf.addPage();
      pdf.setFillColor(11, 116, 229);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🔧 DADOS TÉCNICOS', margin, 20);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const technicalText = JSON.stringify(response.technical_data || response, null, 2);
      const techLines = pdf.splitTextToSize(technicalText, maxWidth);
      
      let techY = 40;
      for (const line of techLines.slice(0, 50)) { // Limitar para não sobrecarregar
        if (techY > pageHeight - 20) break;
        pdf.text(line, margin, techY);
        techY += 4;
      }
    }
    
    // Rodapé
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Gerado por Saphira v3.1 - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Salvar o PDF
    const fileName = `saphira_report_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
    
    console.log(`✅ PDF exportado: ${fileName}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
};
