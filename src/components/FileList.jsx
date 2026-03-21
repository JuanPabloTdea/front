import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Delete,
  FolderOpen,
  Download,
} from '@mui/icons-material';
import { filesAPI } from '../services/api';

const FileList = ({ refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await filesAPI.getAll();
      setFiles(data);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      setError(error.message || 'Error al cargar archivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.includes('pdf')) {
      return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
    } else if (mimetype.includes('image')) {
      return <Image sx={{ color: '#1976d2' }} />;
    } else {
      return <InsertDriveFile sx={{ color: '#757575' }} />;
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    try {
      await filesAPI.delete(id);
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      setError(error.message || 'Error al eliminar archivo');
    }
  };

  const handleDownloadFile = async (id, filename) => {
    try {
      await filesAPI.download(id, filename);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      setError(error.message || 'Error al descargar archivo');
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Cargando archivos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (files.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <FolderOpen sx={{ fontSize: 100, color: 'grey.300', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay archivos aún
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sube archivos en la pestaña "Subir Archivos"
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mis Archivos ({files.length})
      </Typography>
      <List>
        {files.map((file) => (
          <Paper key={file.id} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    onClick={() => handleDownloadFile(file.id, file.originalName)}
                    color="primary"
                    sx={{ mr: 1 }}
                    title="Descargar"
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(file.id)}
                    color="error"
                    title="Eliminar"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemIcon>{getFileIcon(file.mimetype)}</ListItemIcon>
              <ListItemText
                primary={file.originalName}
                secondary={
                  <>
                    {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default FileList;
