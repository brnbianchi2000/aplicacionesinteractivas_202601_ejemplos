# JavaScript en el navegador — Guía de estudio

Podés usar este documento para **seguir la clase en vivo** y para **repasar después** en tu casa. El material sale **solo** de los archivos `.html` de esta carpeta (`clase4`). Las secciones útiles son: **antes de empezar**, **glosario**, **conceptos técnicos** (de menor a mayor complejidad), **ejemplos vistos en clase**, checklist y **si algo falla**.

---

## Antes de empezar

### Cómo usar los archivos

- Abrí cada `.html` con tu navegador (doble clic o **“Open with Live Server”** si usás esa extensión en VS Code).
- Respetá el **orden sugerido** más abajo: arranca en `index.html` y subí de complejidad hasta `index_paso7.html`.

### Qué ya deberías saber

- HTML básico (`id`, listas, botones, inputs).
- JavaScript: variables, funciones y **arrow functions** (`() => ...`).

### Orden sugerido (menor → mayor complejidad)

1. `index.html` — JavaScript puro, sin DOM.
2. `index2.html` — DOM, eventos y lista en memoria.
3. `index3.html` — Objeto literal, armado de nodos y `setTimeout`.
4. `index4.html` — `fetch`, `async`/`await` y JSON.
5. `index_paso6.html` — Misma API, lista con imagen y `map`.
6. `index_paso7.html` — Funciones auxiliares y errores más claros.

---

## Glosario mínimo (te va a aparecer en la materia)

| Término | Significado corto |
|--------|-------------------|
| **DOM** | Representación en memoria del HTML; JavaScript la modifica con `document`, nodos, eventos. |
| **Callback** | Función que pasás como argumento para que **otra** la ejecute cuando corresponda. |
| **Arrow function** | Sintaxis corta `(a) => a + 1`; útil en `map`, `forEach` y listeners. |
| **`map` / `filter` / `forEach`** | `map` **devuelve** un array nuevo transformado; `filter` **devuelve** uno filtrado; `forEach` **recorre** sin devolver un array “nuevo” para encadenar. |
| **Spread (`...`)** | “Desarma” un iterable (por ejemplo un array) en elementos sueltos: copiar items o pasarlos a `replaceChildren`. |
| **`async` / `await`** | Forma de escribir código asíncrono (por ejemplo **HTTP**) leyendo casi como código lineal. |
| **`fetch`** | Función del navegador para pedidos HTTP; devuelve una **Promise**; suele combinarse con `await` y `res.json()`. |
| **CORS** | Reglas del navegador sobre qué orígenes pueden leer la respuesta de un servidor; en clase usamos `mode: "cors"` en el `fetch`. |

---

# Conceptos técnicos

## JavaScript puro: arrays, spread y callbacks (`index.html`)

Acá no se toca el DOM: solo el **lenguaje**.

- **`const` y arrays:** un array literal `[4, 5, 6, 7, 8]` y una variable que no reasignás.
- **Spread:** `const aux = [...numeros]` copia los elementos a **otro** array (copia superficial).
- **`map` + `forEach`:** `map` transforma cada elemento y devuelve array nuevo; `forEach` recorre (en clase encadenás ambos).
- **Callback y orden superior:** una función como `relacion(alguien, callback)` que hace `return callback(alguien)` delega el “qué decir” en el callback (por ejemplo `despedir` o una flecha con template literal).

---

## DOM, eventos y lista en memoria (`index2.html`)

- **`document.getElementById`:** obtener un elemento por su `id`.
- **Leer valores:** `document.getElementById("nombre").value`.
- **`addEventListener("click", ...)`:** reaccionar al clic sin mezclar HTML y lógica en un solo atributo.
- **Estado en variables:** array `saludosEnMemoria` y `textoFiltro` con `let` cuando hace falta **reasignar**.
- **Actualizar la lista:** vaciar el `<ul>` con `innerHTML = ""`, decidir qué mostrar con **ternario** + `filter` + `includes`, y pintar con `forEach` creando `<li>` y botones con `createElement`, `append`, `appendChild`.
- **Mutar el array:** `push`, `indexOf`, `splice` para borrar un ítem y volver a llamar a la función que redibuja.

---

## Objeto literal, nodos ricos y `setTimeout` (`index3.html`)

- **Objeto literal:** un personaje de ejemplo con `name`, `status`, `image`.
- **Template literals:** `` `${p.name} — ${p.status}` `` dentro de comillas invertidas.
- **DOM:** `createElement` para `li`, `img`, `span`; `img.src`, `img.alt`, `loading = "lazy"`.
- **`replaceChildren`:** reemplazar el contenido del contenedor por nuevos nodos.
- **`setTimeout`:** ejecutar código **después** de un delay (en clase simula espera); el resto del script **sigue** (no “congela” todo el programa).

---

## `fetch`, JSON y manejo de errores (`index4.html`)

- **URL en constante** y función **`async`** llamada al final (`iniciar()`).
- **`await fetch(..., { method, mode, cache })`:** pedido GET con CORS y sin cache agresiva.
- **`res.ok`:** si es falso, conviene **lanzar** un error con el código HTTP.
- **`await res.json()`:** parsear el cuerpo como objeto JavaScript.
- **`for...of`** sobre `pagina.results` para crear cada `<li>` con texto simple.
- **`try` / `catch`:** capturar fallos de red o HTTP y mostrarlos en un `<p>`.

---

## Lista con imagen: `map` y `replaceChildren` con spread (`index_paso6.html`)

- Mismo flujo que `index4.html` (async + fetch + JSON + try/catch).
- **Función `crearItem(p)`:** devuelve un `<li>` ya armado con imagen y texto.
- **`pagina.results.map(crearItem)`:** transformás **toda** la página de resultados en un array de nodos.
- **`ul.replaceChildren(...items)`:** el **spread** convierte el array de nodos en argumentos sueltos para `replaceChildren`.

---

## Helpers y mensajes de error orientados a diagnóstico (`index_paso7.html`)

- **`getJson(url)`:** centraliza fetch + `ok` + `json()` para no repetir código.
- **`mostrarLista(ul, elementos)`:** un solo lugar que hace `replaceChildren`.
- **`iniciar` más corto:** orquesta pedido, `map` y vista.
- **Errores:** mensaje que invita a F12 (Red / Consola), VPN, firewall, etc., según lo visto en el archivo.

---

# Ejemplos vistos en clase (por archivo)

Los fragmentos siguen la idea de lo que vimos en cada `.html`. Podés copiarlos y contrastarlos con el archivo original.

### `index.html`

```javascript
const numeros = [4, 5, 6, 7, 8];
const aux = [...numeros];
aux.map((n) => n * 100).forEach((e) => console.log(e));
```

```javascript
function relacion(alguien, callback) {
  return callback(alguien);
}
const despedir = (alguien) => "chau " + alguien;
// console.log(relacion("Carlos", despedir));
// console.log(relacion("Juan", (alguien) => `estudiando ${alguien}`));
```

**Qué repasás:** spread, `map`/`forEach`, callback como argumento.

---

### `index2.html`

```javascript
const saludosEnMemoria = [];
let textoFiltro = "";

const saludar = (alguien) => {
  return "hola " + alguien;
};

const listaMostrada =
  textoFiltro === ""
    ? saludosEnMemoria
    : saludosEnMemoria.filter((texto) => texto.includes(textoFiltro));

listaMostrada.forEach((texto) => {
  const li = document.createElement("li");
  li.append(texto, " ");
  // botón Borrar: indexOf + splice + actualizarListaSaludos()
});
```

```javascript
document.getElementById("agregar").addEventListener("click", agregarALaLista);
```

**Qué repasás:** DOM, eventos, `filter` en la UI, crear elementos, mutar array y redibujar.

---

### `index3.html`

```javascript
const demo = {
  name: "Rick Sanchez",
  status: "Alive",
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
};

const crearItem = (p) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = p.image;
  img.alt = p.name;
  const span = document.createElement("span");
  span.textContent = `${p.name} — ${p.status}`;
  li.append(img, span);
  return li;
};

setTimeout(() => {
  ul.replaceChildren(crearItem(demo));
  msg.textContent = "";
}, 5500);
```

**Qué repasás:** objeto literal, template literal, `replaceChildren`, asincronía con temporizador.

---

### `index4.html`

```javascript
const iniciar = async () => {
  try {
    msg.textContent = "Cargando...";
    const res = await fetch(PERSONAJES_PAGINA_1, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const pagina = await res.json();
    ul.innerHTML = "";
    for (const p of pagina.results) {
      const li = document.createElement("li");
      li.textContent = p.name + " — " + p.status;
      ul.appendChild(li);
    }
    msg.textContent = "";
  } catch (e) {
    msg.textContent = "Error: " + (e && e.message ? e.message : e);
  }
};
iniciar();
```

**Qué repasás:** `async`/`await`, `fetch`, JSON, `try`/`catch`, `for...of`.

---

### `index_paso6.html`

```javascript
const pagina = await res.json();
const items = pagina.results.map(crearItem);
ul.replaceChildren(...items);
```

**Qué repasás:** `map` para generar nodos, spread en `replaceChildren`, ítems con imagen (función `crearItem` en el mismo archivo).

---

### `index_paso7.html`

```javascript
const getJson = async (url) => {
  const res = await fetch(url, { method: "GET", mode: "cors", cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
};

const mostrarLista = (ul, elementos) => {
  ul.replaceChildren(...elementos);
};

const pagina = await getJson(PERSONAJES_PAGINA_1);
const items = pagina.results.map(crearItem);
mostrarLista(ul, items);
```

**Qué repasás:** funciones chicas reutilizables, mismo resultado con código más legible.

---

## Checklist — ¿salió bien?

Marcá lo que lograste:

- [ ] Entendés la diferencia entre **`map`**, **`filter`** y **`forEach`**.
- [ ] Sabés qué hace el **spread** `...` en un array y en **`replaceChildren(...items)`**.
- [ ] Podés explicar qué es un **callback** y un ejemplo con **`relacion(alguien, callback)`**.
- [ ] Usaste **`getElementById`**, **`addEventListener`** y **`createElement`** en `index2.html`.
- [ ] Entendés **`setTimeout`** vs código que sigue ejecutándose después.
- [ ] Levantaste datos con **`fetch`** + **`await res.json()`** y manejaste errores con **`try`/`catch`**.
- [ ] Uniste API + **`map(crearItem)`** + **`replaceChildren`** en los pasos finales.

---

## Si algo falla

| Problema | Qué revisar |
|----------|-------------|
| **`Failed to fetch`** o la lista no carga | Red, VPN, proxy, firewall, antivirus; otra pestaña **Red** / **Consola** en F12 (como sugiere `index_paso7.html`). |
| Error HTTP distinto de 200 | Mirá `res.status`; en clase se lanza `new Error("HTTP " + res.status)` si `!res.ok`. |
| La lista queda vacía después de un cambio | Revisá que el **`ul`** o **`#lista`** sea el correcto y que no estés borrando **`innerHTML`** sin volver a agregar nodos. |
| En `index2.html` el filtro no muestra nada | **`textoFiltro`** y **`trim()`**; que **`includes`** coincida con lo que guardaste en **`saludosEnMemoria`**. |
| `setTimeout` no parece hacer nada | El delay está en **milisegundos**; revisá que el callback modifique el DOM que estás mirando. |

---

*Guía alineada al estilo de documentación de la materia; contenido acotado a los `.html` de la carpeta `clase4`.*
