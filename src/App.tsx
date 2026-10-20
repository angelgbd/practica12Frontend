import { useMemo, useState } from 'react';
import { mensajeDeError } from './api/errores';
import { crearPedido } from './api/pedidos';
import { Cargando } from './Cargando';
import { Catalogo } from './Catalogo';
import { Encabezado } from './Encabezado';
import { Filtros } from './Filtros';
import { FormularioPago } from './FormularioPago';
import { Layout } from './Layout';
import { MensajeError } from './MensajeError';
import { PiePagina } from './PiePagina';
import { pesos, type Producto } from './datos';
import { useProductos } from './hooks/useProductos';
import './Tienda.css';

function App() {
  const { cargando, error, datos, reintentar } = useProductos();
  const [categoria, setCategoria] = useState('Todos');
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  const [folio, setFolio] = useState<string | null>(null);

  const cantidades = useMemo(() => {
    const porId = new Map<string, number>();
    for (const producto of carrito) {
      porId.set(producto.id, (porId.get(producto.id) ?? 0) + 1);
    }
    return porId;
  }, [carrito]);

  const productosDisponibles = useMemo(
    () => datos.map((producto) => ({
      ...producto,
      existencia: Math.max(0, producto.existencia - (cantidades.get(producto.id) ?? 0)),
    })),
    [datos, cantidades],
  );
  const categorias = ['Todos', ...new Set(datos.map((producto) => producto.categoria))];
  const categoriaActiva = categorias.includes(categoria) ? categoria : 'Todos';
  const productosVisibles = categoriaActiva === 'Todos'
    ? productosDisponibles
    : productosDisponibles.filter((producto) => producto.categoria === categoriaActiva);
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);

  function agregarAlCarrito(producto: Producto) {
    if (producto.existencia <= 0) return;
    setCarrito((actual) => [...actual, producto]);
    setErrorPago(null);
    setFolio(null);
  }

  async function pagar(correo: string, telefono: string) {
    setErrorPago(null);
    setFolio(null);

    try {
      const pedido = await crearPedido({
        correo,
        telefono,
        productos: carrito.map((producto) => producto.id),
      });
      setFolio(pedido.folio);
      setCarrito([]);
      await reintentar();
    } catch (causa) {
      setErrorPago(mensajeDeError(causa));
    }
  }

  const lineasCarrito = Array.from(cantidades, ([id, cantidad]) => ({
    producto: carrito.find((item) => item.id === id)!,
    cantidad,
  }));

  return (
    <Layout
      encabezado={<Encabezado piezas={carrito.length} />}
      pie={<PiePagina piezas={carrito.length} total={total} />}
    >
      <section className="portada">
        <p className="portada__eyebrow">Tienda en línea</p>
        <h1>Catálogo de temporada</h1>
        <p>Productos disponibles consultados directamente desde la API.</p>
      </section>

      {cargando ? (
        <Cargando />
      ) : error ? (
        <MensajeError mensaje={error} onReintentar={() => void reintentar()} />
      ) : (
        <>
          <Filtros categorias={categorias} activa={categoriaActiva} onCambiar={setCategoria} />
          {productosVisibles.length === 0 ? (
            <p className="catalogo-vacio">La API no devolvió productos para mostrar.</p>
          ) : (
            <Catalogo productos={productosVisibles} onAgregar={agregarAlCarrito} />
          )}

          <section className="carrito" aria-labelledby="carrito-titulo">
            <div className="carrito__encabezado">
              <div>
                <p className="portada__eyebrow">Tu selección</p>
                <h2 id="carrito-titulo">Carrito</h2>
              </div>
              <strong>{pesos.format(total)}</strong>
            </div>

            {lineasCarrito.length === 0 ? (
              <p className="carrito__vacio">Agrega productos del catálogo para continuar.</p>
            ) : (
              <ul className="carrito__lista">
                {lineasCarrito.map(({ producto, cantidad }) => (
                  <li key={producto.id}>
                    <span>{producto.nombre} <small>× {cantidad}</small></span>
                    <span>{pesos.format(producto.precio * cantidad)}</span>
                  </li>
                ))}
              </ul>
            )}

            <FormularioPago
              deshabilitado={carrito.length === 0}
              mensajeError={errorPago}
              onPagar={pagar}
            />
          </section>
        </>
      )}

      {folio && (
        <p className="confirmacion" role="status" aria-live="polite">
          Pedido registrado correctamente. Tu folio es <strong>{folio}</strong>.
        </p>
      )}
    </Layout>
  );
}

export default App;
