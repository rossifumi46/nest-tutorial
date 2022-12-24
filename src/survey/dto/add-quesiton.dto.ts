import { IsNumber } from 'class-validator';

export class AddQuestionDto {
  @IsNumber()
  readonly surveyId: number;

  @IsNumber()
  readonly questionId: number;

  @IsNumber({}, { each: true })
  readonly answers: number[];
}
