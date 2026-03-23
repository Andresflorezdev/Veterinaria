# Plan y cobertura de pruebas (Jest + Supertest)

Este documento resume qué se prueba, cómo se ejecuta y qué queda cubierto en la API.

## Objetivo

Agregar y mantener pruebas e2e de endpoints principales usando:

- **Jest** como framework de pruebas.
- **Supertest** para validar requests/responses HTTP.
- **Nest TestingModule** para levantar la app en entorno de test.
- **mongodb-memory-server** para pruebas e2e reales sin tocar la base local.

## Suites disponibles

### 1) Suite rápida (mockeada)

Archivo: `test/app.e2e-spec.ts`

- Levanta controladores reales.
- Mockea servicios (`OwnerService`, `PetService`, `VeterinarianService`, `SeedService`).
- Valida contratos HTTP, códigos de estado y payloads.
- Es ideal para feedback rápido en desarrollo.

### 2) Suite real (integración)

Archivo: `test/app.real.e2e-spec.ts`

- Levanta módulos reales con `MongooseModule.forRoot(mongoUri)`.
- Usa `mongodb-memory-server` para una DB efímera por test run.
- Verifica flujo CRUD real entre entidades relacionadas.
- Limpia colecciones al terminar cada prueba.

## Cobertura de endpoints principales

### Owner

- `POST /owner`
- `GET /owner`
- `GET /owner/:id`
- `PATCH /owner/:id`
- `DELETE /owner/:id`
- Caso de error: `GET /owner/:id` con 404

### Veterinarian

- `POST /veterinarian`
- `GET /veterinarian`
- `GET /veterinarian/:id`
- `PATCH /veterinarian/:id`
- `DELETE /veterinarian/:id`
- Caso de error: `GET /veterinarian/:id` con 404

### Pet

- `POST /pet`
- `GET /pet`
- `GET /pet/:id`
- `GET /pet/:id/exists` (true/false)
- `PATCH /pet/:id`
- `DELETE /pet/:id`
- Caso de error: `GET /pet/:id` con 404

### Seed

- `POST /seed`
- `DELETE /seed`
- `POST /seed/tests/run`
- `POST /seed/tests/run-real`
- `GET /seed/tests/history`
- `GET /seed/tests/history/:id`
- Caso de error: `GET /seed/tests/history/:id` con 404

## Comandos

```bash
npm run test:e2e
npm run test:e2e:real
```

## Qué valida cada tipo de prueba

- **Mockeada**: rutas, status codes, serialización y contrato de respuesta.
- **Real**: integración con Mongoose, persistencia real y relaciones owner-veterinarian-pet.

## Recomendación de uso

- En desarrollo diario: `npm run test:e2e`.
- Antes de merge/release: `npm run test:e2e && npm run test:e2e:real`.

## Guía de buenas prácticas

Para una guía detallada de estructura de suites, hooks (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`), patrones AAA y recomendaciones de mantenimiento, revisa:

- `README_JEST_PRACTICES.md`


