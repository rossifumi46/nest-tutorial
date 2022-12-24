import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  readonly text: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  categoryId: number;

  @IsString({ each: true })
  readonly answers: string[];
}
