import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/question/entities/answer.entity';
import { QuestionService } from 'src/question/question.service';
import { In, Repository } from 'typeorm';
import { AddQuestionDto } from './dto/add-quesiton.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SurveyQuestion } from './entities/survey-question.entity';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyQuestion)
    private readonly surveyQuestionRepository: Repository<SurveyQuestion>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly questionService: QuestionService,
  ) {}

  create(createSurveyDto: CreateSurveyDto) {
    this.surveyRepository.create({});
  }

  findAll() {
    // paginations and order
    return `This action returns all survey`;
  }

  async findOne(id: number) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
    });
    if (!survey) {
      throw new NotFoundException(`Survey #${id} not found`);
    }
    return survey;
  }

  update(id: number, updateSurveyDto: UpdateSurveyDto) {
    //edit title and budget
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    // delete survey
    return `This action removes a #${id} survey`;
  }

  async addQuestion(data: AddQuestionDto) {
    const { surveyId, questionId, answers: answersArray } = data;
    const survey = await this.findOne(surveyId);
    const question = await this.questionService.findOne(questionId);
    const answers = await this.answerRepository.find({
      where: { id: In(answersArray) },
    });
    return await this.surveyQuestionRepository.create({
      survey,
      question,
      answers,
    });
  }

  async updateQuestion(id: number, data: UpdateQuestionDto) {
    const { answers: answersArray } = data;
    const surveyQuestion = await this.surveyQuestionRepository.findOne({
      where: { id },
    });
    if (!surveyQuestion) {
      throw new NotFoundException(`Question in Survey #${id} not found`);
    }
    const answers = await this.answerRepository.find({
      where: { id: In(answersArray) },
    });
    surveyQuestion.answers = answers;
    return this.surveyQuestionRepository.save(surveyQuestion);
  }

  recommendations(id: number) {
    // learnings
    // get learnings
    // survey => question => answer => learning => learning.score
    // multiply all learnings
  }
}
