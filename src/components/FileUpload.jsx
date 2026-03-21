import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { filesAPI } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = async (newFiles) => {
    setError('');

    const filesWithMetadata = newFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      uploaded: false,
      uploading: false,
      error: null,
    }));

    setFiles((prev) => [...prev, ...filesWithMetadata]);

    // Subir archivos uno por uno
    for (const fileData of filesWithMetadata) {
      await uploadFile(fileData);
    }
  };

  const uploadFile = async (fileData) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileData.id ? { ...f, uploading: true } : f
      )
    );

    try {
      await filesAPI.upload(fileData.file);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, uploading: false, uploaded: true, error: null }
            : f
        )
      );

      // Notificar al componente padre que se subió un archivo
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, uploading: false, uploaded: false, error: error.message }
            : f
        )
      );
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          backgroundColor: isDragging ? 'primary.light' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'grey.50',
          },
        }}
      >
        <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragging
            ? 'Suelta los archivos aquí'
            : 'Arrastra archivos aquí o haz clic para seleccionar'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Máximo 10MB por archivo
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Archivos ({files.length})
          </Typography>
          <List>
            {files.map((fileData) => (
              <ListItem
                key={fileData.id}
                secondaryAction={
                  !fileData.uploading && (
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(fileData.id)}
                    >
                      <Delete />
                    </IconButton>
                  )
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: fileData.error ? 'error.main' : 'grey.200',
                }}
              >
                <ListItemIcon>
                  {fileData.uploading ? (
                    <CircularProgress size={24} />
                  ) : fileData.error ? (
                    <ErrorIcon color="error" />
                  ) : (
                    <InsertDriveFile color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={fileData.name}
                  secondary={
                    fileData.error
                      ? fileData.error
                      : formatFileSize(fileData.size)
                  }
                  secondaryTypographyProps={{
                    color: fileData.error ? 'error' : 'textSecondary',
                  }}
                />
                {fileData.uploaded && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Subido"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
                {fileData.uploading && (
                  <Chip
                    label="Subiendo..."
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
