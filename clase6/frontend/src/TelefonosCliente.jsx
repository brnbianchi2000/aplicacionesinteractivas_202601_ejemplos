import { useCallback, useEffect, useState } from 'react'
import { agregarTelefono, getTelefonos } from './api'

export function TelefonosCliente({ token, clienteId, clienteNombre }) {
  const [telefonos, setTelefonos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [numero, setNumero] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(
    async ({ quiet } = {}) => {
      if (!quiet) setLoading(true)
      setError('')
      try {
        const data = await getTelefonos(token, clienteId)
        setTelefonos(Array.isArray(data) ? data : [])
      } catch {
        setError('No se pudieron cargar los teléfonos.')
      } finally {
        if (!quiet) setLoading(false)
      }
    },
    [token, clienteId],
  )

  useEffect(() => {
    load()
  }, [load])

  async function handleAlta(e) {
    e.preventDefault()
    const n = numero.trim()
    if (!n) return
    setSaving(true)
    try {
      await agregarTelefono(token, clienteId, {
        numero: n,
        descripcion: descripcion.trim(),
      })
      await load({ quiet: true })
      setNumero('')
      setDescripcion('')
    } catch {
      setError('No se pudo agregar el teléfono.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Cargando teléfonos…</p>
  if (error && telefonos.length === 0) return <p role="alert">{error}</p>

  const titulo = clienteNombre
    ? `Teléfonos — ${clienteNombre}`
    : `Teléfonos (cliente id: ${clienteId})`

  return (
    <section>
      <h3>{titulo}</h3>

      <form onSubmit={handleAlta}>
        <div>
          <label htmlFor="tel-numero">Número</label>
          <input
            id="tel-numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            disabled={saving}
          />
        </div>
        <div>
          <label htmlFor="tel-desc">Descripción</label>
          <input
            id="tel-desc"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={saving}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Agregar teléfono'}
        </button>
      </form>

      {error ? <p role="alert">{error}</p> : null}

      {telefonos.length === 0 ? (
        <p>No hay teléfonos cargados para este cliente.</p>
      ) : (
        <ul>
          {telefonos.map((t) => (
            <li key={t.id}>
              <strong>{t.numero}</strong>
              {t.descripcion ? <span> — {t.descripcion}</span> : null}{' '}
              <span>(id: {t.id})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
