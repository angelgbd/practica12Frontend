import type { Producto } from './datos';
import { TarjetaProducto } from './TarjetaProducto';

interface CatalogoProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export function Catalogo({ productos, onAgregar }: CatalogoProps) {
  return (
    <section className="catalogo">
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} onAgregar={onAgregar} />
      ))}
    </section>
  );
}
