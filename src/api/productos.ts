import type { Producto } from '../datos';
import { http } from './http';

interface Sobre<T> {
  data: T;
  meta: unknown;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await http.get<Sobre<Producto[]>>('/productos');
  return respuesta.data.data;
}
