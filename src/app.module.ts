import { Module } from '@nestjs/common';
import { CompraModule } from './compra/compra.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import the ConfigModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule here as well
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get('MONGO_URL'), // Use the configuration key here
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
        synchronize: true,
        useNewUrlParser: true,
        logging: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
    CompraModule,
  ],
  providers: [AppService],
})
export class AppModule {}
