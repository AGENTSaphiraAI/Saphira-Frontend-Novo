import React, { useEffect } from 'react';

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TechnicalModal: React.FC<TechnicalModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111827',
          color: '#F9FAFB',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'transform 0.3s ease'
        }}
      >
        <h2>🟦 Sobre a Saphira</h2>
        <h3 style={{ marginTop: '1rem', color: '#3B82F6' }}>Nossa Missão: Trazer Clareza em um Mundo Complexo</h3>
        <p>Bem-vindo ao Projeto Saphira. Em uma era de sobrecarga de informações e narrativas confusas, nossa missão é simples e poderosa: fornecer uma análise técnica, neutra e auditável para qualquer conteúdo que você nos apresentar.</p>
        <h4>O que fazemos?</h4>
        <ul>
          <li><strong>Privacidade Absoluta:</strong> Os dados que você analisa são processados e esquecidos. Não armazenamos o conteúdo original.</li>
          <li><strong>Transparência Radical:</strong> A Saphira sempre mostrará os fatos e os dados brutos que a levaram à conclusão.</li>
          <li><strong>Verificabilidade Incontestável:</strong> Cada análise é feita para ser justa e baseada em evidências lógicas.</li>
        </ul>
        <h4>Como usar?</h4>
        <p>Basta colar ou enviar um texto para análise. A Saphira irá processá-lo e revelar insights objetivos, ajudando você a ver além do ruído.</p>
        <p>Este projeto está em constante evolução. Sua curiosidade e feedback nos move para frente.</p>
        <button
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TechnicalModal;