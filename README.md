<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p># 🐾 Veterinary Management API

REST API built with NestJS, MongoDB, and TypeScript for comprehensive veterinary clinic management.

## 📋 Description

This project is a complete REST API for managing a veterinary clinic, handling pets, owners, and veterinarians.  Built with NestJS and MongoDB, it features full CRUD operations, data validation, Swagger documentation, and a seed system for initial data.

## 🚀 Technologies

- **NestJS** v11.0.1 - Progressive Node.js framework
- **TypeScript** v5.7.3 - Typed superset of JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** v8.19.2 - MongoDB object modeling
- **Swagger/OpenAPI** v11.2.1 - API documentation
- **Class Validator** - DTO validation
- **Class Transformer** - Object transformation
- **Jest** - Testing framework

## 📁 Project Structure

```
src/
├── pet/                    # Pet module
│   ├── dto/                # Data Transfer Objects
│   ├── entities/           # Mongoose schemas
│   ├── pet.controller.ts
│   ├── pet.service.ts
│   └── pet.module.ts
├── owner/                  # Owner module
│   ├── dto/
│   ├── entities/
│   ├── owner.controller.ts
│   ├── owner.service.ts
│   └── owner.module.ts
├── veterinarian/           # Veterinarian module
│   ├── dto/
│   ├── entities/
│   ├── veterinarian.controller.ts
│   ├── veterinarian.service.ts
│   └── veterinarian. module.ts
├── seed/                   # Database seeding
│   └── seed. module.ts
├── app. module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🔧 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/Andresflorezdev/Veterinaria. git
cd Veterinaria
```

### Install dependencies

```bash
<<<<<<< HEAD
npm install
```


```

## E2E en este proyecto

- `npm run test:e2e`: valida endpoints con controladores reales y servicios mockeados. Es ideal para feedback rapido.
- `npm run test:e2e:real`: levanta una base de datos temporal en memoria con `mongodb-memory-server` y valida flujos reales contra Mongo.
- La suite real no toca tu base local y limpia los datos al finalizar cada prueba.

## Ejecutar E2E desde Swagger y guardar historial

- En Swagger (`/api/docs`) puedes usar el tag `seed` para ejecutar y consultar corridas de pruebas.
- `POST /seed/tests/run` ejecuta pruebas e2e rapidas (sin body, un clic y listo).
- `POST /seed/tests/run-real` ejecuta pruebas e2e reales (sin body, un clic y listo).
- `GET /seed/tests/history` lista las ultimas ejecuciones.
- `GET /seed/tests/history/{id}` devuelve el detalle de una ejecucion.
- Los resultados se guardan en la coleccion `test_executions` de la misma base (`pets-db`).

## Deployment
>>>>>>> 915a7be (Fix README.md)

Update the MongoDB connection string in `src/app.module.ts`:

```typescript
MongooseModule.forRoot('mongodb://localhost:27017/pets-db')
```

## 🏃‍♂️ Running the App

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

The application will be available at:  `http://localhost:3000`

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation at:

**`http://localhost:3000/api/docs`**

The API includes the following tags:
- **pets** - Operations related to pets, owners, and veterinarians
- **veterinarians** - Veterinarian-specific operations
- **seed** - Database initialization

## 🔌 API Endpoints

### Pets

- **GET** `/pets` - Get all pets
- **GET** `/pets/:id` - Get a pet by ID
- **POST** `/pets` - Create a new pet
- **PATCH** `/pets/:id` - Update a pet
- **DELETE** `/pets/:id` - Delete a pet

### Owners

- **GET** `/owners` - Get all owners
- **GET** `/owners/:id` - Get an owner by ID
- **POST** `/owners` - Create a new owner
- **PATCH** `/owners/:id` - Update an owner
- **DELETE** `/owners/:id` - Delete an owner

### Veterinarians

- **GET** `/veterinarians` - Get all veterinarians
- **GET** `/veterinarians/:id` - Get a veterinarian by ID
- **POST** `/veterinarians` - Create a new veterinarian
- **PATCH** `/veterinarians/:id` - Update a veterinarian
- **DELETE** `/veterinarians/:id` - Delete a veterinarian

### Seed

- **POST** `/seed` - Populate database with initial data

## ✅ Data Validation

The project implements automatic validation using `class-validator`:

- Required fields validation
- Data type validation
- Custom business rules validation
- Automatic whitelist and forbidden properties filtering

## 🎯 Features

- ✨ Complete CRUD operations for all entities
- 🗄️ MongoDB integration with Mongoose ODM
- 📖 Interactive Swagger/OpenAPI documentation
- 🛡️ Global validation pipes
- 🔄 Database seeding system
- 📝 Typed DTOs with TypeScript
- 🎨 Code formatted with Prettier
- 🔍 Linting with ESLint
- ✅ Testing configuration with Jest
- 🏗️ Modular architecture

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test: e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📝 Available Scripts

```bash
npm run build          # Build the project
npm run format         # Format code with Prettier
npm run start          # Start in normal mode
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode
npm run lint           # Run linter
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

## 🗄️ Database Schema

### Pet
- Name
- Species
- Breed
- Age
- Owner reference
- Veterinarian reference

### Owner
- Full name
- Contact information
- Address
- Pets list

### Veterinarian
- Full name
- Specialty
- License number
- Contact information
- Assigned pets

## 🔐 Environment Variables

Create a `.env` file in the root directory: 

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pets-db
```

## 📦 Main Dependencies

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/mongoose": "^11.0.3",
  "@nestjs/swagger": "^11.2.1",
  "mongoose": "^8.19.2",
  "class-validator": "^0.14.2",
  "class-transformer":  "^0.5.1"
}
```

## 🏗️ Architecture

The project follows NestJS best practices:

- **Modular design** - Each entity has its own module
- **Dependency injection** - Services and repositories are injectable
- **DTOs** - Data Transfer Objects for validation
- **Schemas** - Mongoose schemas for MongoDB models
- **Controllers** - Route handlers with decorators
- **Services** - Business logic layer

## 🚀 Deployment

For production deployment:

1. Set environment variables
2. Configure MongoDB connection
3. Build the application:  `npm run build`
4. Run:  `npm run start:prod`

Consider using: 
- **Docker** for containerization
- **PM2** for process management
- **MongoDB Atlas** for cloud database
- **Heroku/AWS/DigitalOcean** for hosting

## 🤝 Contributing

Contributions are welcome! Please: 

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Swagger Documentation](https://swagger.io)
- [MongoDB Documentation](https://docs.mongodb.com)

---

⭐ If this project helped you, don't forget to give it a star! 
er.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
