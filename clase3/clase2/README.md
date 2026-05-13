# Guía: API Spring Boot con JWT, JPA y H2

Esta guía describe el backend del módulo **`clase2`** (dentro del repo **clase3**): **Spring Boot** con **Spring Security**, autenticación por **JWT**, persistencia **JPA** sobre **H2** en memoria, y recursos REST de **clientes** y **teléfonos**.

## Qué vas a lograr

- Levantar la API en **`http://localhost:8080`**.
- Entender el flujo **login → JWT → rutas protegidas** con header `Authorization: Bearer …`.
- Consultar la documentación de conceptos (**JWT**, **Bearer**, **filtros**, etc.) con **definiciones breves y enlaces oficiales**.
- Probar **`/ping`**, **`/auth/login`**, **`/clientes`** y **`/clientes/{id}/telefonos`**.
- Opcional: usar la **consola H2** para inspeccionar datos.

---

## Glosario: definiciones y enlaces

| Término | Qué es (resumen) | Dónde profundizar |
|--------|-------------------|-------------------|
| **JWT** (*JSON Web Token*) | Token compacto y firmado (típicamente tres segmentos en Base64URL) que transporta claims; en este proyecto el servidor lo **genera** tras un login correcto y el cliente lo **reenvía** en cada petición protegida. Según el estándar **RFC 7519**. | [RFC 7519 — JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519) |
| **Bearer token** | Esquema HTTP en el que el cliente envía el token en el header **`Authorization: Bearer <token>`**. Definido en **RFC 6750** (uso de bearer tokens con OAuth 2.0; el formato del header es el habitual también fuera de OAuth). | [RFC 6750 — Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750) |
| **Spring Security** | Framework de autenticación y autorización para Spring; acá define qué rutas son públicas, desactiva sesión con cookie (**stateless**) y encadena el **filtro JWT** antes del filtro de usuario/contraseña. | [Spring Security — Reference](https://docs.spring.io/spring-security/reference/) |
| **`SecurityFilterChain`** | Cadena de filtros Servlet que procesa cada request; en Boot 3.x se declara como `@Bean` y reemplaza gran parte de la config XML antigua. | [Servlet configuration (Java)](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html) |
| **Sesión stateless** | No se guarda estado de sesión en el servidor entre requests; la “sesión” va en el **JWT** validado en cada llamada. | [Session management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html) |
| **JJWT** (*Java JWT*) | Librería Java para crear y validar JWT; este proyecto usa **`io.jsonwebtoken:jjwt-*`** en el `pom.xml`. | [GitHub — jwtk/jjwt](https://github.com/jwtk/jjwt) |
| **JPA / Hibernate** | API de persistencia en Java; **Hibernate** es el proveedor que Spring Boot usa por defecto para mapear entidades a tablas. | [Spring Boot — Data JPA](https://docs.spring.io/spring-boot/reference/data/sql.html#data.sql.jpa-and-spring-data) |
| **H2** | Base embebida en memoria (en este `application.properties`: `jdbc:h2:mem:clientesdb`). | [H2 Database Engine](https://www.h2database.com/html/main.html) |
| **BCrypt** | Función de hash para contraseñas; Spring expone **`PasswordEncoder`** (aquí `BCryptPasswordEncoder`) para no guardar contraseñas en texto plano. | [Password storage (Spring Security)](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html) |

---

## Mapa del código (enlaces relativos al módulo)

| Rol | Archivo |
|-----|---------|
| Arranque Spring Boot | [`src/main/java/com/example/clase2/Clase2Application.java`](src/main/java/com/example/clase2/Clase2Application.java) |
| Login y emisión de JWT | [`src/main/java/com/example/clase2/controller/AuthController.java`](src/main/java/com/example/clase2/controller/AuthController.java) |
| Generación y validación de JWT | [`src/main/java/com/example/clase2/config/JwtUtil.java`](src/main/java/com/example/clase2/config/JwtUtil.java) |
| Lectura del header `Authorization` y contexto de seguridad | [`src/main/java/com/example/clase2/config/JwtFilter.java`](src/main/java/com/example/clase2/config/JwtFilter.java) |
| Rutas públicas vs autenticadas, filtro JWT, CSRF, frames H2 | [`src/main/java/com/example/clase2/config/SecurityConfig.java`](src/main/java/com/example/clase2/config/SecurityConfig.java) |
| Usuario en memoria, `PasswordEncoder`, `AuthenticationManager` | [`src/main/java/com/example/clase2/config/UserConfig.java`](src/main/java/com/example/clase2/config/UserConfig.java) |
| Healthcheck | [`src/main/java/com/example/clase2/controller/Ping.java`](src/main/java/com/example/clase2/controller/Ping.java) |
| Clientes (GET lista, POST alta) | [`src/main/java/com/example/clase2/controller/ClienteController.java`](src/main/java/com/example/clase2/controller/ClienteController.java) |
| Teléfonos por cliente | [`src/main/java/com/example/clase2/controller/TelefonoController.java`](src/main/java/com/example/clase2/controller/TelefonoController.java) |
| Datasource y JPA | [`src/main/resources/application.properties`](src/main/resources/application.properties) |

---

## Requisitos previos

1. **JDK 21** (definido en `java.version` del `pom.xml`).
2. Maven Wrapper del módulo (`mvnw` / `mvnw.cmd`) o Maven instalado.

---

## Paso 1: Levantar la aplicación

1. Abrí una terminal en la carpeta de este módulo (donde está el `pom.xml`). Desde la raíz del repo **clase3**:

   ```bash
   cd clase2
   ```

2. Iniciá la aplicación (Windows):

   ```bash
   .\mvnw.cmd spring-boot:run
   ```

   En macOS o Linux:

   ```bash
   ./mvnw spring-boot:run
   ```

3. Comprobá que responde:

   - `http://localhost:8080/ping` → texto **`pong`**.

---

## Paso 2: API — rutas públicas (sin JWT)

Base: **`http://localhost:8080`**.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ping` | Comprueba que el servidor está vivo. Respuesta: texto `pong`. |
| POST | `/auth/login` | Credenciales JSON; respuesta con **`token`** (JWT). |

**Body del login (JSON):**

```json
{
  "username": "admin",
  "password": "1234"
}
```

Usuario definido en [`UserConfig.java`](src/main/java/com/example/clase2/config/UserConfig.java): **`admin`** / **`1234`**.

**Respuesta del login (JSON):**

```json
{
  "token": "eyJhbGciOi..."
}
```

---

## Paso 3: API — rutas protegidas (con JWT)

En cada petición autenticada enviá el header definido en **RFC 6750**:

```http
Authorization: Bearer <el_token_que_devolvió_el_login>
```

| Método | Ruta | Body (JSON) | Respuesta (este backend) |
|--------|------|-------------|--------------------------|
| GET | `/clientes` | — | JSON: array de clientes |
| POST | `/clientes` | `{ "nombre": "Nombre del cliente" }` | **Texto plano** (ver nota) |
| GET | `/clientes/{id}/telefonos` | — | JSON: lista de teléfonos |
| POST | `/clientes/{id}/telefonos` | `{ "numero": "...", "descripcion": "..." }` | JSON: teléfono creado |

Reemplazá `{id}` por el id numérico del cliente.

**Nota sobre `POST /clientes`:** el controlador devuelve un **`String`**, no un JSON con el cliente. En el cliente HTTP conviene **`res.text()`** y no **`res.json()`**.

**Vida del token:** en [`JwtUtil.java`](src/main/java/com/example/clase2/config/JwtUtil.java) la expiración está fijada en **1 hora** (`EXPIRATION_MS = 3600000`).

---

## Paso 4: Ejemplos rápidos con `curl`

Tras el login, guardá el token en una variable (bash):

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}' | jq -r '.token')

curl -s http://localhost:8080/clientes -H "Authorization: Bearer $TOKEN"
```

Sin `jq`, copiá el token a mano desde la respuesta del `POST /auth/login`.

En **PowerShell** podés usar `Invoke-RestMethod` para el login y luego enviar el header `Authorization` en el siguiente request.

---

## Paso 5: Consola H2

1. Navegador: **`http://localhost:8080/h2-console/`**
2. **JDBC URL:** `jdbc:h2:mem:clientesdb`
3. **Usuario:** `sa` — **Contraseña:** vacía.

La consola está permitida sin JWT en [`SecurityConfig.java`](src/main/java/com/example/clase2/config/SecurityConfig.java) (`/h2-console/**`).

---

## Resumen de comandos

| Acción | Comando |
|--------|---------|
| Arrancar (Windows) | `.\mvnw.cmd spring-boot:run` |
| Arrancar (Unix) | `./mvnw spring-boot:run` |
| Tests | `.\mvnw.cmd test` |

---

## Solución de problemas

- **`401 Unauthorized` en `/clientes` o teléfonos:** falta header `Authorization`, token inválido o **expirado** (pasó 1 hora); repetí login.
- **`403 Forbidden`:** revisá roles y reglas; aquí cualquier usuario autenticado puede acceder a rutas no públicas.
- **`ping` no responde:** comprobá puerto **8080** y que la app esté levantada.
- **CORS desde un front en otro origen:** este módulo no documenta CORS; en desarrollo suele usarse **proxy** del frontend (ver la guía de [clase6](../../clase6/Readme.md)) o habilitar CORS en Spring.

---

## Nota de seguridad (académica)

La clave en **`JwtUtil`** está **hardcodeada** para demo. En producción debe venir de **variables de entorno** o un almacén de secretos, con longitud adecuada para el algoritmo (HS256). Ver prácticas recomendadas en la documentación de **Spring Security** y del estándar **JWT** ([RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)).

---

## Guía relacionada en el repo

Para conectar un **frontend Vite** a un backend con las mismas ideas (JWT, proxy, rutas), podés seguir el estilo paso a paso de la guía de **clase6**: [`../../clase6/Readme.md`](../../clase6/Readme.md) (desde esta carpeta `clase3/clase2` subís dos niveles hasta `repo` y entrás a `clase6`; si tu estructura de carpetas difiere, ajustá la ruta relativa).
