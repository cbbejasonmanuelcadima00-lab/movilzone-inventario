# 📱 MóvilZone - Sistema de Gestión de Inventario

Una aplicación web moderna para gestionar inventario de celulares con React, Vite y Supabase.

![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)
![Node](https://img.shields.io/badge/Node-v18%2B-brightgreen)

## 🚀 Características

- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar productos
- 🔍 **Búsqueda en Tiempo Real** - Busca por modelo, marca, color o SKU
- 📊 **Gestión de Stock** - Visualiza el estado del inventario
- 🎨 **Interfaz Moderna** - Diseño responsive y atractivo
- 🗄️ **Base de Datos** - Supabase (PostgreSQL)
- ⚡ **Rendimiento** - Vite para compilación rápida
- 🎯 **Datos de Prueba** - 10 productos de ejemplo incluidos

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase (gratuita)

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/movilzone-inventario.git
cd movilzone-inventario
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Supabase
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5174/`

## 🌐 Configuración de Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. En **Settings > API**, copia:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Pégalas en `.env.local`

## 📦 Estructura del Proyecto

```
movilzone-inventario/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── public/              # Assets estáticos
├── package.json         # Dependencias
├── vite.config.js       # Configuración Vite
├── .env.example         # Plantilla de variables
└── README.md            # Este archivo
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de compilación
npm run preview

# Verificar código
npm run lint
```

## 📱 Productos de Ejemplo

La aplicación incluye 10 productos para pruebas:

| Modelo | Marca | Precio | Stock |
|--------|-------|--------|-------|
| iPhone 15 Pro Max | Apple | $1,299.99 | 8 |
| iPhone 15 | Apple | $799.99 | 15 |
| Galaxy S24 Ultra | Samsung | $1,299.99 | 5 |
| Galaxy S24 | Samsung | $899.99 | 12 |
| Xiaomi 14 | Xiaomi | $699.99 | 20 |
| Xiaomi 14 Ultra | Xiaomi | $899.99 | 3 |
| Edge 50 Ultra | Motorola | $799.99 | 9 |
| Realme GT 6 | Realme | $449.99 | 25 |
| Pura 70 | Huawei | $899.99 | 6 |
| OnePlus 12 | OnePlus | $699.99 | 0 |

## 🎯 Funcionalidades

### ➕ Agregar Producto
Haz clic en "Agregar Nuevo Dispositivo" y completa el formulario.

### ✏️ Editar Producto
Haz clic en el icono de lápiz (✏️) en la fila del producto.

### 🗑️ Eliminar Producto
Haz clic en el icono de papelera (🗑️) para eliminar.

### 🔍 Buscar
Usa la barra de búsqueda para filtrar por:
- Nombre del modelo
- Marca
- Color
- Código SKU

## 🎨 Tecnologías

- **Frontend**: React 19
- **Build Tool**: Vite 8
- **Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: CSS3
- **Linting**: ESLint

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un Issue en GitHub
- Revisa la documentación de Supabase
- Consulta la documentación de React

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

## 📝 Cambios Recientes

- ✅ Interfaz completa con tabla de inventario
- ✅ Modal para agregar/editar productos
- ✅ Búsqueda en tiempo real
- ✅ Badges de estado de stock
- ✅ Notificaciones flotantes
- ✅ Validaciones de formulario
- ✅ Datos de ejemplo incluidos

---

**Hecho con ❤️ usando React + Vite + Supabase**
