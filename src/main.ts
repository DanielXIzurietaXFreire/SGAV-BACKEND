import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = +configService.get<number>(SERVER_PORT) || 3000;

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas enviar cookies o cabeceras de autorización
  });

  await app.listen(port);
  //console.log(`listening on port ${await app.getUrl()}`)
}

bootstrap();
