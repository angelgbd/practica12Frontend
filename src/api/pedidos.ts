import { http } from './http';

interface Sobre<T> {
  data: T;
  meta: unknown;
}

export interface CrearPedido {
  correo: string;
  telefono: string;
  productos: string[];
}

export interface PedidoCreado {
  folio: string;
  total: number;
}

export async function crearPedido(pedido: CrearPedido): Promise<PedidoCreado> {
  const respuesta = await http.post<Sobre<PedidoCreado>>('/pedidos', pedido);
  return respuesta.data.data;
}
