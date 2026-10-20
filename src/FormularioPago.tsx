import { useState, type FormEvent } from 'react';

interface FormularioPagoProps {
  deshabilitado: boolean;
  mensajeError: string | null;
  onPagar: (correo: string, telefono: string) => Promise<void>;
}

export function FormularioPago({ deshabilitado, mensajeError, onPagar }: FormularioPagoProps) {
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!correo.trim().includes('@')) {
      setErrorValidacion('Escribe un correo que incluya @.');
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      setErrorValidacion('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    setErrorValidacion(null);
    setEnviando(true);
    try {
      await onPagar(correo.trim(), telefono);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="pago" onSubmit={manejarEnvio} noValidate>
      <h2>Pago simulado</h2>

      <label htmlFor="correo">Correo electrónico</label>
      <input
        id="correo"
        name="correo"
        type="email"
        autoComplete="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        placeholder="tu@correo.com"
      />

      <label htmlFor="telefono">Teléfono (10 dígitos)</label>
      <input
        id="telefono"
        name="telefono"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        value={telefono}
        onChange={(evento) => setTelefono(evento.target.value)}
        placeholder="6621234567"
      />

      {errorValidacion && <p className="pago__error" role="alert">{errorValidacion}</p>}
      {mensajeError && <p className="pago__error" role="alert">{mensajeError}</p>}

      <button type="submit" disabled={deshabilitado || enviando}>
        {enviando ? 'Procesando…' : 'Pagar pedido'}
      </button>
    </form>
  );
}
