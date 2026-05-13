# Guía: API REST con Spring Boot, JPA y H2

Esta guía explica **paso a paso** cómo levantar el backend de la práctica **clase2**: aplicación **Spring Boot** con persistencia **JPA** sobre base **H2 en memoria**, endpoints de **clientes** y consola web de H2.

## Qué vas a lograr

- Ejecutar la API en **`http://localhost:8080`** (puerto por defecto de Spring Boot).
- Probar **`GET /ping`** y el CRUD mínimo de **`/clientes`** (listar y alta).
- Usar la **consola H2** para inspeccionar la base en memoria mientras la app corre.

---

## Requisitos previos

1. **JDK 21** (el `pom.xml` fija `java.version` en 21).
2. Opcional: **Maven** instalado; si no, usá el **Maven Wrapper** incluido (`mvnw` / `mvnw.cmd`).

---

## Paso 1: Levantar la aplicación

1. Abrí una terminal.
2. Entrá a la carpeta de este proyecto (donde está el `pom.xml`):

   Desde la raíz del repo `aplicacionesinteractivas`:

   ```bash
   cd clase2/clase2
   ```

   En Windows con PowerShell podés usar la misma ruta con barras invertidas: `cd clase2\clase2`.

3. Iniciá la aplicación (Windows):

   ```bash
   .\mvnw.cmd spring-boot:run
   ```

   En macOS o Linux:

   ```bash
   ./mvnw spring-boot:run
   ```

   También podés ejecutarla desde el IDE con **Run** en la clase `Clase2Application`.

4. Comprobá que responde (navegador o herramienta HTTP):

   - `http://localhost:8080/ping` → debería devolver el texto **`pong`**.

Dejá esta terminal corriendo mientras probás los endpoints o la consola H2.

---

## Paso 2: Entender la API

Base del servidor: **`http://localhost:8080`**.

### Rutas disponibles

| Método | Ruta | Body (JSON) | Respuesta |
|--------|------|-------------|-----------|
| GET | `/ping` | — | Texto plano: `pong` |
| GET | `/clientes` | — | JSON: array de objetos `Cliente` con al menos **`id`** y **`nombre`** |
| POST | `/clientes` | `{ "nombre": "Nombre del cliente" }` | **Texto plano**, no JSON (ver nota abajo) |

**Ejemplo de alta de cliente:**

```json
{
  "nombre": "María García"
}
```

**Nota sobre `POST /clientes`:** el controlador devuelve un **`String`** (por ejemplo `"Cliente agregado: " + cliente.toString()`), no un objeto JSON con el cliente creado. Spring envía eso como **cuerpo de texto**. Si consumís esta API desde otro cliente (por ejemplo `fetch` en el navegador), conviene leer el cuerpo con **`res.text()`**, no con **`res.json()`** (si usás `json()` sobre texto plano, falla el parseo).

**Ejemplo con `curl` (GET lista):**

```bash
curl http://localhost:8080/clientes
```

**Ejemplo con `curl` (POST alta):**

```bash
curl -X POST http://localhost:8080/clientes -H "Content-Type: application/json" -d '{"nombre":"Juan Pérez"}'
```

En **Windows PowerShell**, `curl` es un alias de `Invoke-WebRequest`; para el mismo ejemplo podés usar:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/clientes -ContentType "application/json" -Body '{"nombre":"Juan Pérez"}'
```

---

## Paso 3: Consola web de H2

Con la aplicación en marcha:

1. Abrí en el navegador: **`http://localhost:8080/h2-console/`**
2. En **JDBC URL** usá la misma que define el proyecto (memoria):

   `jdbc:h2:mem:clientesdb`

3. **Usuario:** `sa`  
4. **Contraseña:** dejala vacía (como en `application.properties`).

Conectá y podés ejecutar consultas SQL sobre las tablas que Hibernate generó (por ejemplo la entidad `Cliente`).

---

## Estructura del código (`com.example.clase2`)

| Ubicación | Descripción |
|-----------|-------------|
| `Clase2Application.java` | Arranque de Spring Boot |
| `controller/Ping.java` | Endpoint de salud `GET /ping` |
| `controller/ClienteController.java` | `GET` y `POST` bajo `/clientes` |
| `model/Cliente.java` | Entidad JPA |
| `repository/ClienteRepository.java` | Acceso a datos |
| `service/ClienteService.java` | Lógica de negocio |
| `dto/resquest/ClienteRequestDto.java` | Body esperado en el alta |
| `config/H2ConsoleConfig.java` | Registro del servlet de la consola H2 |
| `resources/application.properties` | Datasource H2, JPA (`ddl-auto=create-drop`, `show-sql`) |

---

## Resumen de comandos

| Dónde | Comando |
|-------|---------|
| Raíz del módulo (`clase2` con `pom.xml`) | `.\mvnw.cmd spring-boot:run` (Windows) o `./mvnw spring-boot:run` (Unix) |
| Tests (opcional) | `.\mvnw.cmd test` |

---

## Solución de problemas

- **`ping` no responde:** verificá que la app esté en marcha y que ningún otro proceso use el puerto **8080**.
- **Error de versión de Java:** instalá o configurá **JDK 21** para que Maven use esa versión.
- **`POST /clientes` y el cliente HTTP falla al parsear:** recordá que la respuesta es **texto**, no JSON; leé el body como texto.
- **Consola H2 no carga o no conecta:** revisá que la JDBC URL sea exactamente **`jdbc:h2:mem:clientesdb`** (base en memoria; si reiniciás la app, los datos se pierden salvo que cambies la configuración).

Con estos pasos tenés una guía alineada al estilo de la documentación de clase6, adaptada a este módulo backend de clase2.
