import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import {
  DataSource,
  ILike,
  Like,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdatePostionDto } from './dto/update-position.dto copy';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { answers: answersData, ...data } = createQuestionDto;
    // rewrite
    const category = await this.categoryRepository.findOneBy({
      id: createQuestionDto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(
        `Category #${createQuestionDto.categoryId} not found`,
      );
    }

    const question = this.questionRepository.create({
      ...data,
      category,
    });

    const result = await this.questionRepository.save(question);

    await Promise.all(
      answersData.map((answer) => this.createAnswer(answer, result)),
    );

    return result;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.questionRepository.find({
      relations: ['category'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!question) {
      throw new NotFoundException(`Question #${id} not found`);
    }
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const { answers: answersData, ...data } = updateQuestionDto;
    const question = await this.questionRepository.preload({
      id,
      ...data,
    });
    if (!question) {
      throw new NotFoundException(`Question #${id} not found`);
    }
    answersData &&
      (await Promise.all(
        updateQuestionDto.answers.map((answer) =>
          this.createAnswer(answer, question),
        ),
      ));
    return this.questionRepository.save(question);
  }

  async remove(id: number) {
    const question = await this.findOne(id);
    return this.questionRepository.remove(question);
  }

  private async createAnswer(
    text: string,
    question: Question,
  ): Promise<Answer> {
    const answer = this.answerRepository.create({ answer: text, question });
    return await this.answerRepository.save(answer);
  }

  async move(id, updatePostionDto: UpdatePostionDto) {
    const question = await this.findOne(id);

    const { position } = updatePostionDto;

    if (position < question.position) {
      await this.questionRepository
        .createQueryBuilder()
        .update(Question)
        .set({ position: () => 'position + 1' })
        .where('position >= :newPosition', { newPosition: position })
        .andWhere('position < :position', { position: question.position })
        .execute();
    } else {
      await this.questionRepository
        .createQueryBuilder()
        .update(Question)
        .set({ position: () => 'position - 1' })
        .where('position <= :newPosition', { newPosition: position })
        .andWhere('position > : position', { position: question.position })
        .execute();
    }
    question.position = position;
    return this.questionRepository.save(question);
  }

  search(searchQuery: SearchQueryDto) {
    const { query, limit, offset } = searchQuery;
    return this.questionRepository.find({
      where: [
        {
          text: ILike(`%${query}%`),
        },
        {
          description: ILike(`%${query}%`),
        },
      ],
      skip: offset,
      take: limit,
    });
  }

  findAnswer(id: number) {
    const answer = this.answerRepository.findOneBy({ id });
    if (!answer) {
      throw new NotFoundException(`Answer #${id} not found`);
    }
    return answer;
  }

  findAnswersByCategory(id: number): Promise<Answer[]> {
    return this.answerRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .where('question.categoryId = :id', { id })
      .execute();
  }
}
