import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './common/config';
const config = ConfigService.load();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(config.datawow_test.port , '0.0.0.0' , ()=> {
    console.log(`Server running on port ${config.datawow_test.port}`);
  });
}
bootstrap();
