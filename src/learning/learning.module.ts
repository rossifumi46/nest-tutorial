import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { Learning } from './entities/learning.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { QuestionModule } from 'src/question/question.module';
import { OutputModule } from 'src/output/output.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Learning]),
    CategoryModule,
    QuestionModule,
    OutputModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
