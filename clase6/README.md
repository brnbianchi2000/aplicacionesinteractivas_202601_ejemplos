# Guía: frontend con Vite conectado al backend

Esta guía explica **paso a paso** cómo construir el sistema de frontend con **Vite** para que consuma la API del proyecto que está en la carpeta **`../backend`** (Spring Boot).

## Qué vas a lograr

- Un proyecto frontend moderno con Vite (recomendado: React con JavaScript).
- Llamadas HTTP al backend sin problemas de **CORS** en desarrollo (mediante **proxy** de Vite).
- **Login** con JWT y uso de rutas protegidas (`/clientes`, teléfonos, etc.).

---

## Requisitos previos

1. **Node.js** instalado (versión LTS recomendada) y **npm**.
2. El **backend** debe poder ejecutarse y escuchar en **`http://localhost:8080`** (puerto por defecto de Spring Boot en este proyecto).

---

## Paso 1: Levantar el backend

1. Abrí una terminal.
2. Entrá a la carpeta del backend:

   ```bash
   cd ../backend
   ```

3. Iniciá la aplicación (Windows):

   ```bash
   .\mvnw.cmd spring-boot:run
   ```

   O ejecutala desde tu IDE (Run en `Clase2Application`).

4. Comprobá que responde (navegador o terminal):

   - `http://localhost:8080/ping` → debería devolver el texto **`pong`**.

Dejá esta terminal corriendo mientras desarrollás el frontend.

---

## Paso 2: Crear el proyecto Vite dentro de `frontend`

1. Abrí **otra** terminal, crear la carpeta frontend
2. Posicionate en esta carpeta (`frontend`):

   ```bash
   cd frontend
   ```

3. Si la carpeta está **vacía**, creá el proyecto con Vite. Ejemplo con **React** (JavaScript):

   ```bash
   npm create vite@latest . -- --template react
   ```

   Si ya tenés archivos y no querés mezclar, podés crear en un subdirectorio temporal y mover archivos; lo habitual para esta estructura del repo es generar **directamente en `.`** como arriba.

4. Instalá dependencias:

   ```bash
   npm install
   ```

5. Probá el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Vite suele mostrar una URL tipo **`http://localhost:5173`**.

---

## Paso 3: Entender la API del backend

Base del servidor: **`http://localhost:8080`**.

### Rutas públicas (sin token)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ping` | Comprueba que el servidor está vivo. Respuesta: texto `pong`. |
| POST | `/auth/login` | Recibe credenciales y devuelve un JWT. |

**Body del login (JSON):**

```json
{
  "username": "admin",
  "password": "1234"
}
```

Usuario de prueba definido en el backend: **`admin`** / **`1234`**.

**Respuesta del login (JSON):**

```json
{
  "token": "eyJhbGciOi..."
}
```

### Rutas protegidas (con JWT)

En cada petición hay que enviar el header:

```http
Authorization: Bearer <el_token_que_devolvió_el_login>
```

| Método | Ruta | Body (JSON) | Respuesta (este backend) |
|--------|------|-------------|--------------------------|
| GET | `/clientes` | — | JSON: array de clientes |
| POST | `/clientes` | `{ "nombre": "Nombre del cliente" }` | **Texto plano**, no JSON (ver nota abajo) |
| GET | `/clientes/{id}/telefonos` | — | JSON |
| POST | `/clientes/{id}/telefonos` | `{ "numero": "...", "descripcion": "..." }` | Según el controlador |

Reemplazá `{id}` por el id numérico del cliente.

**Nota sobre `POST /clientes`:** en el backend de este repo, el controlador devuelve un **`String`** (por ejemplo `"Cliente agregado: " + cliente.toString()`), no un objeto JSON con el cliente creado. Spring envía eso como **cuerpo de texto**; en el front conviene leerlo con **`res.text()`**, no con **`res.json()`** (si usás `json()` sobre texto plano, falla el parseo).

---

## Paso 4: Evitar CORS en desarrollo (proxy en Vite)

El navegador en `http://localhost:5173` y el API en `http://localhost:8080` son **orígenes distintos**. Sin configuración CORS en el backend, las peticiones directas desde el front suelen fallar.

**Solución práctica en desarrollo:** el navegador llama solo a Vite (mismo origen) y Vite **reenvía** al backend.

1. Abrí **`vite.config.js`** (en proyectos React con Vite suele ser este nombre).
2. Agregá un `server.proxy` similar a esto:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // El front usa URLs que empiezan con /api/...
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

Con esto:

- `fetch('/api/ping')` → el backend recibe **`GET /ping`**
- `fetch('/api/auth/login', { method: 'POST', ... })` → **`POST /auth/login`**

Reiniciá `npm run dev` si ya estaba corriendo después de cambiar la config.

---

## Paso 5: Variable de entorno para la base del API (opcional)

1. Creá **`.env.development`** en la raíz del proyecto Vite (junto a `package.json`):

```env
VITE_API_BASE=/api
```

2. En tu código:

```js
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
```

Así podés cambiar la base en otro entorno (por ejemplo producción) sin tocar la lógica.

---

## Paso 6: Implementar el cliente HTTP (ejemplo mínimo)

Podés crear un archivo, por ejemplo `src/api.js`, con funciones reutilizables.

Ideas clave:

1. **`login`**: `POST` a `${API_BASE}/auth/login` con `Content-Type: application/json` y body `{ username, password }`. Guardá el `token` en memoria, `sessionStorage` o `localStorage` (lo que indique la consigna de seguridad).
2. **Peticiones autenticadas**: agregá el header `Authorization: Bearer ${token}`.
3. **Errores**: si `res.ok` es falso, leé el cuerpo (`text()` o `json()`) para mostrar mensajes útiles.

Ejemplo esquemático de login:

```js
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
```

Ejemplo de GET con token (asumiendo que guardaste el token en una variable o en storage):

```js
export async function getClientes(token) {
  const res = await fetch(`${API_BASE}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('No se pudieron obtener los clientes')
  return res.json()
}
```

---

## Paso 7: Construir la interfaz (flujo sugerido)

### 7.1 Pantalla de login

1. Creá una vista (componente o página) con dos campos controlados: **usuario** y **contraseña**, y un botón **Ingresar** (o equivalente).
2. En el **submit** del formulario (evitá recargar la página con `preventDefault` si usás un `<form>`), llamá a tu función `login(username, password)` del cliente HTTP (`src/api.js`).
3. Si la promesa resuelve con el **token**, guardalo donde corresponda según la consigna del trabajo: **`sessionStorage`** (se pierde al cerrar la pestaña) o **`localStorage`** (persiste). También podés mantenerlo solo en estado de React hasta que refresque la página.
4. Tras un login exitoso, navegá a la pantalla principal (lista de clientes o dashboard): con **React Router** sería algo como `navigate('/clientes')`; sin router, cambiá el estado que decide qué vista mostrar.
5. Si `login` lanza error o la respuesta no es OK, mostrá un mensaje claro al usuario (“Credenciales inválidas” o el texto que devuelva el servidor si lo leés del body).
6. Opcional pero recomendable: deshabilitá el botón o mostrá “Cargando…” mientras la petición está en curso para evitar dobles envíos.

**Ejemplo para copiar y pegar** (guardá como `src/LoginForm.jsx` o integralo en `App.jsx`; el import `./api` asume que `api.js` está en `src` como en el Paso 6):

```jsx
import { useState } from 'react'
import { login } from './api'

const TOKEN_KEY = 'token'

export function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(username, password)
      sessionStorage.setItem(TOKEN_KEY, token)
      onLoggedIn?.(token)
      // Si usás React Router: import { useNavigate } from 'react-router-dom' y acá navigate('/clientes')
    } catch {
      setError('Credenciales inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
```

Uso mínimo desde `App.jsx`: importá `LoginForm` y pasá `onLoggedIn` para cambiar un estado booleano o la ruta y mostrar el resto de la app cuando ya exista token.

```jsx
import { useState } from 'react'
import { LoginForm } from './LoginForm'
// import { ListaClientes } from './ListaClientes'

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))

  if (!token) {
    return <LoginForm onLoggedIn={setToken} />
  }

  {/* return <ListaClientes token={token} /> */}
  return <p>Terminar lista de clientes</p>
}
export default App
```

### 7.2 Lista de clientes

Montá una vista que, al cargarse (por ejemplo con `useEffect`), llame a `getClientes(token)` u otra función que haga **`GET`** con `Authorization: Bearer …`. Mostrá la lista en pantalla y tratá el caso lista vacía o error de red.

El backend devuelve un **array JSON** de clientes con al menos **`id`** y **`nombre`** (cada ítem puede incluir más campos, por ejemplo teléfonos, según la serialización de Spring).

**Ejemplo para copiar y pegar** (`src/ListaClientes.jsx`; reutiliza `getClientes` del Paso 6):

```jsx
import { useEffect, useState } from 'react'
import { getClientes } from './api'

export function ListaClientes({ token }) {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getClientes(token)
        if (!cancelled) setClientes(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError('No se pudo cargar la lista.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  if (loading) return <p>Cargando clientes…</p>
  if (error) return <p role="alert">{error}</p>
  if (clientes.length === 0) return <p>No hay clientes cargados.</p>

  return (
    <ul>
      {clientes.map((c) => (
        <li key={c.id}>
          <strong>{c.nombre}</strong> <span>(id: {c.id})</span>
        </li>
      ))}
    </ul>
  )
}
```

El ejemplo de `App.jsx` del Paso 7.1 (arriba) ya importa `ListaClientes` y le pasa `token={token}`.

### 7.3 Alta de cliente

En **`POST /clientes`** el body es `{ "nombre": "..." }` y hay que enviar **`Authorization: Bearer …`** como en el GET.

**Respuesta del servidor en este proyecto:** el `ClienteController` no devuelve JSON en el alta: arma un **mensaje en texto** (tipo `Cliente agregado: …`). Por eso, en `fetch`, tras comprobar `res.ok`, usá **`await res.text()`** para leer el cuerpo. Si el backend en algún momento pasara a devolver JSON con el cliente, ahí tendría sentido `res.json()`.

Podés **copiar y pegar** lo siguiente: primero agregá `crearCliente` en `api.js`, después reemplazá el contenido de `ListaClientes.jsx` por el ejemplo completo (incluye formulario arriba, refresco de lista tras el alta y alta del primer cliente con lista vacía). El componente **no depende** del texto devuelto: vuelve a cargar la lista con `GET /clientes`.

#### `src/api.js` — agregar debajo de `getClientes`

```js
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
```

#### `src/ListaClientes.jsx` — ejemplo completo para copiar y pegar

```jsx
import { useCallback, useEffect, useState } from 'react'
import { getClientes, crearCliente } from './api'

export function ListaClientes({ token }) {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [saving, setSaving] = useState(false)

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
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
```

**Notas rápidas:** `load({ quiet: true })` evita mostrar la pantalla de “Cargando…” al refrescar después del alta; si el POST falla, el mensaje de error aparece debajo del formulario cuando ya hay clientes cargados. El valor devuelto por `crearCliente` es el **string** del backend (por ejemplo `Cliente agregado: …`); si querés mostrarlo en pantalla, guardalo en un estado y renderizalo; si no, ignorá el resultado como en este ejemplo.

### 7.4 Teléfonos de un cliente

El backend expone **`GET /clientes/{id}/telefonos`** (lista JSON de objetos con **`id`**, **`numero`**, **`descripcion`**) y **`POST`** al mismo path con body **`{ "numero": "...", "descripcion": "..." }`**; el **POST** devuelve JSON con el teléfono creado. En desarrollo seguí usando la base **`/api`** (proxy de Vite).

Recordá que el token expira según lo configurado en el backend; si recibís **401**, volvé a pedir login.

Podés **copiar y pegar** primero las funciones en `api.js`, después el componente en un archivo nuevo (por ejemplo `src/TelefonosCliente.jsx`). Para ver teléfonos de un cliente, desde la lista de clientes guardá en estado el **`id`** del cliente elegido y renderizá `<TelefonosCliente … />` debajo o en otra vista.

#### `src/api.js` — agregar junto a las demás funciones

```js
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
```

#### `src/TelefonosCliente.jsx` — ejemplo completo para copiar y pegar

```jsx
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
      setNumero('')
      setDescripcion('')
      await load({ quiet: true })
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
```

#### Integración mínima con la lista de clientes

En `ListaClientes`, podés sumar un estado `clienteSeleccionado` (`null` o el objeto cliente) y un botón por fila que haga `setClienteSeleccionado(c)`. Debajo de la lista:

Importá `TelefonosCliente` desde `./TelefonosCliente`.

```jsx

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
.... codigo, y en cada registro de cliente:
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
```

**Ejemplo para copiar y pegar** (`src/ListaClientes.jsx`):

```jsx

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


```

---

## Paso 8: Build para producción

```bash
npm run build
```

Los archivos estáticos quedan en **`dist/`**. En producción tenés que definir cómo el navegador llega al API: mismo dominio con reverse proxy, variable `VITE_API_BASE` apuntando al servidor real, o CORS habilitado en el backend. Eso depende del entrega y del deploy.

---

## Resumen de comandos

| Dónde | Comando |
|-------|---------|
| Backend | `cd ../backend` → `.\mvnw.cmd spring-boot:run` |
| Frontend | `cd frontend` → `npm install` → `npm run dev` |

---

## Solución de problemas

- **`ping` no responde:** verificá que el backend esté en marcha y en el puerto 8080.
- **401 en `/clientes`:** falta token, token inválido o expirado; repetí login.
- **404 en rutas con `/api`:** revisá el `rewrite` del proxy y que las URLs en el front coincidan (`/api/...`).
- **CORS si llamás directo a `http://localhost:8080`:** o usá el proxy de Vite, o configurá CORS en Spring (cambio en el backend).

Con estos pasos tenés una guía completa para construir el frontend con Vite conectado al backend de este repositorio.
