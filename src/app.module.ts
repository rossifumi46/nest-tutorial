import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogsController } from './dogs/dogs.controller';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [CarsModule],
  controllers: [AppController, DogsController],
  providers: [AppService],
})
export class AppModule {}
