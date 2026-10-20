import { pesos } from './datos';
import type { Producto } from './datos';

interface TarjetaProductoProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export function TarjetaProducto({ producto, onAgregar }: TarjetaProductoProps) {
  const agotado = producto.existencia <= 0;

  return (
    <article className="tarjeta">
      <img className="tarjeta__imagen" src={producto.imagen} alt={producto.nombre} />
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__nombre">{producto.nombre}</h3>
        <p className="tarjeta__precio">{pesos.format(producto.precio)}</p>
        <p className={`tarjeta__existencia${agotado ? ' tarjeta__existencia--agotado' : ''}`}>
          {agotado ? 'Agotado' : `${producto.existencia} disponibles`}
        </p>
        <button className="tarjeta__boton" disabled={agotado} onClick={() => onAgregar(producto)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
