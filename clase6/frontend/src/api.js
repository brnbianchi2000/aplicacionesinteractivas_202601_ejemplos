const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Login falló')
  const data = await res.json()
  return data.token
}

export async function getClientes(token) {
  const res = await fetch(`${API_BASE}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('No se pudieron obtener los clientes')
  return res.json()
}

export async function crearCliente(token, nombre) {
  const res = await fetch(`${API_BASE}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  })
  if (!res.ok) throw new Error('No se pudo crear el cliente')
  return res.text()
}

export async function getTelefonos(token, clienteId) {
  const res = await fetch(`${API_BASE}/clientes/${clienteId}/telefonos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('No se pudieron obtener los teléfonos')
  return res.json()
}

export async function agregarTelefono(token, clienteId, { numero, descripcion }) {
  const res = await fetch(`${API_BASE}/clientes/${clienteId}/telefonos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ numero, descripcion }),
  })
  if (!res.ok) throw new Error('No se pudo agregar el teléfono')
  return res.json()
}

