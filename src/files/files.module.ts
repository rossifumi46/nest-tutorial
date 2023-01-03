import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
