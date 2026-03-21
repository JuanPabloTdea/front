# Frontend - Aplicación Nube

Aplicación frontend desarrollada con React y Vite.

## Tecnologías

- **React 19** - Librería de UI
- **Vite 8** - Build tool y dev server
- **Material-UI 7** - Componentes UI
- **React Router 7** - Enrutamiento
- **Emotion** - CSS-in-JS styling

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
npm install
```

## Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

## Scripts Disponibles

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## Estructura del Proyecto

```
front/
├── public/          # Archivos estáticos
├── src/             # Código fuente
│   ├── components/  # Componentes reutilizables
│   ├── pages/       # Páginas/Vistas
│   ├── App.jsx      # Componente principal
│   └── main.jsx     # Punto de entrada
└── index.html       # HTML base
```

## Desarrollo

La aplicación se ejecuta por defecto en `http://localhost:5173`

```bash
npm run dev
```
