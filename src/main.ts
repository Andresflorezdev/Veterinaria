import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Pet Manangement API')
    .setDescription('API para gestionar mascotas, dueños y veterinarios')
    .setVersion('1.0')
    // eslint-disable-next-line prettier/prettier
    .addTag('pets', 'Operaciones relacionadas con mascotas, dueños y veterinarios')
    .addTag('veterinarians', 'Operaciones relacionadas con veterinarios')
    .addTag('seed', 'Inicializacion de la base de datos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(`Error during bootstrap`, err);
});
