# React — Guía de estudio

Podés usar este documento para **seguir la clase en vivo** y para **repasar después** en tu casa. Las secciones útiles son: objetivos por clase, **conceptos técnicos**, **JSX**, prácticas **listas para copiar y pegar**, checklist y **Si algo falla**.

---

## Antes de empezar

### Qué ya deberías saber

- HTML y JavaScript.
- Funciones anónimas y **arrow functions**.
- Métodos de arrays: **`filter`**, **`map`**, **`reduce`**.

### Qué vas a instalar (una sola vez por máquina)

- **Node.js** (incluye `npm`). Si no lo tenés, bajalo desde [nodejs.org](https://nodejs.org).
- Un editor (por ejemplo **Visual Studio Code**).

### Cómo comprobar que Node está OK

Abrí una terminal y ejecutá:

```bash
node -v
npm -v
```

Si ves números de versión, estás listo para la clase.

---

## Glosario mínimo (te va a aparecer en la materia)

| Término | Significado corto |
|--------|-------------------|
| **React** | Librería para armar interfaces web con **componentes reutilizables**. |
| **JSX** | Sintaxis que parece HTML pero vive dentro de JavaScript. |
| **Componente** | Una **función** (o clase) que devuelve lo que se muestra en pantalla. |
| **Props** | Datos que el **padre** le pasa al hijo (como parámetros). |
| **Estado** | Datos que **cambian** y hacen que la pantalla se vuelva a dibujar. |
| **Vite** | Herramienta para crear y levantar el proyecto React **rápido** en desarrollo. |
| **SPA** | “Single Page Application”: la app cambia de pantalla **sin recargar** toda la página (en la práctica, con **React Router**). |
| **JWT** | Token que devuelve el backend al loguearte; después lo mandás en los pedidos autenticados. |

---

# Conceptos técnicos

## ¿Qué es React?

**React** es una **librería** de JavaScript pensada para construir interfaces de usuario (UI) a partir de **piezas pequeñas y reutilizables** llamadas **componentes**.

- **Enfoque declarativo:** vos describís *qué* querés ver en pantalla según los datos (props y estado), y React se encarga de **actualizar el DOM** cuando esos datos cambian.
- **Re-render:** cuando cambia el **estado** de un componente (con `useState` u otras herramientas), React **vuelve a ejecutar** la función del componente y recalcula la UI.
- **Virtual DOM (idea general):** React compara la nueva salida con la anterior y aplica al DOM del navegador solo los **cambios mínimos** necesarios. No hace falta que domines esto al principio; alcanza con saber que **cambio de estado → nueva pintada**.

No es un framework completo de backend: en el front suele combinarse con **React Router** (rutas), llamadas **HTTP** al backend (`fetch` / axios), y a veces **Redux** (estado global), según el proyecto.

---

## ¿Qué es JSX?

**JSX** (JavaScript XML) es una **extensión de sintaxis**: se escribe algo que parece HTML dentro de archivos `.jsx`, pero **es JavaScript**.

- **Transformación:** Vite (con el plugin de React) convierte el JSX en llamadas equivalentes a `React.createElement(...)` durante el **build** o el **dev server**. Por eso necesitás importar React en el mental model (en versiones modernas con el nuevo JSX runtime a veces no hace falta el `import React` explícito, pero el archivo sigue siendo JSX).
- **Un solo elemento raíz** en cada `return` (o un **fragmento** `<>...</>`).
- **Atributos en camelCase** en muchos casos: `onClick`, `htmlFor`, `tabIndex`.
- **`className`** en lugar de `class` (porque `class` es palabra reservada en JS).
- **Expresiones JavaScript** entre llaves `{ }`: variables, ternarios, llamadas a funciones.

### Crear el proyecto con Vite (si todavía no lo tenés)

En la carpeta donde quieras el proyecto, ejecutá en la terminal:

```bash
npm create vite@latest mi-front -- --template react
cd mi-front
npm install
npm run dev
```

- **Carpeta:** podés cambiar `mi-front` por otro nombre; más abajo la guía usa `mi-front` como ejemplo de estructura.
- **`npm run dev`:** levanta el servidor de desarrollo; Vite suele mostrar una URL tipo `http://localhost:5173`.
- **Plantilla:** `react` genera JavaScript con `.jsx`, como en las prácticas. Si tu equipo usa TypeScript, podés elegir `react-ts` y trabajar con `.tsx`.

**El Navegador Integrado (Simple Browser)**
Es la opción nativa de VS Code. Es ideal para ver documentación o probar una web rápida mientras programas.
Cómo abrirlo: Presiona Ctrl + Shift + P (o Cmd + Shift + P en Mac) para abrir la paleta de comandos.
Busca: Escribe "Simple Browser: Show".


Para **bajar el servicio** (detener Vite, liberar el puerto y que deje de consumir memoria en segundo plano), andá a la **misma terminal** donde está corriendo `npm run dev` y presioná **`Ctrl+C`**. Es el mismo atajo en **Windows** y en **macOS** (en Mac usá la tecla **Control**, no **Cmd**). Si no corta, podés volver a pulsar `Ctrl+C` o cerrar esa terminal.

Si **cerraste la terminal** sin `Ctrl+C`, a veces el proceso sigue usando el puerto (por defecto **5173**). Podés forzar el cierre así:

**Opción rápida (Windows y macOS, con Node instalado):**

```bash
npx kill-port 5173
```

**Windows (CMD o PowerShell):** listá qué PID usa el puerto y matalo (reemplazá `12345` por el número de la última columna):

```text
netstat -ano | findstr :5173
taskkill /PID 12345 /F
```

**macOS (Terminal):**

```bash
lsof -ti tcp:5173 | xargs kill -9
```

*(Si cambiaste el puerto en `vite.config.js`, usá ese número en lugar de `5173`.)*

### Ejemplos de JSX (para copiar y pegar en un componente)

**Hola mundo:**

function App() {
  return (
    <>
    <h1>Hola Mundo</h1>
    </>
  )
}

export default App

**Comentarios en jxs**
{/* Este es un comentario de bloque en JSX */}


**Literal y expresión:**

```jsx
const nombre = "Ana";
return (
  <div>
    <p>Hola</p>
    <p>Hola, {nombre}</p>
    <p>1 + 1 = {1 + 1}</p>
  </div>
);
```

**Ternario (condicional en la vista):**

```jsx
const ok = true;
return <p>{ok ? "Todo bien" : "Hay un error"}</p>;
```

**Lista (siempre con `key` en el elemento más externo del `.map`):**

```jsx
const items = ["a", "b", "c"];
return (
  <ul>
    {items.map((texto, i) => (
      <li key={i}>{texto}</li>
    ))}
  </ul>
);
```

**Fragmento (sin agrupar en un `<div>` extra):**

```jsx
return (
  <>
    <h1>Título</h1>
    <p>Párrafo</p>
  </>
);
```

**Estilo inline (objeto JavaScript):**

```jsx
return <div style={{ padding: 16, backgroundColor: "#f0f0f0" }}>Contenido</div>;
```

---

## Componente, props y estado (resumen)

| Concepto | Explicación técnica breve |
|----------|---------------------------|
| **Componente** | Función que **devuelve JSX** (o `null`). El nombre en mayúscula (`Saludo`) para distinguirlo de etiquetas HTML nativas. |
| **Props** | Objeto de **entrada inmutable** desde el padre: `function Saludo({ nombre }) { ... }`. Si el padre cambia `nombre`, el hijo se re-renderiza con el nuevo valor. |
| **Estado (`useState`)** | Valor **interno** del componente que puede cambiar con una función **`setX`**. Cada cambio dispara un **nuevo render**. |

---

**Estructura esperada (útil para las prácticas):**

```text
mi-front/
  src/
    main.jsx          ← arranque
    App.jsx           ← podés reemplazar su contenido con las prácticas
    components/       ← creá esta carpeta vos
      Saludo.jsx
      ListaPersonas.jsx
      EcoInput.jsx
```

---

## Prácticas guiadas clase (copiar y pegar)

Seguí el orden **A → B → C**. Después podés unificar todo en un solo `App.jsx` como en la **práctica D**.

### Práctica A — Componente `Saludo` con props

**1.** Creá el archivo `src/components/Saludo.jsx`:

```jsx
export default function Saludo({ nombre }) {
  return <p>Hola, {nombre}.</p>;
}
```

**2.** Reemplazá el contenido de `src/App.jsx` por:

```jsx
import Saludo from "./components/Saludo";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Clase 1 — Práctica A</h1>
      <Saludo nombre="Ana" />
      <Saludo nombre="Luis" />
    </div>
  );
}
```

**Qué aprendés:** props como parámetros; reutilizar el mismo componente con distintos valores.

---

### Práctica B — Lista con `.map()` y `key`

**1.** Creá `src/components/ListaPersonas.jsx`:

```jsx
const personas = [
  { id: 1, nombre: "Ana", rol: "USER" },
  { id: 2, nombre: "Luis", rol: "ADMIN" },
  { id: 3, nombre: "Marta", rol: "USER" },
];

export default function ListaPersonas() {
  return (
    <section>
      <h2>Personas</h2>
      <ul>
        {personas.map((p) => (
          <li key={p.id}>
            {p.nombre} — {p.rol}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**2.** Usalo en `src/App.jsx` (podés sumarlo debajo de la Práctica A o reemplazar):

```jsx
import Saludo from "./components/Saludo";
import ListaPersonas from "./components/ListaPersonas";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Clase 1 — Práctica A + B</h1>
      <Saludo nombre="Ana" />
      <ListaPersonas />
    </div>
  );
}
```

**Qué aprendés:** `key` estable (acá `id`); **no** uses índice del array como `key` si la lista puede reordenarse o filtrarse mucho (en listas fijas simples a veces se usa índice, pero `id` es mejor práctica).

---

### Práctica C — Input controlado con `useState`

**1.** Creá `src/components/EcoInput.jsx`:

```jsx
import { useState } from "react";

export default function EcoInput() {
  // const [texto, setTexto] = useState("");
  // Es equivalente a
  const par = useState("");
  const texto = par[0];
  const setTexto = par[1];

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Escribí algo</h2>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí..."
        style={{ padding: 8, width: "100%", maxWidth: 320 }}
      />
      <p style={{ marginTop: 8 }}>
        <strong>Texto:</strong> {texto || "(vacío)"}
      </p>
    </section>
  );
}
```

Qué hace useState("")
`useState` es un hook. Devuelve un par de valores en un array:

Qué es un hook

En React, un Hook es una función especial que te permite “enganchar” tu componente funcional a características de React que antes estaban más ligadas a las clases: estado, efectos secundarios (pedidos a la API, suscripciones, timers), memoria entre renders, contexto, etc.

Cómo se reconocen
El nombre suele empezar con use: useState, useEffect, useContext, useReducer, etc.
Solo están pensados para llamarse en componentes funcionales (o dentro de otros Hooks personalizados que también empiezan con use), no en cualquier función suelta ni en condiciones/bucles arbitrarios (las reglas de los Hooks).
Ejemplo mental
useState: guardás un valor que puede cambiar; cuando lo cambiás, React vuelve a renderizar el componente.
useEffect: ejecutás algo después del render (por ejemplo traer datos), y podés limpiar al desmontar.
Resumen en una frase
Un Hook es la forma en que React te da APIs reutilizables para estado y comportamiento en componentes escritos como funciones, con reglas claras de cuándo y dónde se pueden llamar.


El valor actual del estado (aquí, un string que empieza como "").
Una función para cambiar ese valor y que React vuelva a dibujar el componente.

Los corchetes son una desestructuración de arrays (sintaxis de JavaScript)


**2.** Usalo en `src/App.jsx`:

```jsx
import Saludo from "./components/Saludo";
import ListaPersonas from "./components/ListaPersonas";
import EcoInput from "./components/EcoInput";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Clase 1 — Práctica A + B + C</h1>
      <Saludo nombre="Ana" />
      <ListaPersonas />
      <EcoInput />
    </div>
  );
}
```

**Qué aprendés:** **estado local**; el input es “controlado” porque su `value` viene de `texto` y `onChange` actualiza `setTexto`.

---

### Práctica D — Contador con `useState`

**Archivo:** `src/components/Contador.jsx`

```jsx
import { useState } from "react";

export default function Contador() {
  const [n, setN] = useState(0);

  return (
    <div style={{ marginTop: 24 }}>
      <p>Valor: {n}</p>
      <button type="button" onClick={() => setN(n + 1)}>
        +1
      </button>
      <button type="button" onClick={() => setN(0)} style={{ marginLeft: 8 }}>
        Reset
      </button>
    </div>
  );
}
```

**En `App.jsx`:** importá `Contador` y renderizalo debajo de lo demás.

### Práctica E — Un hijo “avisa” al padre y actualiza la lista

Si tenés una **`ListaPersonas`** con un array fijo adentro del archivo, **ningún otro componente puede cambiar esa lista** de forma reactiva: hace falta **subir el estado** (*lifting state up*) al **padre común** (por ejemplo `App`).

**Idea:** el estado `personas` vive en `App`. El padre pasa **dos cosas por props**:

1. **`personas`** → al componente que solo **muestra** la lista.
2. **`onAgregarPersona`** (una función) → al componente que **lee el teclado**; cuando el usuario confirma (botón o formulario), el hijo **llama** a esa función con el nuevo objeto. No es un “evento global”: es una **función que el padre definió** y el hijo ejecuta.

**En `App.jsx`:**

```jsx
import { useState } from "react";
import ListaPersonas from "./components/ListaPersonas";
import FormularioPersona from "./components/FormularioPersona";

const inicial = [
  { id: 1, nombre: "Ana", rol: "USER" },
  { id: 2, nombre: "Luis", rol: "ADMIN" },
];

export default function App() {
  const [personas, setPersonas] = useState(inicial);

  function agregarPersona(nueva) {
    setPersonas((prev) => [...prev, nueva]);
  }

  const siguienteId =
    personas.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  return (
    <div style={{ padding: 24 }}>
      <ListaPersonas personas={personas} />
      <FormularioPersona onAgregar={agregarPersona} siguienteId={siguienteId} />
    </div>
  );
}
```

*(Alternativa: `crypto.randomUUID()` o un contador en `useState` solo para ids. Lo importante es que **`key` en la lista sea estable y único**.)*

**`ListaPersonas.jsx`** — ya no define el array adentro; solo **recibe** `personas`:

```jsx
export default function ListaPersonas({ personas }) {
  return (
    <section>
      <h2>Personas</h2>
      <ul>
        {personas.map((p) => (
          <li key={p.id}>
            {p.nombre} — {p.rol}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**`FormularioPersona.jsx`** — estado local para lo que se escribe; al enviar, llama a **`onAgregar`**:

```jsx
import { useState } from "react";

export default function FormularioPersona({ onAgregar, siguienteId }) {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("USER");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAgregar({ id: siguienteId, nombre: nombre.trim(), rol });
    setNombre("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
}
```

**Qué aprendés:** **datos compartidos** en el padre; **props hacia abajo**; **callbacks hacia arriba** para actualizar el estado desde un hijo.

---

## Checklist — ¿salió bien ?

Marcá lo que lograste:

- [ ] El proyecto corre con `npm run dev` sin errores rojos en la terminal.
- [ ] Entendés que un componente es una **función** que devuelve JSX.
- [ ] Usaste **props** para pasar datos de un componente a otro.
- [ ] Renderizaste una lista con **`.map()`** y pusiste **`key`**.
- [ ] Usaste **`useState`** al menos una vez.
- [ ] **Subiste estado** al padre y un hijo actualizó datos con un **callback** (`onAgregar`, etc.).

---

## Si algo falla — Clase 1

| Problema | Qué revisar |
|----------|----------------|
| Error de “dos elementos raíz” en el `return` | Envolver todo en un `<div>...</div>` o en `<>...</>`. |
| El navegador marca error con `class` | En JSX se usa **`className`**, no `class`. |
| Advertencia de React sobre **`key`** en listas | Cada elemento del `.map()` debería tener `key={...}` único. |
| No entiendo props vs estado | **Props**: vienen del padre y no las cambiás vos adentro del hijo (salvo que el padre te pase una función). **Estado**: dato que cambia con `set...` y actualiza la pantalla. |
| `Failed to resolve import "./components/..."` | Revisá que la carpeta `src/components` exista y el nombre del archivo coincida con el import (mayúsculas/minúsculas). |

---

## Conexion con backend

Probar un **`fetch`** a una API pública (sin token) y mostrar en pantalla: **cargando**, **datos** o **mensaje de error**. No es obligatorio para seguir con la Clase 2.

**Ejemplo mínimo** (`src/components/PokemonNombre.jsx` — requiere internet):

```jsx
import { useState } from "react";

export default function PokemonNombre() {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/1");
      if (!res.ok) throw new Error("Respuesta no OK");
      const data = await res.json();
      setNombre(data.name);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button type="button" onClick={cargar} disabled={cargando}>
        {cargando ? "Cargando..." : "Traer Pokémon #1"}
      </button>
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {nombre && <p>Nombre: {nombre}</p>}
    </div>
  );
}
```

