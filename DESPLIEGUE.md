# 🚀 Guía de Despliegue - Netlify

## Opción 1: Despliegue Automático (Recomendado)

### Paso 1: Acceder a Netlify

1. Ve a https://netlify.com
2. Haz clic en **"Sign up"** (o inicia sesión)
3. Selecciona **"GitHub"** como método de autenticación
4. Autoriza a Netlify acceder a tu cuenta de GitHub

### Paso 2: Conectar el Repositorio

1. Una vez autenticado, haz clic en **"New site from Git"**
2. Selecciona **GitHub**
3. Busca y selecciona: `movilzone-inventario`

### Paso 3: Configurar Variables de Entorno

1. En Netlify, ve a **Site settings > Build & deploy > Environment**
2. Haz clic en **"Edit variables"**
3. Agrega tus variables de Supabase:
   ```
   VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY = tu-clave-anonima
   ```
4. Haz clic en **Save**

### Paso 4: Iniciar Despliegue

1. Haz clic en **"Deploy"**
2. Espera a que se complete (2-5 minutos)
3. ¡Listo! Tu sitio estará en vivo en una URL como: `https://movilzone-inventario-xyz.netlify.app`

### Paso 5: Despliegues Automáticos

Cada vez que hagas `git push` a `main`, Netlify **automáticamente**:
- 🔄 Detectará los cambios
- 🔨 Compilará el proyecto
- 🚀 Desplegará la nueva versión
- 📧 Te notificará por email

---

## Opción 2: Despliegue Manual (CLI)

### Instalación

```bash
npm install -g netlify-cli
```

### Autenticación

```bash
netlify login
```

### Despliegue

```bash
cd c:\Users\Herber\.gemini\antigravity\scratch\movilzone-inventario
npm run build
netlify deploy --prod --dir=dist
```

---

## Opción 3: GitHub Pages (Alternativa)

Si prefieres usar GitHub Pages:

### Paso 1: Editar vite.config.js

```javascript
export default {
  plugins: [react()],
  base: '/movilzone-inventario/', // Agregar esta línea
}
```

### Paso 2: Crear Workflow

Crear archivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings > Pages**
3. Selecciona **Source: Deploy from a branch**
4. Rama: **gh-pages**
5. Tu sitio estará en: `https://tu-usuario.github.io/movilzone-inventario/`

---

## 🔗 URLs Útiles

- **Netlify**: https://netlify.com
- **Tu Repositorio**: https://github.com/cbbejasonmanuelcadima00-lab/movilzone-inventario
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentación Vite**: https://vitejs.dev

---

## ✅ Checklist Pre-Despliegue

- ✅ Código en GitHub
- ✅ `netlify.toml` configurado
- ✅ Variables de entorno en Netlify
- ✅ `npm run build` funciona localmente
- ✅ Sin errores de ESLint

---

## 🆘 Solución de Problemas

### "Build failed"
```bash
npm run build  # Ejecutar localmente
npm run lint   # Verificar errores
```

### Variables de entorno no funcionan
- Verificar nombres: `VITE_SUPABASE_URL` (no `VITE_supabase_url`)
- Redeploy después de cambiar variables

### Página en blanco
- Verificar console del navegador (F12 > Console)
- Verificar que Supabase está accesible

---

## 📊 Monitoreo

En Netlify puedes ver:
- 📈 Analíticos de visitas
- 🔍 Logs de despliegue
- ⚡ Performance
- 🔔 Notificaciones de errores

¡Tu aplicación estará en vivo y disponible en cualquier dispositivo! 🎉
