
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './AboutSaphira.css';

const AboutSaphira: React.FC = () => {
    const [readme, setReadme] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const backendUrl = `https://${window.location.hostname.replace('saphira-frontend-novo', 'Saphira-Engine-Backend')}`;
        fetch(`${backendUrl}/api/readme`)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => setReadme(data.readme_content || '# Documento não encontrado ou o conteúdo está vazio.'))
            .catch(error => { 
                console.error("Erro ao buscar README:", error); 
                setReadme('# Erro de Conexão.\n\nNão foi possível carregar as informações do projeto.'); 
            })
            .finally(() => setIsLoading(false));
    }, []);
    
    return (
        <div className="about-container">
            {isLoading ? (
                <p>Carregando o manifesto do projeto Saphira...</p>
            ) : (
                <ReactMarkdown>{readme}</ReactMarkdown>
            )}
        </div>
    );
};

export default AboutSaphira;
