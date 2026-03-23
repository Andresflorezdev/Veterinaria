# Buenas prácticas para pruebas e2e con Jest + Supertest

Guía práctica basada en lo que ya está implementado en este proyecto.

## 1) Estructura recomendada de una suite e2e

### `describe()` raíz

- Define el contexto global de la API bajo prueba.
- Ejemplo en el proyecto:
  - `describe('API (e2e)', ...)` para pruebas rápidas mockeadas.
  - `describe('API real (e2e)', ...)` para integración real con Mongo en memoria.

### `describe()` por recurso

- Agrupa por dominio/endpoints para facilitar mantenimiento:
  - `Owner endpoints`
  - `Veterinarian endpoints`
  - `Pet endpoints`
  - `Seed endpoints`

### `it()` por comportamiento

- Nombra cada caso con intención funcional clara:
  - `POST /owner creates owner`
  - `GET /owner/:id returns 404 when not found`

## 2) Hooks de ciclo de vida (qué usar y cuándo)

### `beforeAll`

Úsalo para inicialización costosa que solo debe hacerse una vez por suite.

En este proyecto:

- Suite mockeada (`test/app.e2e-spec.ts`):
  - Crea `TestingModule` con controladores reales + servicios mock.
  - Levanta `app` con `createNestApplication()` y `app.init()`.

- Suite real (`test/app.real.e2e-spec.ts`):
  - Crea `MongoMemoryServer`.
  - Configura `MongooseModule.forRoot(mongoUri)`.
  - Inicializa `app` y obtiene `connection` para limpieza.

### `beforeEach`

Úsalo para aislar cada prueba cuando hay mocks/estado compartido.

En este proyecto:

- `jest.clearAllMocks()` en la suite mockeada.
- Evita que llamadas/implementaciones de un test contaminen el siguiente.

### `afterEach`

Úsalo para limpiar datos entre tests en integración real.

En este proyecto:

- En `app.real.e2e-spec.ts`, borra todas las colecciones:
  - recorre `connection.collections`
  - ejecuta `deleteMany({})` en paralelo

### `afterAll`

Úsalo para liberar recursos y evitar tests colgados.

En este proyecto:

- Suite mockeada: `await app.close()`.
- Suite real: `await app.close()`, `await connection.close()`, `await mongod.stop()`.

## 3) Patrón AAA (Arrange, Act, Assert)

Aplicar estructura consistente en cada `it`:

1. **Arrange**
   - Preparar payload y expected.
   - Configurar mock con `mockResolvedValue` o `mockRejectedValue`.

2. **Act**
   - Ejecutar request con Supertest:
     - `request(app.getHttpServer())`
     - `.get/.post/.patch/.delete(...)`

3. **Assert**
   - Validar status y body con `.expect(...)`.
   - En casos puntuales, usar callback de expect para asserts más finos.

## 4) Buenas prácticas para mocks en e2e “rápida”

- Declarar un mock por servicio con todas las operaciones usadas por controladores.
- Usar `useValue` en providers del `TestingModule`.
- Verificar también llamadas a servicios cuando importa el contrato interno:
  - Ejemplo: confirmar modo enviado en `runE2ETests` (`FAST` vs `REAL`).
- Simular errores reales con excepciones de Nest (`NotFoundException`) para validar respuestas 404.

## 5) Buenas prácticas para e2e “real”

- Usar base efímera con `mongodb-memory-server` para no tocar DB local.
- Mantener pruebas independientes limpiando colecciones tras cada caso.
- Probar flujos completos de negocio, no solo un endpoint aislado:
  - crear owner
  - crear veterinarian
  - crear pet relacionado
  - validar existencia, consulta, actualización y eliminación
- Probar al menos un caso de error real (ej. ID inexistente retorna 404).

## 6) Tipado y helpers para mayor claridad

Recomendación aplicada en este proyecto:

- Definir tipos pequeños para respuesta (`IdBody`, `NotFoundBody`, etc.).
- Crear helper reutilizable para extraer IDs (`getIdFromResponse`).
- Evitar castings repetidos y mensajes ambiguos en errores.

## 7) Cobertura mínima recomendada por recurso

Por cada módulo principal:

- `POST` creación exitosa
- `GET` listado
- `GET :id` exitoso
- `GET :id` no encontrado (404)
- `PATCH :id` actualización
- `DELETE :id` eliminación

Y para endpoints especiales:

- Validar comportamiento booleano (`/exists` true/false)
- Validar historial y detalle (`/tests/history` y `/tests/history/:id`)

## 8) Convenciones de naming

- Nombre del archivo alineado al tipo de suite:
  - `app.e2e-spec.ts` (rápida/mock)
  - `app.real.e2e-spec.ts` (real/integración)
- Nombre de test con formato: `METODO /ruta resultado esperado`.
- Mantener idioma consistente dentro del mismo archivo.

## 9) Comandos de ejecución sugeridos

```bash
npm run test:e2e
npm run test:e2e:real
```

Flujo recomendado:

1. Desarrollo diario: `test:e2e`
2. Antes de merge/release: `test:e2e` + `test:e2e:real`

## 10) Checklist rápido para PR

- [ ] Cada endpoint crítico tiene test de éxito.
- [ ] Hay al menos un caso de error por recurso.
- [ ] No hay estado compartido entre tests.
- [ ] Se cierran recursos (`app`, DB en memoria, conexiones).
- [ ] Los nombres de test describen comportamiento observable.
- [ ] La suite corre en local con comandos del proyecto.

## 11) Boilerplate reutilizable

Archivo base disponible:

- `test/e2e-boilerplate.template.md`

Uso sugerido:

1. Copiar el archivo a un nombre de suite real (ejemplo: `test/resource.e2e-spec.ts` o `test/resource.real.e2e-spec.ts`).
2. Reemplazar `Resource*` por el módulo real (`Owner`, `Pet`, `Veterinarian`, etc.).
3. Ajustar rutas (`/resource`) y payloads según DTOs reales.
4. Ejecutar `npm run test:e2e` o `npm run test:e2e:real` según corresponda.

## 12) Inventario completo de funciones usadas en los e2e

Esta sección cubre **todas** las funciones/constructos que aparecen hoy en:

- `test/app.e2e-spec.ts`
- `test/app.real.e2e-spec.ts`

### A) Funciones de Jest (test runner)

- `describe(nombre, fn)`
  - Agrupa casos de prueba por contexto.
  - En el proyecto se usa para: suite raíz, módulos (`Owner`, `Pet`, etc.) y escenarios.

- `it(nombre, fn)`
  - Define un test individual con comportamiento observable.

- `beforeAll(fn)`
  - Corre una vez antes de todos los tests del bloque.
  - Se usa para construir y levantar la app de pruebas.

- `beforeEach(fn)`
  - Corre antes de cada test.
  - Se usa con `jest.clearAllMocks()` para aislar tests en suite mockeada.

- `afterEach(fn)`
  - Corre después de cada test.
  - Se usa para limpiar colecciones en suite real (`deleteMany({})`).

- `afterAll(fn)`
  - Corre al final de la suite.
  - Se usa para cerrar `app`, conexión y Mongo en memoria.

- `jest.fn()`
  - Crea funciones mock/spy controlables.
  - Se usa para simular métodos de servicio (`create`, `findAll`, `findOne`, etc.).

- `mockResolvedValue(valor)`
  - Hace que un mock async resuelva con `valor`.
  - Se usa para simular respuestas exitosas de servicios.

- `mockRejectedValue(error)`
  - Hace que un mock async falle con `error`.
  - Se usa para simular errores de negocio (ej. `NotFoundException`).

- `jest.clearAllMocks()`
  - Limpia historial de llamadas/instancias de mocks entre tests.

- `expect(valor)` + matchers usados
  - `.toContain(texto)`: validar substring en mensajes.
  - `.toBe(valor)`: igualdad estricta (primitivos).
  - `.toBeGreaterThanOrEqual(valor)`: comparaciones numéricas.
  - `.toHaveLength(n)`: longitud de arrays.
  - `.toHaveBeenCalledWith(args...)`: verificar llamada exacta a mock.

### B) Funciones de Supertest (HTTP testing)

- `request(app.getHttpServer())`
  - Crea cliente HTTP sobre el servidor Nest en memoria.

- `.get(ruta)`, `.post(ruta)`, `.patch(ruta)`, `.delete(ruta)`
  - Ejecutan verbos HTTP contra endpoints.

- `.send(payload)`
  - Envía body JSON en requests mutables (`POST`, `PATCH`).

- `.expect(status)`
  - Valida código HTTP.

- `.expect(objeto)`
  - Valida body exacto esperado.

- `.expect((response) => { ... })`
  - Validación avanzada cuando necesitas inspección parcial del body.

### C) Funciones y utilidades de Nest Testing

- `Test.createTestingModule(config)`
  - Construye un módulo de pruebas con controladores/providers/imports.

- `.compile()`
  - Compila el módulo para poder crear la aplicación.

- `moduleFixture.createNestApplication()`
  - Crea instancia `INestApplication` para test e2e.

- `app.init()`
  - Inicializa la app para recibir requests.

- `app.close()`
  - Cierra recursos HTTP/internos al finalizar.

- `getConnectionToken()` + `moduleFixture.get<Connection>(token)`
  - Obtiene la conexión de Mongoose usada en pruebas reales.

### D) Funciones de MongoDB en memoria (suite real)

- `MongoMemoryServer.create()`
  - Levanta instancia Mongo temporal para test de integración.

- `mongod.getUri()`
  - Entrega URI para conectar Mongoose a la DB efímera.

- `MongooseModule.forRoot(mongoUri)`
  - Configura Nest/Mongoose para usar esa base temporal.

- `connection.collections`
  - Acceso a colecciones activas para limpieza entre casos.

- `collection.deleteMany({})`
  - Borra documentos y deja tests independientes.

- `Promise.all([...])`
  - Ejecuta limpiezas de colecciones en paralelo.

- `connection.close()`
  - Cierra conexión Mongoose al finalizar suite.

- `mongod.stop()`
  - Apaga instancia de Mongo en memoria.

### E) Funciones/utilidades TypeScript usadas en tests

- `type ... = { ... }`
  - Define contratos de respuesta (`IdBody`, `NotFoundBody`, `SeedRunBody`, etc.).

- `function getIdFromResponse(response)`
  - Helper para extraer `_id` y fallar temprano si falta.
  - Mejora legibilidad y evita repetir lógica en cada test.

- `throw new Error('...')`
  - Señala respuesta inválida cuando el contrato mínimo no se cumple.

- `as unknown as Tipo`
  - Cast de respuestas HTTP para aplicar tipado explícito en assertions.

### F) Excepciones y enums usados en casos de prueba

- `new NotFoundException('...')`
  - Simula errores 404 reales en suite mockeada.

- `E2eRunMode.FAST` y `E2eRunMode.REAL`
  - Verifica que endpoints `/seed/tests/run` y `/seed/tests/run-real` llamen el modo correcto.

## 13) Mapeo rápido: función → para qué se usa

- `jest.fn` → crear mock de método de servicio.
- `mockResolvedValue` → camino feliz (éxito).
- `mockRejectedValue` → camino de error (404, etc.).
- `beforeAll` → levantar app o DB una sola vez.
- `beforeEach` → resetear mocks por test.
- `afterEach` → limpiar datos de integración.
- `afterAll` → cerrar recursos.
- `request(...).expect(...)` → validar contrato HTTP de endpoint.
- `toHaveBeenCalledWith` → validar interacción exacta con dependencia.

## 14) Regla práctica para abarcar todas las funciones del test

Cuando agregues un endpoint nuevo, valida como mínimo:

1. **Éxito** con `mockResolvedValue` (suite rápida) o persistencia real (suite real).
2. **Error esperado** con `mockRejectedValue`/status correspondiente.
3. **Contrato HTTP** (`status`, body completo o parcial).
4. **Interacción interna clave** con `toHaveBeenCalledWith` cuando aplique.
5. **Aislamiento** (sin fuga de estado entre tests).
