interface ErrorDeApi {
  message?: string | string[];
}

interface ErrorConRespuesta {
  message?: string;
  response?: { data?: ErrorDeApi };
}

export function mensajeDeError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const errorConRespuesta = error as ErrorConRespuesta;
    const mensaje = errorConRespuesta.response?.data?.message;

    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
    if (typeof errorConRespuesta.message === 'string') return errorConRespuesta.message;
  }

  return 'No se pudo completar la solicitud. Intenta de nuevo.';
}
