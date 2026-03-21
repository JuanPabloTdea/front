import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadSuccess = () => {
    // Incrementar el trigger para refrescar la lista de archivos
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'upload' && <FileUpload onUploadSuccess={handleUploadSuccess} />}
      {activeTab === 'files' && <FileList refreshTrigger={refreshTrigger} />}
    </Layout>
  );
};

export default DashboardPage;
