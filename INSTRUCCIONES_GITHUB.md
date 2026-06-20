# 📱 MóvilZone - Instrucciones para GitHub

## 1️⃣ Crear Repositorio en GitHub

1. Abre https://github.com/new
2. Nombre: `movilzone-inventario`
3. Descripción: `Sistema de gestión de inventario de celulares con React, Vite y Supabase`
4. Elige "Public" o "Private" según prefieras
5. Haz clic en "Create repository"

## 2️⃣ Configurar Git Localmente

```bash
# Navega a la carpeta del proyecto
cd c:\Users\Herber\.gemini\antigravity\scratch\movilzone-inventario

# Inicializa Git
git init

# Configura tu usuario Git (solo la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# Añade todos los archivos
git add .

# Hace el primer commit
git commit -m "Inicial: Aplicación de inventario de celulares con React y Supabase"

# Conecta con tu repositorio de GitHub (reemplaza USERNAME y REPO)
git remote add origin https://github.com/TU_USUARIO/movilzone-inventario.git

# Sube el código a GitHub
git branch -M main
git push -u origin main
```

## 3️⃣ Clonar en Otra Computadora

```bash
# Clona el repositorio
git clone https://github.com/TU_USUARIO/movilzone-inventario.git

# Entra a la carpeta
cd movilzone-inventario

# Instala las dependencias
npm install

# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Supabase
# Abre .env.local y reemplaza los valores

# Inicia el servidor
npm run dev
```

## 4️⃣ Archivos Importantes

- `.env.local` - Variables de entorno (NO subir a GitHub)
- `.gitignore` - Archivos que Git ignora
- `.env.example` - Plantilla para otros usuarios
- `package.json` - Dependencias del proyecto
- `vite.config.js` - Configuración de Vite
- `eslint.config.js` - Reglas de linting

## 5️⃣ Comandos Útiles

```bash
# Ver estado
git status

# Añadir cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Descargar cambios de otros
git pull
```

## 🔐 Seguridad

- ✅ `.gitignore` excluye `.env.local`
- ✅ Usa `.env.example` para compartir estructura
- ✅ Nunca compartas claves de Supabase en GitHub
- ✅ Las credenciales están en variables de entorno

¡Listo! Tu proyecto está preparado para GitHub 🚀
