import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Output } from 'src/output/entities/output.entity';
import { OutputService } from 'src/output/output.service';
import { Question } from 'src/question/entities/question.entity';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';
import { Learning } from './entities/learning.entity';

const getRandomInt = (max) => Math.floor(Math.random() * max);

@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(Learning)
    private readonly learningRepository: Repository<Learning>,
    private readonly categoryService: CategoryService,
    private readonly questionService: QuestionService,
    private readonly outputService: OutputService,
  ) {}

  async create(createLearningDto: CreateLearningDto) {
    const { categoryId, input, output: outputId, score } = createLearningDto;
    const category = await this.categoryService.findOne(categoryId);

    const answer = await this.questionService.findAnswer(input);

    const output = await this.outputService.findOne(outputId);

    const learning = this.learningRepository.create({
      category,
      input: answer,
      output,
      score,
    });
    return this.learningRepository.save(learning);
  }

  findAll() {
    return this.learningRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} learning`;
  }

  update(id: number, updateLearningDto: UpdateLearningDto) {
    return `This action updates a #${id} learning`;
  }

  remove(id: number) {
    return `This action removes a #${id} learning`;
  }

  async generatePair(id: number) {
    const category = await this.categoryService.findOne(id);
    const inputs = await this.questionService.findAnswersByCategory(id);
    const outputs = await this.outputService.findByCategory(category);
    const a = getRandomInt(inputs.length);
    const b = getRandomInt(outputs.length);
    return [inputs[a], outputs[b]];
  }
}
