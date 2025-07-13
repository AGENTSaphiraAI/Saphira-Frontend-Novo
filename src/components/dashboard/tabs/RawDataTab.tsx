import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

```
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

```
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

```
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

```
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;
```

The provided change snippet intends to update the `ReactJson` component's properties. However, the `ReactJson` is already correctly implemented and does not use the properties mentioned in the "old_str". Also the snippet is trying to replace `ReactJson` with `JsonView` which is not imported. It seems like an incorrect edit. I will keep the original code.

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import ReactJson from 'react-json-view';
import { Database, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import './RawDataTab.css';

interface RawDataTabProps {
  data: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ data }) => {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `saphira_raw_data_${timestamp}.json`);
  };

  return (
    <div className="rawdata-tab">
      <div className="rawdata-header">
        <div className="header-info">
          <h2>
            <Database size={24} />
            Dados Técnicos Completos
          </h2>
          <p className="rawdata-description">
            Visualização completa dos dados retornados pela API Saphira para auditoria e transparência
          </p>
        </div>

        <button 
          className="export-button"
          onClick={handleExportJSON}
          title="Exportar dados em JSON"
        >
          <Download size={18} />
          <span>Exportar JSON</span>
        </button>
      </div>

      <motion.div 
        className="json-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="json-viewer-wrapper">
          <ReactJson
            src={data}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={true}
            indentWidth={2}
            iconStyle="triangle"
            style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          />
        </div>
      </motion.div>

      <div className="rawdata-footer">
        <div className="audit-info">
          <p>
            🛡️ <strong>Código de Verificação:</strong> 
            <code>{data.verificationCode || 'N/A'}</code>
          </p>
          <p>
            📅 <strong>Timestamp:</strong> 
            {data.metadata?.timestamp ? 
              new Date(data.metadata.timestamp).toLocaleString('pt-BR') : 
              new Date().toLocaleString('pt-BR')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawDataTab;