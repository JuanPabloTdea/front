import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  Container,
  Avatar,
} from '@mui/material';
import { Logout, CloudUpload, Folder } from '@mui/icons-material';

const Layout = ({ activeTab, onTabChange, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <CloudUpload sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FileManager
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'secondary.main',
                  fontSize: '0.9rem',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{user?.email}</Typography>
            </Box>
            <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Tabs value={activeTab} onChange={onTabChange}>
            <Tab
              icon={<CloudUpload />}
              iconPosition="start"
              label="Subir Archivos"
              value="upload"
            />
            <Tab
              icon={<Folder />}
              iconPosition="start"
              label="Mis Archivos"
              value="files"
            />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
