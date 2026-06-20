import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - Reemplaza con tus credenciales reales en .env.local o aquí
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qrqmakfzzcnrrgiaxlkc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_5naDb0DNwiH55nzyVcpP2A_65ly7Mh_";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Estados de la Tienda / Cliente
  const [vista, setVista] = useState('tienda'); // 'tienda' o 'admin'
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    metodoPago: 'Transferencia Bancaria'
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [subTabAdmin, setSubTabAdmin] = useState('inventario'); // 'inventario' o 'pedidos'
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  // Estado para las Notificaciones (Toast)
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: '' });

  // Estado para Formularios de Admin (Agregar / Editar)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null); 
  const [formulario, setFormulario] = useState({
    nombre: '', marca: 'Apple', color: '', almacenamiento: '', sku: '', precio: '', stock: '', descripcion: ''
  });

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('celulares').select('*').order('id', { ascending: false });
      if (error) {
        console.log('Error conectando a Supabase, cargando datos locales:', error.message);
        setProductos(PRODUCTOS_EJEMPLO);
      } else if (data && data.length > 0) {
        setProductos(data);
      } else {
        setProductos(PRODUCTOS_EJEMPLO);
      }
    } catch (err) {
      console.log('Fallo de conexión, cargando datos locales:', err);
      setProductos(PRODUCTOS_EJEMPLO);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const { data, error } = await supabase.from('pedidos').select('*').order('id', { ascending: false });
      if (!error && data) {
        setPedidos(data);
      }
    } catch (err) {
      console.log('Error al cargar pedidos de Supabase:', err);
    } finally {
      setLoadingPedidos(false);
    }
  };

  // Cargar productos y pedidos al iniciar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductos();
    fetchPedidos();
  }, []);

  // Helper de notificación
  const lanzarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mostrar: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' }), 4000);
  };

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (prod) => {
    if (prod.stock <= 0) {
      lanzarNotificacion('Este producto está agotado', 'error');
      return;
    }

    const itemExistente = cart.find(item => item.producto.id === prod.id);
    if (itemExistente) {
      if (itemExistente.cantidad >= prod.stock) {
        lanzarNotificacion(`No puedes agregar más. Solo quedan ${prod.stock} unidades en stock`, 'error');
        return;
      }
      setCart(cart.map(item => 
        item.producto.id === prod.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { producto: prod, cantidad: 1 }]);
    }
    lanzarNotificacion('¡Producto añadido al carrito!', 'exito');
  };

  const removeFromCart = (prodId) => {
    setCart(cart.filter(item => item.producto.id !== prodId));
    lanzarNotificacion('Producto eliminado del carrito', 'exito');
  };

  const updateCartQuantity = (prodId, delta) => {
    const item = cart.find(item => item.producto.id === prodId);
    if (!item) return;

    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad <= 0) {
      removeFromCart(prodId);
      return;
    }

    if (delta > 0 && nuevaCantidad > item.producto.stock) {
      lanzarNotificacion(`Límite de stock alcanzado (${item.producto.stock} disponibles)`, 'error');
      return;
    }

    setCart(cart.map(item => 
      item.producto.id === prodId 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  // --- LÓGICA DE CHECKOUT ---
  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm({ ...checkoutForm, [name]: value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutForm.nombre.trim() || !checkoutForm.telefono.trim() || !checkoutForm.direccion.trim()) {
      lanzarNotificacion('Por favor complete todos los datos requeridos', 'error');
      return;
    }

    lanzarNotificacion('Procesando pedido...', 'exito');

    // Intentar descontar stock en Supabase
    for (const item of cart) {
      const nuevoStock = Math.max(0, item.producto.stock - item.cantidad);
      try {
        await supabase
          .from('celulares')
          .update({ stock: nuevoStock })
          .eq('id', item.producto.id);
      } catch (err) {
        console.warn(`Error al actualizar stock para id ${item.producto.id}:`, err);
      }
    }

    // Actualizar stock localmente
    setProductos(prevProductos => 
      prevProductos.map(prod => {
        const itemEnCarrito = cart.find(item => item.producto.id === prod.id);
        if (itemEnCarrito) {
          return { ...prod, stock: Math.max(0, prod.stock - itemEnCarrito.cantidad) };
        }
        return prod;
      })
    );

    // Generar código de verificación
    // eslint-disable-next-line react-hooks/purity
    const codigoGenerado = 'MVZ-' + Math.floor(100000 + Math.random() * 900000);

    // Intentar registrar el pedido en la base de datos de Supabase
    try {
      const { error } = await supabase
        .from('pedidos')
        .insert([{
          codigo_verificacion: codigoGenerado,
          cliente_nombre: checkoutForm.nombre,
          cliente_telefono: checkoutForm.telefono,
          cliente_direccion: checkoutForm.direccion,
          metodo_pago: checkoutForm.metodoPago,
          total: cartTotal,
          detalle_productos: cart.map(item => ({
            id: item.producto.id,
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            precio: item.producto.precio,
            color: item.producto.color,
            almacenamiento: item.producto.almacenamiento,
            sku: item.producto.sku
          }))
        }]);
      
      if (error) {
        console.warn("Error registrando pedido:", error.message);
      }
    } catch (err) {
      console.warn("Fallo de red al registrar pedido, guardando localmente:", err);
      // Fallback local
      const nuevoPedidoLocal = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now(),
        codigo_verificacion: codigoGenerado,
        cliente_nombre: checkoutForm.nombre,
        cliente_telefono: checkoutForm.telefono,
        cliente_direccion: checkoutForm.direccion,
        metodo_pago: checkoutForm.metodoPago,
        total: cartTotal,
        detalle_productos: cart.map(item => ({
          id: item.producto.id,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.producto.precio,
          color: item.producto.color,
          almacenamiento: item.producto.almacenamiento,
          sku: item.producto.sku
        })),
        created_at: new Date().toISOString()
      };
      setPedidos(prev => [nuevoPedidoLocal, ...prev]);
    }

    setCodigoVerificacion(codigoGenerado);
    setCheckoutSuccess(true);
    setCart([]);
  };

  const cerrarCheckoutSuccess = () => {
    setCheckoutSuccess(false);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCodigoVerificacion('');
    setCheckoutForm({ nombre: '', telefono: '', direccion: '', metodoPago: 'Transferencia Bancaria' });
    fetchProductos(); // Sincronizar stock
    fetchPedidos();   // Sincronizar pedidos
  };

  // --- LÓGICA DE ADMIN CRUD ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const abrirModalCrear = () => {
    setEditandoId(null);
    setFormulario({ nombre: '', marca: 'Apple', color: '', almacenamiento: '', sku: '', precio: '', stock: '', descripcion: '' });
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod) => {
    setEditandoId(prod.id);
    setFormulario({
      nombre: prod.nombre, marca: prod.marca, color: prod.color,
      almacenamiento: prod.almacenamiento, sku: prod.sku, precio: prod.precio, stock: prod.stock, descripcion: prod.descripcion || ''
    });
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      try {
        const { error } = await supabase.from('celulares').update(payload).eq('id', editandoId);
        if (error) {
          lanzarNotificacion(`Error: ${error.message}`, 'error');
        } else {
          lanzarNotificacion('¡Producto actualizado correctamente!', 'exito');
          setModalAbierto(false);
          fetchProductos();
        }
      } catch (err) {
        console.log('Error de base de datos en edición local:', err);
        setProductos(productos.map(p => p.id === editandoId ? { ...payload, id: editandoId } : p));
        lanzarNotificacion('¡Producto actualizado localmente!', 'exito');
        setModalAbierto(false);
      }
    } else {
      try {
        const { error } = await supabase.from('celulares').insert([payload]);
        if (error) {
          lanzarNotificacion('Error: El SKU ya existe o faltan campos obligatorios', 'error');
        } else {
          lanzarNotificacion('¡Producto añadido al inventario!', 'exito');
          setModalAbierto(false);
          fetchProductos();
        }
      } catch (err) {
        console.log('Error de base de datos en creación local:', err);
        const nuevoProd = { ...payload, id: Date.now() };
        setProductos([nuevoProd, ...productos]);
        lanzarNotificacion('¡Producto añadido localmente!', 'exito');
        setModalAbierto(false);
      }
    }
  };

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás completamente seguro de eliminar el dispositivo "${nombre}"?`);
    if (!confirmar) return;

    try {
      const { error } = await supabase.from('celulares').delete().eq('id', id);
      if (error) {
        lanzarNotificacion('No se pudo eliminar el producto', 'error');
      } else {
        lanzarNotificacion('Producto eliminado del inventario', 'exito');
        fetchProductos();
      }
    } catch (err) {
      console.log('Error de base de datos en eliminación local:', err);
      setProductos(productos.filter(p => p.id !== id));
      lanzarNotificacion('Producto eliminado localmente', 'exito');
    }
  };

  const obtenerBadgeStock = (cantidad) => {
    const stockNum = parseInt(cantidad);
    if (stockNum === 0) return <span className="badge agotado">Agotado</span>;
    if (stockNum <= 3) return <span className="badge bajo">Bajo Stock ({stockNum})</span>;
    return <span className="badge disponible">Disponible ({stockNum})</span>;
  };

  const productosFiltrados = productos.filter((prod) => {
    const termino = busqueda.toLowerCase().trim();
    const cumpleBusqueda = (
      (prod.nombre?.toLowerCase() || '').includes(termino) ||
      (prod.marca?.toLowerCase() || '').includes(termino) ||
      (prod.color?.toLowerCase() || '').includes(termino) ||
      (prod.sku?.toLowerCase() || '').includes(termino)
    );
    const cumpleMarca = marcaSeleccionada === 'Todos' || prod.marca === marcaSeleccionada;
    return cumpleBusqueda && cumpleMarca;
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
        <div className="logo-container">
          <span className="logo-icon">📱</span>
          <div>
            <h1>MóvilZone <span className="store-badge">Store</span></h1>
            <p>{vista === 'tienda' ? 'Encuentra los mejores smartphones de última generación' : 'Panel de Gestión y Control de Inventario (Supabase)'}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Conmutador de vista */}
          <div className="view-toggle-container">
            <button 
              className={`view-toggle-btn ${vista === 'tienda' ? 'active' : ''}`}
              onClick={() => setVista('tienda')}
            >
              🛍️ Tienda
            </button>
            <button 
              className={`view-toggle-btn ${vista === 'admin' ? 'active' : ''}`}
              onClick={() => setVista('admin')}
            >
              ⚙️ Admin
            </button>
          </div>

          {/* Botones de acción contextuales */}
          {vista === 'tienda' ? (
            <button className="btn btn-primary cart-icon-nav" onClick={() => setCartOpen(true)}>
              🛒 Carrito
              {cartItemCount > 0 && <span className="cart-count-badge">{cartItemCount}</span>}
            </button>
          ) : (
            subTabAdmin === 'inventario' && (
              <button className="btn btn-primary" onClick={abrirModalCrear}>
                ➕ Agregar Dispositivo
              </button>
            )
          )}
        </div>
      </header>

      {/* ================= VISTA TIENDA (VISTA CLIENTE) ================= */}
      {vista === 'tienda' && (
        <>
          {/* Hero Banner */}
          <section className="hero-banner">
            <div className="hero-content">
              <h2>Tu Próximo Smartphone Está Aquí</h2>
              <p>Compra en línea de forma segura y coordina la entrega al instante. Envíos gratis a todo el país y las mejores formas de pago. ¡Elige y escríbenos!</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-icon">⚡</span>
                  <span>Entrega rápida</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🛡️</span>
                  <span>Garantía de fábrica</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">💬</span>
                  <span>Soporte vía WhatsApp</span>
                </div>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <img src="/phone_placeholder.png" alt="Premium Smartphone" className="hero-image" />
            </div>
          </section>

          {/* Filtros y Búsqueda */}
          <section className="search-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Buscar smartphone por modelo, color o especificaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            
            <div className="brand-filters">
              {['Todos', 'Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Huawei', 'Realme'].map((marca) => (
                <button
                  key={marca}
                  className={`filter-btn ${marcaSeleccionada === marca ? 'active' : ''}`}
                  onClick={() => setMarcaSeleccionada(marca)}
                >
                  {marca}
                </button>
              ))}
            </div>
          </section>

          {/* Catálogo de Productos */}
          <main>
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando catálogo de celulares...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="no-data">
                No encontramos celulares con los criterios de búsqueda actuales.
              </div>
            ) : (
              <div className="products-grid">
                {productosFiltrados.map((prod) => (
                  <div key={prod.id} className="product-card">
                    <div className="product-image-wrapper">
                      <div className="product-badge-float">
                        <span className="brand-tag">{prod.marca}</span>
                      </div>
                      <img src="/phone_placeholder.png" alt={prod.nombre} className="product-image" />
                    </div>

                    <div className="product-info-wrapper">
                      <div className="product-brand-row">
                        <h3 className="product-title">{prod.nombre}</h3>
                      </div>
                      
                      <div className="product-specs">
                        <span className="spec-badge">{prod.almacenamiento}</span>
                        <span className="spec-badge">{prod.color}</span>
                        <span className="spec-badge">SKU: {prod.sku}</span>
                      </div>

                      <p className="product-desc" title={prod.descripcion}>
                        {prod.descripcion || 'Sin descripción disponible del dispositivo.'}
                      </p>

                      <div style={{ marginTop: '0.25rem' }}>
                        {obtenerBadgeStock(prod.stock)}
                      </div>

                      <div className="product-footer">
                        <div className="product-price">
                          <span className="product-price-label">Precio</span>
                          <span>${parseFloat(prod.precio).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.6rem 1.1rem', borderRadius: '10px' }}
                          onClick={() => addToCart(prod)}
                          disabled={prod.stock <= 0}
                        >
                          {prod.stock <= 0 ? 'Agotado' : '🛒 Agregar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* ================= VISTA ADMIN (VISTA ORIGINAL DE INVENTARIO) ================= */}
      {vista === 'admin' && (
        <>
          {/* Sub-pestañas del panel de administración */}
          <div className="brand-filters" style={{ marginBottom: '1.5rem' }}>
            <button 
              className={`filter-btn ${subTabAdmin === 'inventario' ? 'active' : ''}`}
              onClick={() => setSubTabAdmin('inventario')}
            >
              📦 Inventario de Celulares
            </button>
            <button 
              className={`filter-btn ${subTabAdmin === 'pedidos' ? 'active' : ''}`}
              onClick={() => setSubTabAdmin('pedidos')}
            >
              📋 Lista de Pedidos
            </button>
          </div>

          {subTabAdmin === 'inventario' ? (
            <>
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
            </>
          ) : (
            /* Tabla de Pedidos Realizados */
            <main className="table-container">
              {loadingPedidos ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Cargando lista de pedidos...</p>
                </div>
              ) : pedidos.length === 0 ? (
                <div className="no-data">No se han registrado pedidos en la tienda aún.</div>
              ) : (
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cliente</th>
                      <th>Contacto y Envío</th>
                      <th>Método de Pago</th>
                      <th>Total</th>
                      <th>Fecha</th>
                      <th>Productos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td className="sku-text" style={{ fontSize: '1.05rem', color: '#a5b4fc' }}>
                          <strong>{pedido.codigo_verificacion}</strong>
                        </td>
                        <td><strong>{pedido.cliente_nombre}</strong></td>
                        <td className="specs-text">
                          <div>📞 {pedido.cliente_telefono}</div>
                          <div>📍 {pedido.cliente_direccion}</div>
                        </td>
                        <td>
                          <span className="brand-tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                            {pedido.metodo_pago}
                          </span>
                        </td>
                        <td className="price-text" style={{ color: 'var(--primary-hover)' }}>
                          ${parseFloat(pedido.total).toFixed(2)}
                        </td>
                        <td className="specs-text">
                          {new Date(pedido.created_at).toLocaleString('es-ES')}
                        </td>
                        <td className="specs-text">
                          <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                            {(Array.isArray(pedido.detalle_productos) ? pedido.detalle_productos : []).map((det, index) => (
                              <li key={index}>
                                {det.cantidad}x {det.nombre} ({det.almacenamiento} • {det.color})
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </main>
          )}
        </>
      )}

      {/* ================= MODAL DEL CARRITO (DRAWER LATERAL) ================= */}
      <div className={`cart-drawer-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h3>🛒 Carrito de Compras</h3>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)}>&times;</button>
          </div>

          <div className="cart-drawer-body">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <p>Tu carrito está vacío</p>
                <button className="btn btn-secondary" onClick={() => setCartOpen(false)}>Explorar Tienda</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.producto.id} className="cart-item">
                  <div className="cart-item-img-wrapper">
                    <img src="/phone_placeholder.png" alt={item.producto.nombre} className="cart-item-img" />
                  </div>
                  
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.producto.nombre}</span>
                    <span className="cart-item-meta">{item.producto.almacenamiento} • {item.producto.color}</span>
                    <span className="cart-item-price">${parseFloat(item.producto.precio).toFixed(2)}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.producto.id, -1)}>-</button>
                      <span className="qty-val">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.producto.id, 1)}>+</button>
                    </div>
                    <button className="cart-item-delete" onClick={() => removeFromCart(item.producto.id)}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Total estimado:</span>
                <span className="cart-summary-value">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setCheckoutOpen(true)}>
                Proceder al Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL DE CHECKOUT ================= */}
      {checkoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal-content">
            <div className="modal-header">
              <h2>{checkoutSuccess ? '🎉 ¡Pedido Realizado!' : '🛍️ Finalizar Compra'}</h2>
              {!checkoutSuccess && <button className="close-button" onClick={() => setCheckoutOpen(false)}>&times;</button>}
            </div>

            {checkoutSuccess ? (
              <div className="checkout-success" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div className="checkout-success-icon" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>¡Compra Confirmada!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Tu pedido ha sido registrado con éxito. Guarda el siguiente código de verificación:
                </p>
                
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '2px dashed var(--primary)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  fontSize: '2rem',
                  fontFamily: 'monospace',
                  fontWeight: '800',
                  color: '#a5b4fc',
                  letterSpacing: '0.15em',
                  margin: '1rem 0',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
                }}>
                  {codigoVerificacion}
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  marginTop: '0.75rem'
                }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '0.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Resumen de Entrega
                  </div>
                  <div><strong>Cliente:</strong> {checkoutForm.nombre}</div>
                  <div><strong>Teléfono:</strong> {checkoutForm.telefono}</div>
                  <div><strong>Dirección:</strong> {checkoutForm.direccion}</div>
                  <div><strong>Método de Pago:</strong> {checkoutForm.metodoPago}</div>
                </div>

                <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={cerrarCheckoutSuccess}>
                  Volver a la Tienda
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="modal-form">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={checkoutForm.nombre} 
                    onChange={handleCheckoutChange} 
                    required 
                    placeholder="Ej: Juan Pérez" 
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono de Contacto *</label>
                  <input 
                    type="tel" 
                    name="telefono" 
                    value={checkoutForm.telefono} 
                    onChange={handleCheckoutChange} 
                    required 
                    placeholder="Ej: +54 9 11 2345-6789" 
                  />
                </div>

                <div className="form-group">
                  <label>Dirección de Envío *</label>
                  <input 
                    type="text" 
                    name="direccion" 
                    value={checkoutForm.direccion} 
                    onChange={handleCheckoutChange} 
                    required 
                    placeholder="Ej: Av. del Libertador 1234, CABA" 
                  />
                </div>

                <div className="form-group">
                  <label>Método de Pago Preferido</label>
                  <select name="metodoPago" value={checkoutForm.metodoPago} onChange={handleCheckoutChange}>
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Pago Móvil / Wallet">Pago Móvil / Wallet</option>
                    <option value="Efectivo contra entrega">Efectivo contra entrega</option>
                  </select>
                </div>

                <div className="modal-actions" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setCheckoutOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    💬 Confirmar por WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL DE FORMULARIO CRUD (CREAR / EDITAR) ================= */}
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
