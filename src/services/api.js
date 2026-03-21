const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// Helper para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');

// Helper para setear el token en localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Helper para remover el token del localStorage
const removeToken = () => localStorage.removeItem('token');

// Helper para hacer peticiones con fetch
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || `Error: ${response.status}`);
  }

  return response.json();
};

// API de Autenticación
export const authAPI = {
  register: async (data) => {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.token);
    return response;
  },

  login: async (data) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.token);
    return response;
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/profile');
  },

  logout: () => {
    removeToken();
  },

  isAuthenticated: () => {
    return !!getToken();
  },
};

// API de Archivos
export const filesAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al subir archivo' }));
      throw new Error(error.message || `Error: ${response.status}`);
    }

    return response.json();
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/files/upload-multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al subir archivos' }));
      throw new Error(error.message || `Error: ${response.status}`);
    }

    return response.json();
  },

  getAll: async () => {
    return fetchWithAuth('/files');
  },

  getStats: async () => {
    return fetchWithAuth('/files/stats');
  },

  getById: async (id) => {
    return fetchWithAuth(`/files/${id}`);
  },

  download: async (id, filename) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/files/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar archivo');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  delete: async (id) => {
    return fetchWithAuth(`/files/${id}`, {
      method: 'DELETE',
    });
  },
};

export { getToken, removeToken, setToken };

