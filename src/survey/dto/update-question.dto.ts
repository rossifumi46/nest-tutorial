import { IsNumber } from 'class-validator';

export class UpdateQuestionDto {
  @IsNumber({}, { each: true })
  readonly answers: number[];
}
