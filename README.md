# practica12Frontend

Frontend de React para la tienda de las Prácticas 12B y 13. Consume la API separada del backend y simula el envío de pedidos.

## Ejecutar

1. Inicia MySQL y la API desde el repositorio `Practica14_TiendaEnLinea_Backend` siguiendo su README. La API debe responder en `http://localhost:3000`.
2. En esta carpeta ejecuta:

   ```bash
   npm install
   npm run dev
   ```

3. Abre la dirección que muestre Vite, normalmente `http://localhost:5173`.

La dirección base de la API está en `src/api/http.ts`, con un límite de 10 segundos. Se puede cambiar con `VITE_API_URL` en un archivo `.env` local; parte de `.env.example`.

## Ejercicio 1: productos

- `src/api/http.ts` crea la única instancia de Axios.
- `src/api/productos.ts` pide `/productos` y devuelve el arreglo `data` del sobre `{ data, meta }`.
- `src/hooks/useProductos.ts` hace la petición en un efecto y expone `cargando`, `error`, `datos` y `reintentar`.
- La pantalla muestra el componente de carga, el error con reintento o el catálogo según el resultado.

### Preguntas y pestaña Red

En desarrollo, `src/main.tsx` envuelve la aplicación con `StrictMode`. React ejecuta los efectos dos veces al montar para ayudar a encontrar efectos secundarios; por eso al cargar se ven dos GET a `/productos` en la pestaña **Red**. En producción ese ciclo de comprobación no se ejecuta.

Para observar qué ocurre sin dependencias:

1. Abre las herramientas de desarrollador, ve a **Red**, activa **Conservar registro** y filtra por `productos`.
2. En `src/hooks/useProductos.ts`, quita temporalmente el segundo argumento del efecto (`[intento]`) y guarda.
3. Observa que aparecen GET repetidos: cada respuesta actualiza `datos` y `cargando`, vuelve a renderizar la pantalla y React vuelve a ejecutar el efecto.
4. Restaura `[intento]` y guarda. El efecto vuelve a ejecutarse sólo al montar o al pulsar **Reintentar**.

## Ejercicio 2: pago simulado

El formulario mantiene correo y teléfono en estado controlado, comprueba que el correo incluya `@` y que el teléfono tenga diez dígitos antes de enviar. El pedido manda el correo, el teléfono y una lista de ids del carrito a `POST /pedidos`. Si la API responde con un error (por ejemplo, `409` por falta de existencia), su mensaje aparece en el formulario. Si acepta el pedido, se muestra el folio, se vacía el carrito y se vuelve a consultar `/productos` para actualizar la existencia.

`event.preventDefault()` evita que el navegador envíe el formulario con una navegación y recarga de página. Si se quita, el navegador recarga la página al enviar; se pierde el estado de React y la petición asíncrona puede interrumpirse.

## Componentes de Práctica 12B

`Catalogo`, `TarjetaProducto`, `Filtros`, `Encabezado`, `PiePagina`, `Layout` y `datos.ts` se conservan desde la base de la Práctica 12B. La composición en `App.tsx` conecta esos componentes con la API y el flujo de pago.
