import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {    
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    
    app.enableCors();
    
    await app.listen(process.env.PORT || 4000);

    console.log("**** http://localhost:4000 ****");
}
bootstrap();
