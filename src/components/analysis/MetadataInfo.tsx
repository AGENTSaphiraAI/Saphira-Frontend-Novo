import React from 'react';

interface MetadataInfoProps {
  data: {
    source_type: string;
    processing_time: string;
    modules_used: string[];
  };
}

const MetadataInfo = React.memo(function MetadataInfo({ data }: MetadataInfoProps) {
  return (
    <div className="card metadata-card">
      <h5>ℹ️ Metadados</h5>
      <p>Fonte: {data.source_type}</p>
      <p>Tempo de processamento: {data.processing_time}</p>
      <p>Módulos: {data.modules_used.join(", ")}</p>
    </div>
  );
});

export default MetadataInfo;