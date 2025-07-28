
// Caminho do Arquivo: src/components/TechnicalModal.tsx
import React from 'react';

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TechnicalModal: React.FC<TechnicalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const aboutContent = `
    <div style="text-align: left; line-height: 1.7;">
      <h2 style="color: #0b74e5; border-bottom: 2px solid #eee; padding-bottom: 10px;">💎 Nossa Missão: Clareza na Era da Complexidade</h2>
      <p>
        Em um mundo inundado de informações, a Saphira nasceu com um propósito claro: ser sua especialista em <strong>integridade e verdade operacional</strong>. Não somos apenas mais uma IA; somos sua parceira analítica, dedicada a transformar o complexo em compreensível.
      </p>

      <h3 style="color: #1e293b; margin-top: 2rem;">✨ Como a Saphira Pensa?</h3>
      <p>
        Nossa operação é baseada em uma <strong>"Constituição"</strong> de princípios rigorosos. Cada análise que você recebe é o resultado de um processo que valoriza:
      </p>
      <ul>
        <li><strong>Neutralidade Absoluta:</strong> Analisamos os dados sem viés ou agenda.</li>
        <li><strong>Rigor Técnico:</strong> Nossas conclusões são baseadas em lógica estruturada, não em opiniões.</li>
        <li><strong>Transparência Radical:</strong> Acreditamos que a verdadeira inteligência inclui admitir o que não se sabe. A Saphira sempre comunicará seu grau de certeza.</li>
      </ul>

      <h3 style="color: #1e293b; margin-top: 2rem;">⚖️ Para o Especialista Jurídico: Seus Superpoderes</h3>
      <p>
        Ao selecionar a <strong>Análise Jurídica</strong>, você ativa protocolos de nível profissional. A Saphira se torna uma "Juíza Digital", capaz de:
      </p>
      <ul>
        <li><strong>Detectar Riscos Contratuais:</strong> Identificar ambiguidades e cláusulas que conflitam com a legislação vigente.</li>
        <li><strong>Verificar a Integridade da Informação:</strong> Analisar a coerência e a força dos argumentos em documentos legais.</li>
        <li><strong>Acelerar a Pesquisa:</strong> Servir como uma assistente de pesquisa incansável, apontando os fatos mais relevantes em segundos.</li>
      </ul>
      <br>
      <p><em>Obrigado por fazer parte da nossa jornada. Sua curiosidade nos impulsiona.</em></p>
    </div>
  `;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>Sobre a Saphira</h3>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div style={styles.body} dangerouslySetInnerHTML={{ __html: aboutContent }} />
      </div>
    </div>
  );
};

// Estilos para o modal
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
    padding: '1rem',
  },
  content: {
    background: '#fff',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    borderRadius: '8px',
    maxWidth: window.innerWidth <= 768 ? '95vw' : '650px',
    width: '100%',
    maxHeight: window.innerWidth <= 768 ? '85vh' : '80vh',
    color: '#333',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
    marginBottom: '1rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    cursor: 'pointer',
    color: '#aaa',
    padding: '0.25rem',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
    lineHeight: '1.6',
  }
};

export default TechnicalModal;
