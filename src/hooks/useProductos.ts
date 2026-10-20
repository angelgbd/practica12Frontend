import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '../api/errores';
import { obtenerProductos } from '../api/productos';
import type { Producto } from '../datos';

export function useProductos() {
  const [datos, setDatos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntento((anterior) => anterior + 1);
  }, []);

  useEffect(() => {
    let vigente = true;

    void obtenerProductos()
      .then((productos) => {
        if (vigente) setDatos(productos);
      })
      .catch((causa: unknown) => {
        if (vigente) setError(mensajeDeError(causa));
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [intento]);

  return { cargando, error, datos, reintentar };
}
