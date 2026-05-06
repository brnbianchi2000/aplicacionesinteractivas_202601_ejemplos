import { useCallback, useEffect, useState } from 'react'
import { getClientes, crearCliente } from './api'
import { TelefonosCliente } from './TelefonosCliente'

export function ListaClientes({ token }) {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [saving, setSaving] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  const load = useCallback(
    async ({ quiet } = {}) => {
      if (!quiet) setLoading(true)
      setError('')
      try {
        const data = await getClientes(token)
        setClientes(Array.isArray(data) ? data : [])
      } catch {
        setError('No se pudo cargar la lista.')
      } finally {
        if (!quiet) setLoading(false)
      }
    },
    [token],
  )

  useEffect(() => {
    load()
  }, [load])

  async function handleAlta(e) {
    e.preventDefault()
    const n = nombre.trim()
    if (!n) return
    setSaving(true)
    try {
      await crearCliente(token, n)
      setNombre('')
      await load({ quiet: true })
    } catch {
      setError('No se pudo dar de alta el cliente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Cargando clientes…</p>
  if (error && clientes.length === 0) return <p role="alert">{error}</p>

  return (
    <>
      <form onSubmit={handleAlta}>
        <div>
          <label htmlFor="nombre-cliente">Nombre del cliente</label>
          <input
            id="nombre-cliente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={saving}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Dar de alta'}
        </button>
      </form>

      {error ? <p role="alert">{error}</p> : null}

      {clientes.length === 0 ? (
        <p>No hay clientes cargados.</p>
      ) : (
        <ul>
          {clientes.map((c) => (
            <li key={c.id}>
              <strong>{c.nombre}</strong> <span>(id: {c.id})</span>
              <button onClick={() => setClienteSeleccionado(clienteSeleccionado?.id === c.id ? null : c)}>
                {clienteSeleccionado?.id === c.id ? 'Ocultar teléfonos' : 'Ver teléfonos'}
              </button>
              {clienteSeleccionado?.id === c.id && (
                <TelefonosCliente
                  token={token}
                  clienteId={c.id}
                  clienteNombre={c.nombre}
                />
              )}
  
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
