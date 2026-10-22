

 Preguntas y pestaña Red

En desarrollo, src/main.tsx envuelve la aplicación con StrictMode. React ejecuta los efectos dos veces al montar para ayudar a encontrar efectos secundarios; por eso al cargar se ven dos GET a /productos en la pestaña **Red**. En producción ese ciclo de comprobación no se ejecuta.

Para observar qué ocurre sin dependencias:

