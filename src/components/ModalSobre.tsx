
import React from "react";

const ModalSobre = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-2">💙 Sobre a Saphira</h2>
        <p className="mb-4 text-sm">
          Nossa Missão: Trazer Clareza em um Mundo Complexo.
          <br /><br />
          A Saphira é uma plataforma de análise premium projetada para oferecer precisão técnica, transparência total e rastreabilidade auditável. 
          Nosso objetivo é fornecer uma leitura neutra, objetiva e fundamentada para qualquer conteúdo que você desejar examinar.
          <br /><br />
          Seus dados não são armazenados: cada análise é processada, entregue e imediatamente descartada. 
          A Saphira sempre mostrará o raciocínio por trás de cada conclusão.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalSobre;
