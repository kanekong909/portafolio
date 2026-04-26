# 🚀 Portfolio Web — Guía de Deploy en Railway

Portfolio profesional con panel de administración para gestionar proyectos.

## 📋 Características

- ✅ Diseño dark editorial con tipografía Syne + DM Mono
- ✅ Cursor personalizado y animaciones suaves
- ✅ Filtros por tecnología/tag
- ✅ Sección destacados + grilla completa
- ✅ Panel admin con login seguro
- ✅ CRUD completo de proyectos (crear, editar, eliminar)
- ✅ Subida de imágenes
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Deploy listo para Railway

---

## 🛠 Instalación local

```bash
# 1. Clonar / descomprimir el proyecto
cd portfolio

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Iniciar en desarrollo
npm run dev

# La app corre en http://localhost:3000
# Admin en http://localhost:3000/admin
# Usuario por defecto: admin / admin123
```

---

## 🚄 Deploy en Railway

### Paso 1 — Subir a GitHub
```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

### Paso 2 — Crear proyecto en Railway
1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Click en **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona tu repositorio
4. Railway detecta automáticamente Node.js

### Paso 3 — Variables de entorno en Railway
En Railway, ve a tu proyecto → **Variables** y agrega:

| Variable | Valor |
|---|---|
| `SESSION_SECRET` | una cadena larga y aleatoria |
| `ADMIN_USER` | tu usuario admin |
| `ADMIN_PASS` | tu contraseña segura |
| `PORT` | `3000` (Railway lo setea automático) |

### Paso 4 — Volumen para persistencia (importante)
Para que las imágenes y la base de datos sobrevivan redeploys:
1. En Railway → tu servicio → **"Add Volume"**
2. Mount path: `/app/data`
3. Actualiza `.env` / variables: `DB_PATH=/app/data/database.sqlite`

### Paso 5 — Dominio
Railway te da un dominio gratis tipo `tu-app.up.railway.app`
O conecta tu dominio personalizado en **Settings → Domains**

---

## 🔑 Panel de Administración

Accede en `tu-dominio.com/admin`

Desde el admin puedes:
- **Crear** proyectos con imagen, descripción, tags y links
- **Editar** cualquier campo
- **Destacar** proyectos (aparecen en la sección principal)
- **Publicar/Borrador** — controla qué es visible
- **Ordenar** proyectos por número de orden
- **Eliminar** proyectos

---

## 🎨 Personalización

### Cambiar colores (`public/css/main.css`)
```css
:root {
  --accent: #c8f564;  /* Color principal (verde lima) */
  --bg: #0a0a0a;      /* Fondo */
  --text: #f0ede8;    /* Texto */
}
```

### Cambiar info personal (`views/index.ejs`)
- Nombre en el hero
- Descripción personal
- Habilidades técnicas
- Links de redes sociales y contacto

### Cambiar fuentes
En `views/index.ejs`, cambia los links de Google Fonts y las variables:
```css
--font-display: 'Syne', sans-serif;
--font-mono: 'DM Mono', monospace;
```

---

## 🗂 Estructura del proyecto

```
portfolio/
├── server.js           # Servidor principal
├── models/
│   └── index.js        # Modelos de DB (User, Project)
├── routes/
│   ├── public.js       # Rutas del portfolio
│   └── admin.js        # Rutas del panel admin
├── views/
│   ├── index.ejs       # Página principal
│   ├── project.ejs     # Detalle de proyecto
│   └── admin/
│       ├── login.ejs
│       ├── dashboard.ejs
│       └── project-form.ejs
├── public/
│   ├── css/
│   │   ├── main.css    # Estilos del portfolio
│   │   └── admin.css   # Estilos del admin
│   ├── js/
│   │   ├── main.js     # JS del portfolio
│   │   └── admin.js    # JS del admin
│   └── uploads/        # Imágenes subidas
├── .env.example
├── railway.toml
└── package.json
```

---

## ⚡ Stack

- **Backend**: Node.js + Express
- **Base de datos**: SQLite (via Sequelize ORM)
- **Vistas**: EJS templates
- **Auth**: bcrypt + express-session
- **Upload**: Multer
- **Deploy**: Railway
