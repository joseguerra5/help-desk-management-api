import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  const port = envService.get('PORT');
  console.log(`🚀 Server is running on http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
