import { Layout } from './Layout';
import { Encabezado } from './Encabezado';
import { PiePagina } from './PiePagina';
import { Catalogo } from './Catalogo';
import { productos } from './datos';
import { useState } from 'react';

const categorias = ['Todos', ...new Set(productos.map((p) => p.categoria))];
function App() {

  const [categoria, setCategoria] = useState('Todos');
  return (
    <Layout encabezado={<Encabezado piezas={0}/>} pie={<PiePagina piezas={0} total={0} />}>
        <section className="portada">
          <h1>Catalogo de Temporada</h1>
        </section>
        <Catalogo productos={productos} onAgregar={(p) => console.log('agregar', p.nombre)} />
    </Layout>
  )
}

export default App;
