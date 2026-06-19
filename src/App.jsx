import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - Reemplaza con tus credenciales reales en .env.local o aquí
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qrqmakfzzcnrrgiaxlkc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_5naDb0DNwiH55nzyVcpP2A_65ly7Mh_";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Datos de ejemplo para pruebas
const PRODUCTOS_EJEMPLO = [
  { id: 1, nombre: 'iPhone 15 Pro Max', marca: 'Apple', color: 'Negro Espacial', almacenamiento: '256GB', sku: 'APP-IPH15-256', precio: 1299.99, stock: 8, descripcion: 'Pantalla OLED 6.7", A17 Pro, cámara 48MP' },
  { id: 2, nombre: 'iPhone 15', marca: 'Apple', color: 'Azul', almacenamiento: '128GB', sku: 'APP-IPH15-128', precio: 799.99, stock: 15, descripcion: 'Pantalla OLED 6.1", A16 Bionic' },
  { id: 3, nombre: 'Samsung Galaxy S24 Ultra', marca: 'Samsung', color: 'Titanio Negro', almacenamiento: '512GB', sku: 'SAM-S24-512', precio: 1299.99, stock: 5, descripcion: 'Pantalla AMOLED 6.8", Snapdragon 8 Gen 3' },
  { id: 4, nombre: 'Samsung Galaxy S24', marca: 'Samsung', color: 'Plata', almacenamiento: '256GB', sku: 'SAM-S24-256', precio: 899.99, stock: 12, descripcion: 'Pantalla AMOLED 6.2", Snapdragon 8 Gen 3' },
  { id: 5, nombre: 'Xiaomi 14', marca: 'Xiaomi', color: 'Negro', almacenamiento: '512GB', sku: 'XIA-14-512', precio: 699.99, stock: 20, descripcion: 'Snapdragon 8 Gen 3 Leading Version, AMOLED' },
  { id: 6, nombre: 'Xiaomi 14 Ultra', marca: 'Xiaomi', color: 'Blanco', almacenamiento: '1TB', sku: 'XIA-14U-1TB', precio: 899.99, stock: 3, descripcion: 'Cámara Leica 50MP, Snapdragon 8 Gen 3' },
  { id: 7, nombre: 'Motorola Edge 50 Ultra', marca: 'Motorola', color: 'Gris', almacenamiento: '512GB', sku: 'MOT-E50U-512', precio: 799.99, stock: 9, descripcion: 'Pantalla AMOLED 6.7", Snapdragon 8 Gen 3' },
  { id: 8, nombre: 'Realme GT 6', marca: 'Realme', color: 'Dorado', almacenamiento: '256GB', sku: 'REA-GT6-256', precio: 449.99, stock: 25, descripcion: 'Snapdragon 8 Gen 3 Leading, batería 5500mAh' },
  { id: 9, nombre: 'Huawei Pura 70', marca: 'Huawei', color: 'Rojo', almacenamiento: '512GB', sku: 'HUA-70-512', precio: 899.99, stock: 6, descripcion: 'Kirin 9300, Zoom óptico 3x' },
  { id: 10, nombre: 'OnePlus 12', marca: 'OnePlus', color: 'Verde Silvestre', almacenamiento: '256GB', sku: 'ONE-12-256', precio: 699.99, stock: 0, descripcion: 'Snapdragon 8 Gen 3, carga 100W' }
];

export default function App() {
  // Estados de Datos
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estado para las Notificaciones (Toast)
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: '' });

  // Estado para Formularios (Agregar / Editar)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 
  const [formulario, setFormulario] = useState({
    nombre: '', marca: 'Apple', color: '', almacenamiento: '', sku: '', precio: '', stock: '', descripcion: ''
  });

  // Cargar inventario al iniciar la aplicación
  useEffect(() => {
    // Cargar productos de ejemplo siempre
    setProductos(PRODUCTOS_EJEMPLO);
    setLoading(false);
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('celulares').select('*').order('id', { ascending: false });
      if (error) {
        // Si hay error, cargar datos de prueba
        console.log('Cargando datos de prueba...');
        setProductos(PRODUCTOS_EJEMPLO);
      } else if (data && data.length > 0) {
        setProductos(data);
      } else {
        // Si no hay datos, cargar productos de ejemplo
        setProductos(PRODUCTOS_EJEMPLO);
      }
    } catch (err) {
      console.log('Usando datos de prueba...');
      setProductos(PRODUCTOS_EJEMPLO);
    } finally {
      setLoading(false);
    }
  };

  // Helper para lanzar alertas eficientes visuales
  const lanzarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' }), 4000);
  };

  // Controlar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Abrir modal para añadir un producto limpio
  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormulario({ nombre: '', marca: 'Apple', color: '', almacenamiento: '', sku: '', precio: '', stock: '', descripcion: '' });
    setModalAbierto(true);
  };

  // Abrir modal cargando datos existentes para edición
  const abrirModalEditar = (prod) => {
    setEditandoId(prod.id);
    setFormulario({
      nombre: prod.nombre, marca: prod.marca, color: prod.color,
      almacenamiento: prod.almacenamiento, sku: prod.sku, precio: prod.precio, stock: prod.stock, descripcion: prod.descripcion || ''
    });
    setModalAbierto(true);
  };

  // Guardar datos (Sirve para CREATE y UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas de Frontend
    if (formulario.nombre.trim().length < 3) return lanzarNotificacion('El nombre debe tener mínimo 3 caracteres', 'error');
    if (parseFloat(formulario.precio) <= 0) return lanzarNotificacion('El precio debe ser un número positivo', 'error');
    if (parseInt(formulario.stock) < 0) return lanzarNotificacion('El stock no puede ser negativo', 'error');

    const payload = {
      nombre: formulario.nombre,
      marca: formulario.marca,
      color: formulario.color,
      almacenamiento: formulario.almacenamiento,
      sku: formulario.sku,
      precio: parseFloat(formulario.precio),
      stock: parseInt(formulario.stock),
      descripcion: formulario.descripcion
    };

    if (editandoId) {
      // Operación: ACTUALIZAR (UPDATE)
      const { error } = await supabase.from('celulares').update(payload).eq('id', editandoId);
      if (error) {
        lanzarNotificacion(`Error: ${error.message}`, 'error');
      } else {
        lanzarNotificacion('¡Producto actualizado correctamente!', 'exito');
        setModalAbierto(false);
        fetchProductos();
      }
    } else {
      // Operación: CREAR (CREATE)
      const { error } = await supabase.from('celulares').insert([payload]);
      if (error) {
        lanzarNotificacion('Error: El SKU ya existe o faltan campos obligatorios', 'error');
      } else {
        lanzarNotificacion('¡Producto añadido al inventario!', 'exito');
        setModalAbierto(false);
        fetchProductos();
      }
    }
  };

  // Operación: ELIMINAR (DELETE) con confirmación integrada nativa
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás completamente seguro de eliminar el dispositivo "${nombre}"?`);
    if (!confirmar) return;

    const { error } = await supabase.from('celulares').delete().eq('id', id);
    if (error) {
      lanzarNotificacion('No se pudo eliminar el producto', 'error');
    } else {
      lanzarNotificacion('Producto eliminado del inventario', 'exito');
      fetchProductos();
    }
  };

  // Helper dinámico para badges de disponibilidad de stock
  const obtenerBadgeStock = (cantidad) => {
    const stockNum = parseInt(cantidad);
    if (stockNum === 0) return <span className="badge agotado">Agotado</span>;
    if (stockNum <= 3) return <span className="badge bajo">Bajo Stock</span>;
    return <span className="badge disponible">Disponible</span>;
  };

  // Filtro inteligente en tiempo real (Nombre, Marca, Color, SKU)
  const productosFiltrados = productos.filter((prod) => {
    const termino = busqueda.toLowerCase().trim();
    return (
      (prod.nombre?.toLowerCase() || '').includes(termino) ||
      (prod.marca?.toLowerCase() || '').includes(termino) ||
      (prod.color?.toLowerCase() || '').includes(termino) ||
      (prod.sku?.toLowerCase() || '').includes(termino)
    );
  });

  return (
    <div className="container">
      {/* Alerta de notificación flotante */}
      {notificacion.mostrar && (
        <div className={`toast-notification ${notificacion.tipo}`}>
          {notificacion.tipo === 'exito' ? '✅ ' : '❌ '} {notificacion.mensaje}
        </div>
      )}

      {/* Encabezado */}
      <header className="main-header">
        <div>
          <h1>MóvilZone</h1>
          <p>Panel de Gestión de Inventario Automatizado (Supabase)</p>
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ➕ Agregar Nuevo Dispositivo
        </button>
      </header>

      {/* Barra de Gestión: Búsqueda */}
      <section className="search-section">
        <input
          type="text"
          placeholder="Buscar por modelo, marca, color o código SKU en tiempo real..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </section>

      {/* Tabla del Inventario Principal */}
      <main className="table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Sincronizando con la base de datos de Supabase...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="no-data">No se encontraron dispositivos que coincidan con la búsqueda o la base de datos está vacía.</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Dispositivo</th>
                <th>Marca</th>
                <th>Especificaciones</th>
                <th>Precio</th>
                <th>Cant.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td className="sku-text">{prod.sku}</td>
                  <td><strong>{prod.nombre}</strong></td>
                  <td><span className="brand-tag">{prod.marca}</span></td>
                  <td className="specs-text">{prod.color} • {prod.almacenamiento}</td>
                  <td className="price-text">${parseFloat(prod.precio).toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>{obtenerBadgeStock(prod.stock)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit" onClick={() => abrirModalEditar(prod)} title="Editar">✏️</button>
                      <button className="btn-action delete" onClick={() => handleEliminar(prod.id, prod.nombre)} title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* ================= MODAL DE FORMULARIO (CREAR / EDITAR) ================= */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editandoId ? '✏️ Modificar Celular' : '➕ Registrar Nuevo Dispositivo'}</h2>
              <button className="close-button" onClick={() => setModalAbierto(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Modelo *</label>
                  <input type="text" name="nombre" value={formulario.nombre} onChange={handleInputChange} required placeholder="Ej: iPhone 15 Pro Max" />
                </div>

                <div className="form-group">
                  <label>Marca *</label>
                  <select name="marca" value={formulario.marca} onChange={handleInputChange} required>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Motorola">Motorola</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Realme">Realme</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color *</label>
                  <input type="text" name="color" value={formulario.color} onChange={handleInputChange} required placeholder="Ej: Negro Espacial" />
                </div>

                <div className="form-group">
                  <label>Almacenamiento Interno *</label>
                  <input type="text" name="almacenamiento" value={formulario.almacenamiento} onChange={handleInputChange} required placeholder="Ej: 128GB, 256GB" />
                </div>

                <div className="form-group">
                  <label>Código SKU *</label>
                  <input type="text" name="sku" value={formulario.sku} onChange={handleInputChange} required placeholder="Ej: APP-IPH15-128" />
                </div>

                <div className="form-group">
                  <label>Precio ($) *</label>
                  <input type="number" step="0.01" name="precio" value={formulario.precio} onChange={handleInputChange} required placeholder="0.00" />
                </div>

                <div className="form-group">
                  <label>Cantidad en Stock *</label>
                  <input type="number" name="stock" value={formulario.stock} onChange={handleInputChange} required placeholder="0" />
                </div>

                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={formulario.descripcion} onChange={handleInputChange} placeholder="Detalles adicionales del dispositivo..." rows="3"></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editandoId ? 'Guardar Cambios' : 'Registrar Dispositivo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
